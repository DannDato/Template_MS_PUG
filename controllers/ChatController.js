
// ===============================
// USUARIO
// ===============================

// Abrir chat del usuario
export const abrirChatUsuario = async (req, res) => {
    const usuarioId = req.usuario.id;

    const [chat] = await Chats.findOrCreate({
        where: { usuario_id: usuarioId }
    });

    res.render('user/message', {
        chatId: chat.id,
        csrfToken: req.csrfToken(),
    });
};


// Obtener mensajes del usuario
// export const obtenerMensajesUsuario = async (req, res) => {
//     const usuarioId = req.usuario.id;

//     const chat = await Chats.findOne({
//         where: { usuario_id: usuarioId }
//     });

//     if (!chat) return res.json([]);

//     const mensajes = await Mensaje.findAll({
//         where: { chat_id: chat.id },
//         include: [{
//             model: Usuario,
//             as: 'emisor',
//             attributes: ['id', 'nombre', 'rol']
//         }],
//         order: [['creado_en', 'ASC']]
//     });

//     res.json(mensajes);
// };
export const mensajes_no_leidos = async (req, res) => {
    const usuarioId = req.usuario.id;

    const chat = await Chats.findOne({
        where: { usuario_id: usuarioId }
    });
    res.json({ no_leidos: chat ? await Mensaje.count({ where: { chat_id: chat.id, leido: false, emisor_rol: 'admin' } }) : 0 });
}
export const obtenerMensajesUsuario = async (req, res) => {
    const usuarioId = req.usuario.id;

    // Crear chat si no existe
    const [chat] = await Chats.findOrCreate({
        where: { usuario_id: usuarioId },
        defaults: { bot_bienvenida_enviada: false }
    });
    console.log('Chat encontrado o creado:', chat.toJSON());
    // Obtener mensajes del chat
    const mensajes = await Mensaje.findAll({
        where: { chat_id: chat.id },
        order: [['creado_en', 'ASC']],
    });
    await Mensaje.update(
        { leido: true },
        {
            where: {
                chat_id: chat.id,
                leido: false,
                emisor_rol: 'admin'
            }
        }
    );
    // Enviar JSON con mensajes y flag de bienvenida
    res.json({
        chatId: chat.id,
        botBienvenidaEnviada: chat.bot_bienvenida_enviada,
        mensajes,
    });
};

// Enviar mensaje del usuario
export const enviarMensajeUsuario = async (req, res) => {
    const usuarioId = req.usuario.id;
    const { texto } = req.body;
    const chat = await Chats.findOne({ where: { usuario_id: usuarioId } });
    if (!chat) { return res.status(404).json({ error: 'Chat no encontrado' }); }
    const mensaje = await Mensaje.create({ chat_id: chat.id, emisor_id: usuarioId, emisor_rol: req.usuario.rol, mensaje: texto });
    if (!chat.bot_bienvenida_enviada) {
        await Mensaje.create({
            chat_id: chat.id,
            emisor_id: usuarioId,
            emisor_rol: 'bot',
            mensaje: `Gracias por comunicarte con el Congreso AMMFEN 2026,
            En un momento uno de nuestros asesores se pondrá en contacto contigo.`,
            leido: true
        });
        chat.bot_bienvenida_enviada = true;
        await chat.save();
    }
    res.json(mensaje);
};

// ===============================
// ADMIN
// ===============================

// Listar todos los chats
export const listarChatsAdmin = async (req, res) => {
    const chats = await Chats.findAll({
        include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
        }],
        order: [['id', 'DESC']]
    });

    res.render('admin/chats', {
        chats
    });
};


// Ver chat específico
export const verChatAdmin = async (req, res) => {
    const { id } = req.params;

    const chat = await Chats.findByPk(id, {
        include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email']
        }]
    });

    if (!chat) {
        return res.redirect('/admin/chats');
    }

    res.render('admin/chat', {
        chatId: chat.id,
        usuario: chat.usuario
    });
};


// Obtener mensajes para admin
export const obtenerMensajesAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await Chats.findOne({
            where: { usuario_id: id }
        });

        if (!chat) {
            return res.json([]);
        }

        const mensajes = await Mensaje.findAll({
            where: { chat_id: chat.id },
            include: [{
                model: Usuario,
                as: 'emisor',
                attributes: ['id', 'nombre', 'rol']
            }],
            order: [['creado_en', 'ASC']]
        });
        await Mensaje.update(
            { leido: true },
            {
                where: {
                    chat_id: chat.id,
                    leido: false,
                    emisor_rol: 'user'
                }
            }
        );

        //console.log('Mensajes obtenidos para admin:', mensajes.map(m => m.toJSON()));
        res.json(mensajes);

    } catch (error) {
        console.error('Error obteniendo mensajes admin:', error);
        res.status(500).json({ error: 'Error obteniendo mensajes' });
    }
};



// Enviar mensaje del admin
export const enviarMensajeAdmin = async (req, res) => {
    try {
        const adminId = req.usuario.id;
        const { id } = req.params;
        const { texto } = req.body;

        if (!texto || texto.trim() === '') {
            return res.status(400).json({ error: 'El mensaje está vacío' });
        }

        // 👇 BUSCAMOS EL CHAT
        let chat = await Chats.findOne({
            where: { usuario_id: id }
        });

        // 👇 SI NO EXISTE, LO CREAMOS
        if (!chat) {
            chat = await Chats.create({
                usuario_id: id,
                bot_bienvenida_enviada: true
            });
        }

        const mensaje = await Mensaje.create({
            chat_id: chat.id,
            emisor_id: adminId,
            emisor_rol: 'admin',
            mensaje: texto.trim(),
            leido: false
        });

        res.json({
            ok: true,
            mensaje
        });

    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
};


