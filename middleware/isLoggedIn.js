import pool from '../config/db.js';


const isLoggedIn = (user = "user") => {
    return async (req, res, next) => {
        try {
            if (!req.isAuthenticated()){
                console.log('Usuario no autenticado');
                req.flash('error', 'Debes iniciar sesión');
                return res.redirect(`${process.env.FOLDER}/auth/cerrar-sesion`);
            }

            const [results] = await pool.promise().query(
                'SELECT * FROM jornadas_admins WHERE codigo = ?',
                [req.user.id]
            );

            req.user.isAdmin = results.length > 0;

            if (req.user.isAdmin) {
                req.user.idJornAdmin = results[0].ID_JORN || null;
                req.user.permissions = results[0].permissions || null;
            }

            if (user === "admin" && !req.user.isAdmin) {
                console.log('Usuario autenticado pero sin permisos de admin');
                req.flash('error', 'No tienes permisos');
                return res.redirect(`${process.env.FOLDER}/auth/cerrar-sesion`);
            }
            next();

        } catch (error) {
            console.error(error);
            req.flash('error', 'Error interno');
            return res.redirect(`${process.env.FOLDER}/auth/cerrar-sesion`);
        }
    };
};

export default isLoggedIn;