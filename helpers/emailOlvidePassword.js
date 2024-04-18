import nodemailer from "nodemailer"

const emailOlvidePassword =async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });
    const {email, nombre, token} = datos;
    //enviar el email
    const info = await transport.sendMail({ //usamos sendmail que es propio de mailer
        from: "APV - Administrador de pacientes de Veterinaria",
        to: email,
        subject: "Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password </p>

            <p>Sigue el siguiente enlace para generar un nuevo Passwrod:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Pasword</a> </p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });
    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword