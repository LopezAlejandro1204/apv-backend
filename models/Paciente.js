import mongoose from 'mongoose'

const pacienteSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    propietario:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    sintomas:{
        type: String,
        required: true
    },
    //Esta parte del esquema es para la referencia del veterinario que lo esta atendiendo
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario', //Aqui se usa el nombre del modelo que estamos usando
    },
},{
    timestamps: true,
});

const Paciente =  mongoose.model('Paciente', pacienteSchema)//el nombre y esquema de losdatos

export default Paciente;