import { version } from "mongoose";
import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
const registrar = async (req, res)=>{
    //hacemos destructuring para leer datos
    const {nombre,email, password} = req.body

    //prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email: email}) //Permite buscar por atributos

    if (existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message})
    }
    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body); //Se debe instancia el mod a partir del req que tenemos
        const veterinarioGuardado = await veterinario.save();//save() es para guardar en moongose
        //para tener respuesta de tipo JSON y pueda ser interpretado en cualquier frontend


        //Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log('Error ')
        console.log(error);
    }
};
//Se usa json en lugar de send para el tipo de respuesta que necesitamos
const perfil =(req, res)=>{
    const {veterinario} = req;
    res.json({veterinario})
}

const confirmar = async (req, res)=>{
    const { token } = req.params //Aqui se pone el routing dinamico y debe ser el mismo que se puso
                                //en routes en la parte de " : " - sino dara error
    const usuarioConfirmar = await Veterinario.findOne({token: token});

    if (!usuarioConfirmar){ //Esto nos dira la existencia de el token que estamos poniendo
        const error = new Error('token no valido')
        return res.status(404).json({msg: error.message});
    }

    try {
        //cambiando valores para que no sea visto el token 
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save() //Se lo guarda

        res.json({msg: 'Usuario confirmado correctamente'})
    } catch (error) {
        console.log(error)
    }
};

//Para autenticar usuarios
const autenticar = async (req, res) => {
    const {email, password} = req.body

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email:email})
    if (!usuario){ //Esto nos dira la existencia de el token que estamos poniendo
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message});
    }

    //Comprobar si el usuario esta confirmado o no
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg:error.message})
    }

    //Revisar el password
    if (await usuario.comprobarPassword(password)){
        
        //Autenticar

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    }else{
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg:error.message})
    }
    
}

const olvidePassword = async (req,res)=>{
    const {email} = req.body
    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('El usuario no existe')
        return res.status(400).json({msg: error.message})
    }
    //lo que hara al encontrar el correo es ver luego el token
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save();

        //Enviar Email con instrucciones
        emailOlvidePassword({
            email: email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: 'Hemos enviado un email con las instrucciones'});

    } catch (error) {
        console.log(error)
    }
}
const comprobarToken = async(req,res)=>{
    const {token} = req.params //se saca la info de la URL
    //una vez que se comprueba la existencia
    const tokenValido = await Veterinario.findOne({token});
    if(tokenValido){
        //El token es valido - el usuario existe
        res.json({msg: 'Token valido y el usuario existe'});
    }else{
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    }
}
const nuevoPassword = async(req,res)=>{
    const {token} =req.params
    const {password} = req.body //lo que el usuario escribe en los diferentes inputs o formularios

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.token = null;
        veterinario.password = password
        await veterinario.save()
        res.json({msg: 'Password modificado correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async(req, res) =>{
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    //Para ver si el Email esta en uso
    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})

        if(existeEmail){
            const error = new Error('Ese email ya esta en uso')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error)
    }
};

const actualizarPassword = async (req, res) => {
    //Leer los datos
    const {id} = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body

    //COmprobar que el veterinario exista
    
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    //Comprobar su password - osea comparar el password actual con el que hay en la base de datos
    if (await veterinario.comprobarPassword(pwd_actual)){
        //Almacenar el nuevo password

        veterinario.password = pwd_nuevo

        await veterinario.save();
        res.json({msg: 'Password Almacenado Correctamente'})
    }
    else{
        const error = new Error('Password actual incorrecto')
        return res.status(400).json({msg: error.message})
    }
    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}