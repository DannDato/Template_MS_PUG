import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import usuarioRoutes from './routes/userRoutes.js'
import homeRoutes from './routes/homeRoutes.js'
import extraRoutes from './routes/extraRoutes.js'
import pool from './config/db.js'
// Crear la app
const app = express()

// Habilitar lectura de datos de formulario

app.use( express.urlencoded({extended: true}))
app.use(express.json());

// habilitar cookie parser

app.use( cookieParser() )

app.use((req, res, next) => {
    // res.locals hace que la variable esté disponible en TODAS las vistas automáticamente
    res.locals.folder = process.env.FOLDER || '';
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

// Reuting
app.use(`/auth`, authRoutes)
app.use(`/admin`, adminRoutes)
app.use(`/user`, usuarioRoutes)
app.use(`/`, homeRoutes)
app.use('/info', extraRoutes)
// Definir un puesto y arranca el proyecto
if (process.env.NODE_ENV === 'production') {
    import("./cron/scheduler.js")
        .then(module => {
            console.log("Scheduler iniciado en producción");
        })
        .catch(err => console.error(err));
}

console.log("Servidor iniciado...");
const port = process.env.PORT || 3200;
const backendUrl = process.env.BACKEND_URL || 'http://localhost';

app.listen(port, ()=> {
    console.log(`El servidor esta funcionando en ${backendUrl}:${port}/`);
});