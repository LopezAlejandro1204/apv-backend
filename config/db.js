import mongoose from "mongoose";

//import { MongoClient, ServerApiVersion } from "mongodb";

import dotenv from 'dotenv';

dotenv.config(); //buscando el env - npm i dotenv para que la reconozca

const uri = process.env.MONGO_URI;
//const uri = 'mongodb+srv://Al_Panda23:734629151349843199Al@cluster0.ij1lzlp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

const conectarDB = async () =>{
    try{
        const db = await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`MongoDB conectado en ${url}`);
    }catch(error){
        console.log(`error: ${error.message}`);
        await client.close();
        process.exit(1);
    }
}

export default conectarDB