import express from "express";
import authController from '../controllers/authController.js'

const router = express.Router();


router.get('/login', authController.formularioLogin);
router.post('/login', authController.autenticar);

export default router