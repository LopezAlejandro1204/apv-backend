import jwt from 'jsonwebtoken'


const generarJWT =(id)=>{
    //Para agregarlo - en estte caso se lo aplciara al id del usuario
    return jwt.sign({id: id}, process.env.JMT_SECRET,{
        //Se le puede agregar algunas opciones, entre esas opciones,
        //se usa cuando va a expirar este JWT
        expiresIn: "30d",
    }); 
}

export default generarJWT;