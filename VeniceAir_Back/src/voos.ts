import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());


dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

app.get("/listarVoos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_PASSWORD,
      connectionString: process.env.ORACLE_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT * FROM VOOS");
  
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

app.put("/inserirVoo", async(req,res)=>{
  
  const voo = req.body.voo as string;
  const origem = req.body.origem as string;
  const destino = req.body.destino as string;
  const dia = req.body.dia as number;
  const horario = req.body.horario as number;
  const valor = req.body.valor as number;


  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  let conn;

  try{
    conn = await oracledb.getConnection({
       user: process.env.ORACLE_DB_USER,
       password: process.env.ORACLE_DB_PASSWORD,
       connectionString: process.env.ORACLE_CONN_STR,
    });

    const cmdInsertVoo = `INSERT INTO VOOS 
    (ID_VOO, VOO, ORIGEM, DESTINO, DIA, HORARIO, VALOR)
    VALUES
    (SEQ_TRECHOS.NEXTVAL, :1, :2, :3, :4, :5, :6)`

    const dados = [voo, origem, destino, dia, horario, valor];
    let resInsert = await conn.execute(cmdInsertVoo, dados);
    await conn.commit();
  
    const rowsInserted = resInsert.rowsAffected
    if(rowsInserted !== undefined &&  rowsInserted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Voo inserido.";
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

app.delete("/excluirVoo", async(req,res)=>{
  const codigo = req.body.codigo as number;
 
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  try{
    const connection = await oracledb.getConnection({
       user: process.env.ORACLE_DB_USER,
       password: process.env.ORACLE_DB_PASSWORD,
       connectionString: process.env.ORACLE_CONN_STR,
    });

    const cmdDeleteVoo = `DELETE VOO WHERE ID_VOO = :1`
    const dados = [codigo];
    let resDelete = await connection.execute(cmdDeleteVoo, dados);
    await connection.commit();
    await connection.close();

    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Voo excluído.";
    }else{
      cr.message = "Voo não excluído. Verifique se o código informado está correto.";
    }

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

app.listen(port,()=>{
  console.log("Servidor HTTP funcionando...");
});