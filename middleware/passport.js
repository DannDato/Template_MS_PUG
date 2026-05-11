import passport from 'passport';
import LocalStrategy from 'passport-local';
import pool from '../config/db.js';
import { hashPassword, matchPassword } from '../helpers/index.js';
import ws from '../webServices/siiau.js';

passport.use(
    "local.login",
    new LocalStrategy.Strategy(
        {
            usernameField: "codigo",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req, codigo, password, done) => {
            try {
                let login_error = false;
                let login_message = '';
                let user = [];
                let databaseAvailable = true;

                if (!codigo) {
                    return done(null, false, { message: 'El código es obligatorio' });
                }

                // Busca usuario en base de datos
                try {
                    user = await pool.query(
                        `SELECT a.codigo AS userid, a.nombre, a.password, a.email
                         FROM Usuario a
                         WHERE a.codigo = ?`,
                        [codigo]
                    );
                } catch (dbError) {
                    databaseAvailable = false;
                    console.error('BD no disponible, se intentara autenticacion via SIIAU:', dbError.message);
                }

                console.log('Usuario encontrado:', user.length > 0 ? user[0].userid : 'No');

                // Si existe y tiene contraseña almacenada, verifica
                if (user.length > 0 && user[0].password) {
                    const storedPassword = user[0].password;
                    const looksHashed = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');

                    let localPasswordOk = false;
                    if (looksHashed) {
                        localPasswordOk = await matchPassword(password, storedPassword);
                    } else {
                        // Soporte temporal para contraseñas legadas en texto plano
                        localPasswordOk = password === storedPassword;
                    }

                    if (localPasswordOk) {
                        return done(null, user[0]);
                    }
                }

                // Si no existe o contraseña no coincide, verifica en webservice SIIAU
                console.log('Validando en webservice SIIAU...');
                let wsResult = await ws.postData('validaUsuario', { codigo: codigo, nip: password });

                if (wsResult.error !== undefined) {
                    login_error = true;
                    login_message = wsResult.error;
                } else if (wsResult.respuesta !== undefined) {
                    login_error = true;
                    login_message = 'La contraseña es incorrecta';
                }

                if (!login_error && wsResult.nombre) {
                    // Usuario validado por webservice

                    const webserviceUser = {
                        userid: codigo,
                        nombre: wsResult.nombre || '',
                        email: wsResult.email || ''
                    };

                    if (user.length > 0) {
                        // Actualiza contraseña en BD
                        if (databaseAvailable) {
                            try {
                                const hashedPassword = await hashPassword(password);
                                await pool.query(
                                    'UPDATE Usuario SET password = ? WHERE codigo = ?',
                                    [hashedPassword, codigo]
                                );
                                console.log('Contraseña actualizada para usuario:', codigo);
                            } catch (err) {
                                console.error('Error al actualizar contraseña:', err.message);
                            }
                        }
                        return done(null, user[0]);
                    } else {
                        // Crea nuevo usuario
                        if (databaseAvailable) {
                            const hashedPassword = await hashPassword(password);
                            try {
                                await pool.query(
                                    'INSERT INTO Usuario (codigo, nombre, email, password) VALUES (?, ?, ?, ?)',
                                    [codigo, wsResult.nombre || '', wsResult.email || '', hashedPassword]
                                );
                                console.log('Nuevo usuario creado:', codigo);
                            } catch (err) {
                                console.error('Error al crear usuario:', err.message);
                            }
                        }

                        // Si no hay BD, aun asi permite login al validarse en SIIAU
                        return done(null, webserviceUser);
                    }
                } else {
                    console.log(codigo + ' -> ' + (login_message || 'Error de autenticación'));
                    return done(null, false, { message: login_message || 'Credenciales inválidas' });
                }

            } catch (error) {
                console.error('Error en autenticación:', error.message);
                return done(null, false, { message: 'No fue posible iniciar sesión en este momento' });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.userid || user.codigo);
});

passport.deserializeUser(async (userid, done) => {
    try {
        const user = await pool.query("SELECT * FROM Usuario WHERE codigo = ?", [userid]);
        done(null, user[0] || null);
    } catch (error) {
        console.error('Error en deserializeUser, se usa fallback mínimo:', error.message);
        done(null, { userid });
    }
});
