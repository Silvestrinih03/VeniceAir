import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

// const app = express();
export const avaliacaoRouter = express.Router();
const port = 3000;
avaliacaoRouter.use(express.json());
avaliacaoRouter.use(cors());


dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Função OK
avaliacaoRouter.put("/inserirAvaliacao", async(req,res)=>{

    const nome = req.body.nome as string;
    const email = req.body.email as string;
    const avaliacao = req.body.avaliacao as number;
    const descricao = req.body.descricao as string;
  
    let cr: CustomResponse = {
      status: "ERROR",
      message: "",
      payload: undefined,
    };
  
    let conn;
  
    try{
      conn = await oracledb.getConnection({
         user: process.env.ORACLE_DB_USER,
         password: process.env.ORACLE_DB_SECRET,
         connectionString: process.env.ORACLE_DB_CONN_STR,
      });
  
      const cmdInsertAvaliacao = 'INSERT INTO AVALIACOES(NOME, EMAIL, AVALIACAO, DESCRICAO) VALUES (:1, :2, :3, :4)';
  
      const dados = [nome, email, avaliacao, descricao];
      let resInsert = await conn.execute(cmdInsertAvaliacao, dados);
      await conn.commit();
    
      const rowsInserted = resInsert.rowsAffected;
      if (rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Avaliação enviada com sucesso! Agradecemos pelo feedback!";
      }
  
    }catch(e){
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      if(conn!== undefined){
        await conn.close();
      }
      res.send(cr);  
    }
  });