import mongoose from 'mongoose'
import generarId from '../helpers/generarId.js';
import bcrypt from "bcrypt"; // Para hashear los PW 

//La estructura de los datos de todo el modelo de Veterinario
const veterinarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        required: true,
        trim: true, 
    },
    password: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono:{
        type: String,
        required: null,
        trim: true
    },
    web:{
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarId()
    },
    //para ver si la cuenta esta confiramda
    confirmado: {
        type: Boolean,
        default: false
    }
});

//Antes de almacenar hasheamos
veterinarioSchema.pre('save', async function(next){
    //console.log(this); //el this nos muestra el objeto poco antes de guardar, por tanto se puede modif

    //Para que un password que ya esta hasheado no lo vuelva a hashear
    if(!this.isModified('password')){
        next(); //ya termino vete al siguiente middleware
    }
    const salt = await bcrypt.genSalt(10); //rondas de hasheo
    this.password = await bcrypt.hash(this.password, salt);
}); //el pre es parte del middleware de moogose 

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    //compare nos permitira que el hasheado y el normal sean comparados
    return await bcrypt.compare(passwordFormulario, this.password) 
    
}

//Registrando el modelo
const Veterinario = mongoose.model("Veterinario", veterinarioSchema);
export default Veterinario;


