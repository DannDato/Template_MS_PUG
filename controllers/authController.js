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
            if (!req.user) {
                req.flash('error', 'No fue posible autenticar al usuario');
                return res.redirect(`${process.env.FOLDER}/auth/login`);
            }

            const usuarioId = req.user.userid || req.user.codigo;

            if (!usuarioId) {
                req.flash('error', 'No se pudo determinar el identificador del usuario');
                return res.redirect(`${process.env.FOLDER}/auth/login`);
            }

            console.log('Usuario autenticado:', usuarioId);
            
            // Guardar en sesión
            req.session.usuarioId = usuarioId;
            
            // Generar token JWT para uso interno (si aplica en otras rutas)
            req.session.jwt = generarJWT(usuarioId);
            
            // Redirigir a home
            return res.redirect(`${process.env.FOLDER}/user/`);
            
        } catch (error) {
            console.error('Error en autenticación:', error.message);
            req.flash('error', 'Error en el proceso de autenticación');
            return res.redirect(`${process.env.FOLDER}/auth/login`);
        }
    }

    cerrarSesion = (req, res, next) => {
        req.logout((error) => {
            if (error) {
                return next(error);
            }

            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                res.redirect(`${process.env.FOLDER}/auth/login`);
            });
        });
    }

}

export default new authController()
