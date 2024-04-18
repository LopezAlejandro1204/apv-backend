import  express from "express";
import { registrar,perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js"

const router = express.Router();
//AREA PUBLICA
router.post('/', registrar); //Por que en un registro se manda datos al servidor
router.get('/confirmar/:token', confirmar); //con parametro dinamico " : "
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
//si tenemos un get y un post en una misma ruta usar
//router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-passqord/:token', nuevoPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//AREA PRIVADA
//Para esta ruta necesitamos que la persona este autenticada
router.get('/perfil',checkAuth, perfil); 
router.put('/perfil/:id',checkAuth, actualizarPerfil); 
router.put('/actualizar-password', checkAuth, actualizarPassword);
//Cuando visite perfil ira a checkAuth, hara lo de la funcion y luego ira a la funcion de perfil

export default router;