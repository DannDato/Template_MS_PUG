import express  from "express"
import { homeRender, instruccionesRender, contactoRender, noEncontrado, bienvenidaRender, programaRender }  from '../controllers/homeController.js'
const router = express.Router()

router.get('/', homeRender)
router.get('/home', homeRender)
router.get('/instrucciones', instruccionesRender)
router.get('/contacto', contactoRender)
router.get('/bienvenida', bienvenidaRender)
router.get('/programa', programaRender)
router.get('/404', noEncontrado)
export default router