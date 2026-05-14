import { validationResult } from 'express-validator'

const homeRender = (req, res) => {res.render('home/index',{pagina: 'Jornadas'})}
const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}
export {homeRender, noEncontrado}