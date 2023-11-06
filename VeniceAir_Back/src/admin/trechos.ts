import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

export const trechoRouter = express.Router();
const port = 3000;
trechoRouter.use(express.json());
trechoRouter.use(cors());

dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

trechoRouter.get("/listarTrechos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT ID_TRECHO, (SELECT c.NOME FROM CIDADES c WHERE c.ID_CIDADE = T.CIDADE_ORIGEM) AS CIDADE_ORIGEM,(SELECT c.NOME FROM CIDADES c WHERE c.ID_CIDADE = T.CIDADE_DESTINO) AS CIDADE_DESTINO FROM TRECHOS T");
  
    await connection.close();
    cr.status = "SUCCESS"; 
    cr.message = "Dados obtidos";
    cr.payload = resultadoConsulta.rows;

  }catch(e){
    if(e instanceof Error){
      cr.message = e.message;
      console.log(e.message);
    }else{
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    res.send(cr);  
  }

});

// trechoRouter.put("/inserirTrecho", async(req,res)=>{
  
//   const origem = req.body.origem as string;
//   const destino = req.body.destino as string;
  
//   let cr: CustomResponse = {
//     status: "ERROR",
//     message: "",
//     payload: undefined,
//   };

//   let conn;

//   try{
//     conn = await oracledb.getConnection({
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     });

//     const cmdInsertTrecho = `INSERT INTO TRECHOS 
//     (ID_TRECHO, ORIGEM, DESTINO)
//     VALUES
//     (SEQ_TRECHOS.NEXTVAL, :1, :2)`

//     const dados = [origem, destino];
//     let resInsert = await conn.execute(cmdInsertTrecho, dados);
//     await conn.commit();
  
//     const rowsInserted = resInsert.rowsAffected
//     if(rowsInserted !== undefined &&  rowsInserted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Trecho inserido.";
//     }

//   }catch(e){
//     if(e instanceof Error){
//       cr.message = e.message;
//       console.log(e.message);
//     }else{
//       cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//     }
//   } finally {
//     if(conn!== undefined){
//       await conn.close();
//     }
//     res.send(cr);  
//   }
// });

// trechoRouter.delete("/excluirTrecho", async(req,res)=>{
//   const codigo = req.body.codigo as number;
 
//   let cr: CustomResponse = {
//     status: "ERROR",
//     message: "",
//     payload: undefined,
//   };

//   try{
//     const connection = await oracledb.getConnection({
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     });

//     const cmdDeleteTrecho = `DELETE TRECHO WHERE ID_TRECHO = :1`
//     const dados = [codigo];
//     let resDelete = await connection.execute(cmdDeleteTrecho, dados);
//     await connection.commit();
//     await connection.close();

//     const rowsDeleted = resDelete.rowsAffected
//     if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Trecho excluído.";
//     }else{
//       cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
//     }

//   }catch(e){
//     if(e instanceof Error){
//       cr.message = e.message;
//       console.log(e.message);
//     }else{
//       cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//     }
//   } finally {
//     res.send(cr);  
//   }
// });