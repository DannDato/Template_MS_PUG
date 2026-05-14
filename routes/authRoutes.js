import express from "express";
import authController from '../controllers/authController.js'
import passport from 'passport'

const router = express.Router();

router.get('/login', authController.formularioLogin);
router.post('/login',
    passport.authenticate('local.login', {
        failureRedirect: `${process.env.FOLDER}/auth/login?error=true`,
        failureFlash: true,
        failureMessage: true,
    }),
    (req, res) => {
        console.log('Autenticación exitosa, redirigiendo a home...');
        authController.autenticar(req, res);
    }
);
router.get('/olvide-password', (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar Contraseña',
        csrfToken: req.csrfToken()
    });
});

router.get('/cerrar-sesion', authController.cerrarSesion);

export default router