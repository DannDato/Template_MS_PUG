import nodemailer from 'nodemailer'
const emailRegistros = async (datos) => {
    var transport = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_post,
        auth: {
            user: process.env.email_user,
            pass: process.env.email_pass
        }
    });

    const { email, nombre, token } = datos

    await transport.sendMail({
        from: 'ammfen.mx',
        to: email,
        subject: `Confirma tu cuenta en ${process.env.APP_URL}`,
        text: `Confirma tu cuenta en ${process.env.APP_URL}`,
        html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirma tu cuenta AMMFEN</title>
                    <style>
                        /* Resets básicos para clientes de correo */
                        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                        /* Estilos específicos para móviles */
                        @media only screen and (max-width: 600px) {
                            .container { width: 100% !important; padding: 0 !important; }
                            .content { padding: 20px !important; }
                            .button { width: 100% !important; display: block !important; text-align: center !important; }
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
                        <tr>
                            <td align="center">

                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

                                    <tr>
                                        <td style="
                                            background: #effaff; /* Color de respaldo si el degradado falla */
                                            background: linear-gradient(to right, #daf4ff 0%, #99d6e7 100%);
                                            border-left: 8px solid #0f2a35;
                                            padding: 50px 40px;
                                            text-align: left;
                                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                        ">

                                            <p style="
                                                color: #455a64;
                                                font-size: 15px;
                                                font-style: italic;
                                                margin: 0 0 5px 0;
                                                font-family: Georgia, Times, 'Times New Roman', serif; /* Fuente serif para un toque elegante */
                                            ">
                                                La Universidad de Guadalajara presenta
                                            </p>

                                            <h1 style="
                                                color: #003d5b;
                                                margin: 0;
                                                font-size: 38px;
                                                font-weight: 900;
                                                line-height: 1;
                                                text-transform: uppercase;
                                                letter-spacing: -0.5px;
                                            ">
                                                XXXIX CONGRESO NACIONAL<br>AMMFEN
                                            </h1>

                                            <p style="
                                                color: #0f2a35;
                                                font-size: 16px;
                                                font-weight: 700;
                                                margin: 25px 0 5px 0;
                                                text-transform: uppercase;
                                                letter-spacing: 1px;
                                            ">
                                                GUADALAJARA | 2026
                                            </p>

                                            <p style="
                                                color: #455a64;
                                                font-size: 16px;
                                                margin: 0 0 20px 0;
                                            ">
                                                Del 18 al 20 de marzo del 2026
                                            </p>

                                            <div style="
                                                background-color: #CA8A04; /* Naranja quemado */
                                                height: 4px;
                                                width: 50px;
                                                margin-bottom: 20px;
                                                border-radius: 2px;
                                            "></div>

                                            <p style="
                                                color: #455a64;
                                                font-size: 15px;
                                                font-style: italic;
                                                margin: 0;
                                                font-family: Georgia, Times, 'Times New Roman', serif;
                                            ">
                                                Conectar, crear e innovar en nutrición
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="content" style="padding: 40px 40px 20px 40px;">
                                            <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">¡Hola ${nombre} </h2>

                                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 20px 0; text-align: center;">
                                                Gracias por registrarte en el portal del congreso AMMFEN. Para continuar con tu proceso de inscripción a talleres y generar tus referencias de pago, necesitamos validar que este correo es tuyo.
                                            </p>

                                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0; text-align: center;">
                                                Solo presiona el botón de abajo:
                                            </p>

                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center">
                                                        <a href="${process.env.EMAIL_URL}/auth/confirmar/${token}"
                                                        style="display: inline-block; background-color: #237468; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 30px; border-radius: 8px;">
                                                            Confirmar cuenta
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            <br><br>
                                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0; text-align: center;">
                                                <strong>Es importante</strong> confirmar tu cuenta, de no hacerlo no podrás iniciar sesión despues
                                            </p>


                                            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                                            <p style="color: #6b7280; font-size: 12px; line-height: 18px; text-align: center; margin: 0;">
                                                Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
                                            </p>
                                            <p style="text-align: center; margin: 10px 0 0 0;">
                                                <a href="${process.env.EMAIL_URL}/auth/confirmar/${token}" style="color: #CA8A04; font-size: 12px; word-break: break-all;">
                                                    "${process.env.EMAIL_URL}/auth/confirmar/${token}"
                                                </a>
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                                &copy; 2026 AMMFEN. Todos los derechos reservados.
                                            </p>
                                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                                                Este correo fue enviado automáticamente, por favor no respondas a este mensaje.
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40">
                                    <tr><td></td></tr>
                                </table>

                            </td>
                        </tr>
                    </table>

                </body>
                </html>
            `
    })
}
const emailOlvidePassword = async (datos) => {
    var transport = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_post,
        auth: {
            user: process.env.email_user,
            pass: process.env.email_pass
        }
    });

    const { email, nombre, token } = datos

    await transport.sendMail({
        from: 'ammfen.mx',
        to: email,
        subject: 'Restablece tu password en cucs.udg.mx/ammfen',
        text: 'Restablece tu password en cucs.udg.mx/ammfen',
        html: `
            <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Olvide mi contraseña AMMFEN</title>
                    <style>
                        /* Resets básicos para clientes de correo */
                        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                        /* Estilos específicos para móviles */
                        @media only screen and (max-width: 600px) {
                            .container { width: 100% !important; padding: 0 !important; }
                            .content { padding: 20px !important; }
                            .button { width: 100% !important; display: block !important; text-align: center !important; }
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
                        <tr>
                            <td align="center">

                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

                                    <tr>
                                        <td style="
                                            background: #effaff; /* Color de respaldo si el degradado falla */
                                            background: linear-gradient(to right, #daf4ff 0%, #99d6e7 100%);
                                            border-left: 8px solid #0f2a35;
                                            padding: 50px 40px;
                                            text-align: left;
                                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                        ">

                                            <p style="
                                                color: #455a64;
                                                font-size: 15px;
                                                font-style: italic;
                                                margin: 0 0 5px 0;
                                                font-family: Georgia, Times, 'Times New Roman', serif; /* Fuente serif para un toque elegante */
                                            ">
                                                La Universidad de Guadalajara presenta
                                            </p>

                                            <h1 style="
                                                color: #003d5b;
                                                margin: 0;
                                                font-size: 38px;
                                                font-weight: 900;
                                                line-height: 1;
                                                text-transform: uppercase;
                                                letter-spacing: -0.5px;
                                            ">
                                                XXXIX CONGRESO NACIONAL<br>AMMFEN
                                            </h1>

                                            <p style="
                                                color: #0f2a35;
                                                font-size: 16px;
                                                font-weight: 700;
                                                margin: 25px 0 5px 0;
                                                text-transform: uppercase;
                                                letter-spacing: 1px;
                                            ">
                                                GUADALAJARA | 2026
                                            </p>

                                            <p style="
                                                color: #455a64;
                                                font-size: 16px;
                                                margin: 0 0 20px 0;
                                            ">
                                                Del 18 al 20 de marzo del 2026
                                            </p>

                                            <div style="
                                                background-color: #CA8A04; /* Naranja quemado */
                                                height: 4px;
                                                width: 50px;
                                                margin-bottom: 20px;
                                                border-radius: 2px;
                                            "></div>

                                            <p style="
                                                color: #455a64;
                                                font-size: 15px;
                                                font-style: italic;
                                                margin: 0;
                                                font-family: Georgia, Times, 'Times New Roman', serif;
                                            ">
                                                Conectar, crear e innovar en nutrición
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="content" style="padding: 40px 40px 20px 40px;">
                                            <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">¡Hola ${nombre}</h2>

                                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 20px 0; text-align: center;">
                                                has solicitado restablecer tu contraseña en cucs.udg.mx/ammfen
                                            </p>

                                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0; text-align: center;">
                                                Solo presiona el botón de abajo para generar una nueva contraseña.
                                            </p>

                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center">
                                                        <a href="${process.env.EMAIL_URL}/auth/olvide-password/${token}"
                                                        style="display: inline-block; background-color: #237468; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 30px; border-radius: 8px;">
                                                            Cambiar Contraseña
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            <br><br>
                                            <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0; text-align: center;">
                                                <strong>Es importante</strong> que completes este proceso para garantizar la seguridad de tu cuenta.
                                            </p>

                                            <b style="text-align: center;">Si no solicitaste el cambio de contraseña, puedes ignorar el mensaje</b>

                                            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                                            <p style="color: #6b7280; font-size: 12px; line-height: 18px; text-align: center; margin: 0;">
                                                Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
                                            </p>
                                            <p style="text-align: center; margin: 10px 0 0 0;">
                                                <a href="${process.env.EMAIL_URL}/auth/olvide-password/${token}" style="color: #CA8A04; font-size: 12px; word-break: break-all;">
                                                    "${process.env.EMAIL_URL}/auth/confirmar/${token}"
                                                </a>
                                            </p>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                                &copy; 2026 AMMFEN. Todos los derechos reservados.
                                            </p>
                                            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                                                Este correo fue enviado automáticamente, por favor no respondas a este mensaje.
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40">
                                    <tr><td></td></tr>
                                </table>

                            </td>
                        </tr>
                    </table>

                </body>
                </html>
            `
    })
    console.log(datos);
}
const validarPago = async (datos) => {
    var transport = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_post,
        auth: {
            user: process.env.email_user,
            pass: process.env.email_pass
        }
    });
    const { email, nombre } = datos
    const usuario = await Usuario.findOne({ where : {email}})
    const miFolio = usuario.folio;
    const nombreTitular = nombre;
    const celdasBarcode = generarCodigoDeBarras(miFolio);

    await transport.sendMail({
        from: 'ammfen.mx',
        to: email,
        subject: `¡Tu pago ha sido validado! Te esperamos en el Congreso ${process.env.APP_URL}`,
        text: `Tu pase de acceso ha sido validado! ${process.env.APP_URL}`,
        html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirma tu cuenta AMMFEN</title>
                    <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&display=swap" rel="stylesheet">
                    <style>
                        /* Resets básicos para clientes de correo */
                        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                        /* Estilos específicos para móviles */
                        @media only screen and (max-width: 600px) {
                            .container { width: 100% !important; padding: 0 !important; }
                            .content { padding: 20px !important; }
                            .button { width: 100% !important; display: block !important; text-align: center !important; }
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4f6" style="padding: 40px 10px;">
                            <tr>
                            <td align="center">

                                <table width="650" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 650px; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">

                                <tr>
                                    <td style="padding: 40px 40px 20px 40px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td width="70%" align="left" valign="top">
                                            <p style="margin: 0; font-size: 13px; font-style: italic; color: #374151;">La Universidad de Guadalajara presenta</p>
                                            <h1 style="margin: 5px 0; font-size: 18px; color: #0076a8; font-weight: bold; text-transform: uppercase;">XXXIX Congreso Nacional AMMFEN</h1>
                                            <p style="margin: 0; font-size: 12px; color: #374151;">GUADALAJARA | 2026</p>
                                            <p style="margin: 0; font-size: 12px; color: #374151;">Del 18 al 20 de marzo de 2026</p>
                                            <hr style="border: none; border-top: 1px solid #d1d5db; margin: 10px 0;">
                                            <p style="margin: 0; font-size: 13px; font-style: italic; color: #111827;">Conectar, crear e innovar en nutrición</p>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding: 10px 40px 30px 40px;">
                                    <p style="margin: 0; font-size: 16px; color: #0076a8; font-weight: bold;">Titular</p>
                                    <h2 style="margin: 5px 0 0 0; font-size: 24px; color: #111827;">${nombreTitular}</h2>
                                    <p style="margin: 5px 0 15px 0; font-size: 14px; font-style: italic; color: #374151;">Acceso al congreso</p>

                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#86efac" style="border-radius: 6px;">
                                        <tr>
                                        <td align="center" style="padding: 10px; font-size: 14px; font-weight: bold; color: #064e3b;">Acceso al congreso validado</td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>



                                <tr>
                                    <td style="padding: 30px 40px 0 40px;">
                                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 30px 40px 40px 40px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>

                                        <td width="50%" valign="top" style="padding-right: 20px; border-right: 1px solid #e5e7eb;">
                                            <p style="margin: 0 0 15px 0; font-size: 12px; color: #9ca3af; font-weight: bold; text-transform: uppercase;">Acerca del congreso</p>
                                            <p style="margin: 0 0 20px 0; font-size: 12px; color: #111827; font-weight: bold; line-height: 1.4;">Escanea este código QR para tener el programa del congreso y más detalles de tu visita a Guadalajara</p>

                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center">
                                                <img src="https://portalexterno.cucs.udg.mx/ammfen/files/qr-convocatoria.png" alt="Código QR" width="130" style="display: block; max-width: 130px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 5px;">
                                                </td>
                                            </tr>
                                            </table>

                                            <p style="margin: 20px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">XXXIX Congreso Nacional AMMFEN</p>

                                            <p style="margin: 0 0 15px 0; font-size: 12px; color: #9ca3af; font-weight: bold; text-transform: uppercase;">Ubicación del congreso</p>
                                            <img src="https://portalexterno.cucs.udg.mx/ammfen/img/logos/caes.png" alt="Conjunto Santander" width="200" style="display: block; max-width: 100%; margin-bottom: 15px;">

                                            <p style="margin: 0 0 10px 0; font-size: 11px; color: #4b5563; line-height: 1.5;">El congreso se llevará a cabo en el Conjunto Santander de Artes Escénicas, ubicado en Guadalajara, Jalisco.</p>
                                            <a href="https://maps.google.com/?q=Conjunto+Santander" target="_blank" style="font-size: 11px; color: #3b82f6; text-decoration: underline; line-height: 1.5;">Anillo Perif. Nte. Manuel Gómez Morín 1695, Rinconada de La Azalea, Belenes Nte., 45180 Zapopan, Jal.</a>

                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
                                            <tr>
                                                <td align="center">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #111827;">Código de acceso</p>
                                                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; border-collapse: collapse;">
                                                    <tr>
                                                    ${celdasBarcode}
                                                    </tr>
                                                </table>

                                                </td>
                                            </tr>
                                            </table>

                                        </td>



                                        </tr>
                                    </table>
                                    </td>
                                </tr>

                                </table>
                            </td>
                            </tr>
                        </table>
                    </body>
                </html>
            `
    })
}
const enviarCorreo = async (datos) => {
    var transport = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_post,
        auth: {
            user: process.env.email_user,
            pass: process.env.email_pass
        }
    });

    const { email, nombre, mensajesSinLeer } = datos

    await transport.sendMail({
        from: 'ammfen.mx',
        to: email,
        subject: `Tienes ${mensajesSinLeer} mensajes sin leer ${process.env.APP_URL}`,
        text: `Tienes ${mensajesSinLeer} mensajes sin leer. ${process.env.APP_URL}`,
        html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirma tu cuenta AMMFEN</title>
                    <style>
                        /* Resets básicos para clientes de correo */
                        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
                        /* Estilos específicos para móviles */
                        @media only screen and (max-width: 600px) {
                            .container { width: 100% !important; padding: 0 !important; }
                            .content { padding: 20px !important; }
                            .button { width: 100% !important; display: block !important; text-align: center !important; }
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
                            <tr>
                                <td align="center">

                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

                                        <tr>
                                            <td style="
                                                background: #effaff; /* Color de respaldo si el degradado falla */
                                                background: linear-gradient(to right, #daf4ff 0%, #99d6e7 100%);
                                                border-left: 8px solid #0f2a35;
                                                padding: 50px 40px;
                                                text-align: left;
                                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                            ">

                                                <p style="
                                                    color: #455a64;
                                                    font-size: 15px;
                                                    font-style: italic;
                                                    margin: 0 0 5px 0;
                                                    font-family: Georgia, Times, 'Times New Roman', serif; /* Fuente serif para un toque elegante */
                                                ">
                                                    La Universidad de Guadalajara presenta
                                                </p>

                                                <h1 style="
                                                    color: #003d5b;
                                                    margin: 0;
                                                    font-size: 38px;
                                                    font-weight: 900;
                                                    line-height: 1;
                                                    text-transform: uppercase;
                                                    letter-spacing: -0.5px;
                                                ">
                                                    XXXIX CONGRESO NACIONAL<br>AMMFEN
                                                </h1>

                                                <p style="
                                                    color: #0f2a35;
                                                    font-size: 16px;
                                                    font-weight: 700;
                                                    margin: 25px 0 5px 0;
                                                    text-transform: uppercase;
                                                    letter-spacing: 1px;
                                                ">
                                                    GUADALAJARA | 2026
                                                </p>

                                                <p style="
                                                    color: #455a64;
                                                    font-size: 16px;
                                                    margin: 0 0 20px 0;
                                                ">
                                                    Del 18 al 20 de marzo del 2026
                                                </p>

                                                <div style="
                                                    background-color: #CA8A04; /* Naranja quemado */
                                                    height: 4px;
                                                    width: 50px;
                                                    margin-bottom: 20px;
                                                    border-radius: 2px;
                                                "></div>

                                                <p style="
                                                    color: #455a64;
                                                    font-size: 15px;
                                                    font-style: italic;
                                                    margin: 0;
                                                    font-family: Georgia, Times, 'Times New Roman', serif;
                                                ">
                                                    Conectar, crear e innovar en nutrición
                                                </p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="content" style="padding: 40px 40px 20px 40px;">
                                                <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">¡Hola ${nombre},</h2>
                                                <p>Tienes <strong>${mensajesSinLeer} mensajes sin leer</strong> en tu chat en tu registro de ammfen.</p>
                                                <a href="${process.env.EMAIL_URL}/auth/login/">Iniciar sesión</a>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                                    &copy; 2026 AMMFEN. Todos los derechos reservados.
                                                </p>
                                                <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                                                    Este correo fue enviado automáticamente, por favor no respondas a este mensaje.
                                                </p>
                                            </td>
                                        </tr>

                                    </table>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" height="40">
                                        <tr><td></td></tr>
                                    </table>

                                </td>
                            </tr>
                        </table>

                    </body>
                </html>
            `
    })
}
function generarCodigoDeBarras(folio) {
    // Usamos el formato Code 128 o 39 a través de una URL
    const url = `https://bwipjs-api.metafloor.com/?bcid=code39&text=${folio}&scale=2&rotate=N&includetext=true`;
    return `<img src="${url}" alt="Barcode ${folio}" style="display:block; margin: 10px 0;">`;
}


export{
    emailRegistros,
    emailOlvidePassword,
    validarPago,
    enviarCorreo
}