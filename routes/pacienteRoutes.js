import  express  from "express";
import { agregarPacientes, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();

//entonces para agregar un paciente se necesita tener una cuenta
router.route('/').post(checkAuth, agregarPacientes).get(checkAuth, obtenerPacientes)

//put es para actualizar
router.route('/:id').get(checkAuth, obtenerPaciente).put(checkAuth, actualizarPaciente).
delete(checkAuth, eliminarPaciente)

export default router;