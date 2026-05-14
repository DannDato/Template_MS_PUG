import passport from 'passport';
import LocalStrategy from 'passport-local';
import pool from '../config/db.js';
import { hashPassword, matchPassword } from '../helpers/index.js';
import ws from '../webServices/siiau.js';

const isPasswordTemp = (value) => {
    if (value === undefined || value === null) {
        return false;
    }

    const normalized = String(value).trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'si' || normalized === 'yes';
};

const normalizeAuthUser = (user = {}) => ({
    userid: user.userid || user.codigo || '',
    codigo: user.codigo || user.userid || '',
    nombre: user.nombre || '',
    tipo_usuario: user.tipo_usuario || '',
    password_temp: user.password_temp || 0
});

const parseWsResponse = (wsResult = {}) => {
    if (!wsResult || typeof wsResult !== 'object') {
        return { ok: false, message: 'Respuesta inválida del servicio de autenticación' };
    }

    if (wsResult.error) {
        return { ok: false, message: wsResult.error };
    }

    if (Object.prototype.hasOwnProperty.call(wsResult, 'respuesta')) {
        if (wsResult.respuesta === true || wsResult.respuesta === 'true' || wsResult.respuesta === 1 || wsResult.respuesta === '1') {
            return {
                ok: true,
                message: 'Usuario validado por SIIAU',
                nombre: wsResult.nombre || '',
                tipo_usuario: wsResult?.datos?.[0]?.tipoUsuario || ''
            };
        }

        return { ok: false, message: 'La contraseña es incorrecta' };
    }

    if (wsResult.nombre) {
        return {
            ok: true,
            message: 'Usuario validado por SIIAU',
            nombre: wsResult.nombre,
            tipo_usuario: wsResult?.datos?.[0]?.tipoUsuario || ''
        };
    }

    return { ok: false, message: 'No fue posible validar el usuario en SIIAU' };
};

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
                const cleanCodigo = (codigo || '').trim();
                const cleanPassword = (password || '').trim();

                let user = null;
                let databaseAvailable = true;

                if (!cleanCodigo) {
                    return done(null, false, { message: 'El código es obligatorio' });
                }

                if (!cleanPassword) {
                    return done(null, false, { message: 'La contraseña es obligatoria' });
                }

                // Busca usuario en base de datos
                try {
                    const users = await pool.query(
                        `SELECT a.userid, a.password, a.password_temp
                         FROM clav_siia a
                         WHERE a.userid = ?`,
                        [cleanCodigo]
                    );

                    user = users[0] || null;
                } catch (dbError) {
                    databaseAvailable = false;
                    console.error('BD no disponible, se intentara autenticacion via SIIAU:', dbError.message);
                }

                console.log('Usuario encontrado:', user?.userid || 'No');

                // Si existe y tiene contraseña almacenada, verifica
                if (user && user.password && !isPasswordTemp(user.password_temp)) {
                    const storedPassword = user.password;
                    const looksHashed = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');

                    let localPasswordOk = false;
                    if (looksHashed) {
                        localPasswordOk = await matchPassword(cleanPassword, storedPassword);
                    } else {
                        // Soporte temporal para contraseñas legadas en texto plano
                        localPasswordOk = cleanPassword === storedPassword;
                    }

                    if (localPasswordOk) {
                        return done(null, normalizeAuthUser(user));
                    }
                }

                // Si no existe o contraseña no coincide, verifica en webservice SIIAU
                console.log('Validando en webservice SIIAU...');
                const wsResult = await ws.postData('validaUsuario', { codigo: cleanCodigo, nip: cleanPassword });
                const wsValidation = parseWsResponse(wsResult);

                if (!wsValidation.ok) {
                    console.log(cleanCodigo + ' -> ' + wsValidation.message);
                    return done(null, false, { message: wsValidation.message || 'Credenciales inválidas' });
                }

                if (databaseAvailable) {
                    try {
                        const hashedPassword = await hashPassword(cleanPassword);

                        if (user) {
                            await pool.query(
                                'UPDATE clav_siia SET password = ?, password_temp = 0 WHERE userid = ?',
                                [hashedPassword, cleanCodigo]
                            );
                            console.log('Contraseña actualizada para usuario:', cleanCodigo);
                        } else {
                            await pool.query(
                                'INSERT INTO clav_siia (userid, password, password_temp) VALUES (?, ?, 0)',
                                [cleanCodigo, hashedPassword]
                            );
                            console.log('Nuevo usuario creado en clav_siia:', cleanCodigo);
                        }
                    } catch (err) {
                        console.error('Error al sincronizar contraseña local:', err.message);
                    }
                }

                return done(null, normalizeAuthUser({
                    userid: cleanCodigo,
                    codigo: cleanCodigo,
                    nombre: wsValidation.nombre || user?.nombre || '',
                    tipo_usuario: wsValidation.tipo_usuario || user?.tipo_usuario || '',
                    password_temp: 0
                }));

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
        const user = await pool.query(
            'SELECT userid, userid AS codigo, password_temp FROM clav_siia WHERE userid = ?',
            [userid]
        );

        if (!user || user.length === 0) {
            return done(null, { userid, codigo: userid });
        }

        done(null, normalizeAuthUser(user[0]));
    } catch (error) {
        console.error('Error en deserializeUser, se usa fallback mínimo:', error.message);
        done(null, { userid, codigo: userid });
    }
});
