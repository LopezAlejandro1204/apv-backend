import Paciente from "../models/Paciente.js";

const agregarPacientes = async(req,res) => {
    //delete req.body.id
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id
    try {
        const pacienteGuardado = await paciente.save();
        res.json(pacienteGuardado)
    } catch (error) {
        console.log(error)
    }
};
const obtenerPacientes = async (req,res) => {
    //el where es para decirle que columna filtraremos
    const pacientes =  await Paciente.find().where("veterinario").equals(req.veterinario);

    res.json(pacientes)
};
//Para traer el paciente en especifico
const obtenerPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    //Ahora solo el veterinario puede verlo- es decir el que creo la informacion
    if(paciente.veterinario._id.toString() !== req.veterinario._id){
        return res.json({msg: "Accion no valida"})
    }
    if(paciente){
        res.json(paciente);
    }

}
const actualizarPaciente =async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    
    if(!paciente){
        return res.status(404).json({msg: "No encontrado"})
    }
    
    if(paciente.veterinario._id.toString() !== req.veterinario._id){
        return res.json({msg: "Accion no valida"})
    }
    //Actualizar paciente - se debe tomar en cuenta que los datos existentes y que no desemos
    //cambiar o no pongamos se mantengan como esta
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
    }
}
const eliminarPaciente =async(req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
    
    if(!paciente){
        return res.status(404).json({msg: "No encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id){
        //console.log(`Este ${paciente.veterinario._id.toString()} no es igual a ${req.veterinario._id}`)
        return res.json({msg: "Accion no valida"})
    }

    try {
        await paciente.deleteOne()
        res.json({msg: "Paciente eliminado"})
    } catch (error) {
        console.log(error)
    }
}
export {agregarPacientes, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente}