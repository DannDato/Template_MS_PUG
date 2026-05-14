import express  from "express"
import { homeRender, noEncontrado, }  from '../controllers/homeController.js'
import isNotLoggedIn from "../middleware/isNotLoggedIn.js"
const router = express.Router()

router.get('/', isNotLoggedIn(), homeRender)
router.get('/home', isNotLoggedIn(), homeRender)
router.get('/404', noEncontrado)
export default router