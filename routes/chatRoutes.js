import express from 'express';
import { 
    abrirChatUsuario,
    obtenerMensajes,
    enviarMensaje
} from '../controllers/ChatController.js';
import protegerRuta from '../middleware/protegerRuta.js';

const router = express.Router();

router.get('/message', protegerRuta, abrirChatUsuario);
router.get('/api/mensajes', protegerRuta, obtenerMensajes);
router.post('/api/mensajes', protegerRuta, enviarMensaje);

export default router;
