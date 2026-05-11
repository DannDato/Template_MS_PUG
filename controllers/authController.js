import { generarJWT } from '../helpers/tokens.js';

class authController {

    formularioLogin = (req, res) => {
        const flashErrors = req.flash('error') || [];
        const flashMessages = req.flash('message') || [];

        const errores = flashErrors.map((err) => {
            if (typeof err === 'string') {
                return { msg: err };
            }
            return err;
        });

        res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores,
            messages: flashMessages
        });
    }
    
    autenticar = async (req, res) => {
        try {
            // Si llegamos aquí, passport ya autenticó al usuario
            // req.user contiene los datos del usuario autenticado
            
            const usuarioId = req.user.userid || req.user.codigo;
            console.log('Usuario autenticado:', usuarioId);
            
            // Guardar en sesión
            req.session.usuarioId = usuarioId;
            
            // Generar token JWT opcional
            generarJWT(usuarioId);
            
            // Redirigir a home
            res.redirect('/');
            
        } catch (error) {
            console.error('Error en autenticación:', error.message);
            res.render('auth/login', {
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: [{ msg: 'Error en el proceso de autenticación' }]
            });
        }
    }

    cerrarSesion = (req, res, next) => {
        req.logout((error) => {
            if (error) {
                return next(error);
            }

            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect('/auth/login');
            });
        });
    }

}

export default new authController()
