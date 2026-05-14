import express  from "express"
import {userController}  from '../controllers/userController.js'
import isLoggedIn from '../middleware/isLoggedIn.js'
const router = express.Router()

router.get('/', isLoggedIn("user"), userController.start)
router.get('/perfil', isLoggedIn("user"), userController.perfil)
export default router