import { validationResult } from 'express-validator'

const homeRender = (req, res) => {res.render('home/index',{pagina: 'Congreso | AMMFEN'})}
const instruccionesRender = (req, res) => {res.render('home/instrucciones',{pagina: 'Instrucciones | AMMFEN'})}
const contactoRender = (req, res) => {res.render('home/contacto',{pagina: 'Contacto | AMMFEN'})}
const bienvenidaRender = (req, res) => {res.render('home/bienvenida',{pagina: 'Bienvenida | AMMFEN'})}
const programaRender = (req, res) => {res.render('home/programa',{pagina: 'Programa | AMMFEN'})}
const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}
export {homeRender, instruccionesRender, contactoRender, bienvenidaRender, noEncontrado, programaRender}