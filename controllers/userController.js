

class userController {
    static start(req, res) {
        const flashMessages = req.flash('error') || [];
        const errores = flashMessages.map(err => {
            if (typeof err === 'string') {
                return { msg: err };
            }
            return err;
        });

        res.render('user/start', {
            pagina: 'Jornadas',
            csrfToken: req.csrfToken(),
            errores
        });
    }
    static perfil(req, res) {
        const flashMessages = req.flash('error') || [];
        const errores = flashMessages.map(err => {
            if (typeof err === 'string') {
                return { msg: err };
            }
            return err;
        });

        res.render('user/perfil', {
            pagina: 'Jornadas',
            csrfToken: req.csrfToken(),
            errores
        });
    }
}
export { userController };