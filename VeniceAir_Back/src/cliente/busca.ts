import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

// const app = express();
export const buscaRouter = express.Router();
const port = 3000; //muda a porta se não for isso
buscaRouter.use(express.json());
buscaRouter.use(cors());

dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Função OK
buscaRouter.post("/buscarVoo", async(req,res)=>{

    const tipopassagem = req.body.campo_select as string;
    const partidaDe = req.body.campo_select2 as number;
    const chegadaA = req.body.campo_select3 as number;
    const dataIda = new Date(req.body.data_ida);
    //const tipopassagem = req.body.campo_select as string;

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let query =
      "SELECT V.* FROM VOOS V " +
      "JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO " +
      "WHERE ";

    const params = [];

    if (tipopassagem === "1") {
      // Tipo de passagem: Ida
      query += "V.DATA_PARTIDA = :dataIda AND ";
      params.push(dataIda);
    } else if (tipopassagem === "2") {
      // Tipo de passagem: Ida e volta
      query += "V.DATA_PARTIDA = :dataIda AND ";
      //query += "V.DATA_VOLTA = :dataVolta AND ";
      params.push(dataIda);
      params.push(new Date(req.body.data_volta));
    }

    query += "T.CIDADE_ORIGEM = :partidaDe AND ";
    query += "T.CIDADE_DESTINO = :chegadaA";

    params.push(partidaDe);
    params.push(chegadaA);

    let resultadoConsulta = await connection.execute(query, params);

    await connection.close();

    cr.status = "SUCCESS";
    cr.message = "Dados obtidos";
    cr.payload = resultadoConsulta.rows;
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao oracle. Sem detalhes";
    }
  } finally {
    res.send(cr);
  }
});

// Função OK
// aeroportoRouter.put("/inserirAeroportos", async(req,res)=>{

//     const sigla = req.body.sigla as string;
//     const cidade = req.body.cidade as number;
  
//     let cr: CustomResponse = {
//       status: "ERROR",
//       message: "",
//       payload: undefined,
//     };
  
//     let conn;
  
//     try{
//       conn = await oracledb.getConnection({
//          user: process.env.ORACLE_DB_USER,
//          password: process.env.ORACLE_DB_SECRET,
//          connectionString: process.env.ORACLE_DB_CONN_STR,
//       });
  
//       const cmdInsertAeroporto = 'INSERT INTO AEROPORTOS(SIGLA, CIDADE) VALUES (:1, :2)';
  
//       const dados = [sigla, cidade];
//       let resInsert = await conn.execute(cmdInsertAeroporto, dados);
//       await conn.commit();
    
//       const rowsInserted = resInsert.rowsAffected;
//       if (rowsInserted !== undefined &&  rowsInserted === 1) {
//         cr.status = "SUCCESS"; 
//         cr.message = "Aeroporto inserido.";
//       }
  
//     }catch(e){
//       if(e instanceof Error){
//         cr.message = e.message;
//         console.log(e.message);
//       }else{
//         cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//       }
//     } finally {
//       if(conn!== undefined){
//         await conn.close();
//       }
//       res.send(cr);  
//     }
//   });
  
