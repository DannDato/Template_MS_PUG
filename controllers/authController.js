import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'
import { generarJWT,generarId } from '../helpers/tokens.js';

class authController {

    formularioLogin = (req, res) => {
        res.render('auth/login',{
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
        });
    }
    autenticar = async (req, res) => {
        const folder = process.env.FOLDER || '';
        await check('email').isEmail().withMessage('El email es obligatorio').run(req)
        await check('password').notEmpty().withMessage('El password es obligatorio').run(req)
        let resultado = validationResult(req)

        if(!resultado.isEmpty()){
            return res.render('auth/login',{
                pagina: 'Iniciar sesión ',
                csrfToken : req.csrfToken(),
                errores: resultado.array(),
            })
        }

        return res.send('Autenticando...')

    }

}

export default new authController()
