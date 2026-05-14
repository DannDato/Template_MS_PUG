import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'express-flash'
import passport from 'passport'
import 'dotenv/config'
import homeRoutes from './routes/homeRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import pool from './config/db.js'
import './middleware/passport.js'
// Crear la app
const app = express()

// Habilitar lectura de datos de formulario

app.use( express.urlencoded({extended: true}))
app.use(express.json());

// habilitar cookie parser

app.use( cookieParser() )

// Configurar session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretoSuperSeguro2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}))

// Inicializar passport
app.use(passport.initialize())
app.use(passport.session())

// Habilitar flash messages
app.use(flash())

app.use((req, res, next) => {
    // res.locals hace que la variable esté disponible en TODAS las vistas automáticamente
    res.locals.folder = process.env.FOLDER || '';
    res.locals.user = req.user || null;
    next();
});



// habiliar csrf

app.use( csrf({cookie: true}))


// conexion a la bd

try{
    const conexion = await pool.getConnectionAsync();
    conexion.release();
    console.log('Conexion correcta a la base de datos');
} catch(error){
    console.error('Error al conectar a la base de datos:', error.message);
}

//habilitat pug
app.set('view engine', 'pug')
app.set('views', './views')
// carpeta publica

app.use( express.static('public'))

// Routing
app.use(`/auth`, authRoutes)
app.use(`/`, homeRoutes)
app.use(`/user`, userRoutes)
// Definir un puesto y arranca el proyecto
// if (process.env.NODE_ENV === 'production') {
//     import("./cron/scheduler.js")
//         .then(module => {
//             console.log("Scheduler iniciado en producción");
//         })
//         .catch(err => console.error(err));
// }

console.log("Servidor iniciado...");
const port = process.env.PORT || 3400;
const backendUrl = process.env.BACKEND_URL || 'http://localhost';

app.listen(port, ()=> {
    console.log(`El servidor esta funcionando en ${backendUrl}:${port}/`);
});
