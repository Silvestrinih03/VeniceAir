import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const port = 3000; //muda a porta se não for isso
app.use(express.json());
app.use(cors());

dotenv.config();

type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

app.get("/listarAeronaves", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_PASSWORD,
      connectionString: process.env.ORACLE_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT * FROM AERONAVES");
  
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

app.put("/inserirAeronave", async(req,res)=>{
  
  const fabricante = req.body.fabricante as string;
  const modelo = req.body.modelo as string;
  const anofab = req.body.anofab as number;
  const qtdeAssentos = req.body.qtdeAssentos as number;

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

    const cmdInsertAero = `INSERT INTO AERONAVES 
    (CODIGO, FABRICANTE, MODELO, ANO_FAB, NUMERO_ASSENTOS)
    VALUES
    (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4)`

    const dados = [fabricante, modelo, anofab, qtdeAssentos];
    let resInsert = await conn.execute(cmdInsertAero, dados);
    await conn.commit();
  
    const rowsInserted = resInsert.rowsAffected
    if(rowsInserted !== undefined &&  rowsInserted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeronave inserida.";
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

app.delete("/excluirAeronave", async(req,res)=>{
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

    const cmdDeleteAero = `DELETE AERONAVES WHERE codigo = :1`
    const dados = [codigo];

    let resDelete = await connection.execute(cmdDeleteAero, dados);
    await connection.commit();
    await connection.close();
    
    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeronave excluída.";
    }else{
      cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
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