

const isNotLoggedIn = () => {
    return async (req, res, next) => {
        try {
            if (req.isAuthenticated()) {
                console.log("Usuario ya autenticado, redirigiendo a start...");
                req.flash('error', 'Ya has iniciado sesión');
                return res.redirect(`${process.env.FOLDER}/user/`);
            }
            next();
        } catch (error) {
            console.error(error);
            req.flash('error', 'Error interno');
            return res.redirect(`${process.env.FOLDER}/auth/cerrar-sesion`);
        }
    };
};

export default isNotLoggedIn;