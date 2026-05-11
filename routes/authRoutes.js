import express from "express";
import authController from '../controllers/authController.js'
import passport from 'passport'

const router = express.Router();

router.get('/login', authController.formularioLogin);
router.post('/login',
    passport.authenticate('local.login', {
        failureRedirect: '/auth/login',
        failureFlash: true,
        failureMessage: true
    }),
    authController.autenticar
);

router.get('/logout', authController.cerrarSesion);

export default router