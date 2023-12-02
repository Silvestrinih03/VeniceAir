import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

// const app = express();
export const mapaRouter = express.Router();
const port = 3000; //muda a porta se não for isso
mapaRouter.use(express.json());
mapaRouter.use(cors());

dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// INSERIR NOVO MAPA DE ASSENTOS
mapaRouter.post("/inserirMapa", async(req,res)=>{
  
    const aeronave = req.body.aeronave as number;
    const voo = req.body.voo as number;
    const numAssentos = req.body.total as number;

    console.log("aeronave: ", aeronave);
    console.log("voo: ", voo);
    console.log("numeroAss: ", numAssentos);
  
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
  
      const cmdInsertMapa = 'INSERT INTO MAP (ID_MAPA, AERONAVE, VOO, TOTAL_ASSENTOS) VALUES (SEQ_MAPA_DE_ASSENTOS.nextval, :1, :2, :3)';
  
      const dados = [aeronave, voo, numAssentos];
      let resInsert = await conn.execute(cmdInsertMapa, dados);
      await conn.commit();
    
      const rowsInserted = resInsert.rowsAffected
      if(rowsInserted !== undefined &&  rowsInserted === 1) {
        cr.status = "SUCCESS"; 
        cr.message = "Mapa inserido.";
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
  

  
// listar mapas de voo
mapaRouter.get("/listarMapas", async(req,res)=>{

    let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
  
    try{
      const connAttibs: ConnectionAttributes = {
        user: process.env.ORACLE_DB_USER,
        password: process.env.ORACLE_DB_SECRET,
        connectionString: process.env.ORACLE_DB_CONN_STR,
      }
      const connection = await oracledb.getConnection(connAttibs);
      let resultadoConsulta = await connection.execute("SELECT * FROM MAP");
    
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


// RETIRAR DEPOISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
mapaRouter.post("/procedureMapa", async(req,res)=>{
    //const p_aeronave_id = req.body.p_aeronave_id as number;
    const p_aeronave_id = parseInt(req.body.p_aeronave_id, 10);
    console.log("Typeof p_aeronave_id:", typeof p_aeronave_id);
    console.log("veja aqui: ", p_aeronave_id);

    let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

    let conn;

  try {
    conn = await oracledb.getConnection({
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    });

    const cmdProcedure = `BEGIN CADASTRA_ASSENTO(:p_aeronave_id); END;`;

        const bindVariables = {
          p_aeronave_id: { val: Number(p_aeronave_id), type: oracledb.NUMBER, dir: oracledb.BIND_IN }};
    
        const options = {
          autoCommit: true,
        };
    
        let resultadoProcedure = await conn.execute(cmdProcedure, bindVariables, options);
    
      await conn.close();
      cr.status = "SUCCESS"; 
      cr.message = "Dados obtidos";
      cr.payload =resultadoProcedure.rows;
  
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










  mapaRouter.post("/procedureMapa2", async(req,res)=>{
    //const p_aeronave_id = req.body.p_aeronave_id as number;
    const p_voo_id = parseInt(req.body.p_voo_id, 10);
    console.log("Typeof p_voo_id:", typeof p_voo_id);
    console.log("veja aqui: ", p_voo_id);

    let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

    let conn;

  try {
    conn = await oracledb.getConnection({
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    });

    const cmdProcedure = `BEGIN PROCEDUREASSENTO(:p_voo_id); END;`;

        const bindVariables = {
          p_voo_id: { val: Number(p_voo_id), type: oracledb.NUMBER, dir: oracledb.BIND_IN }};
    
        const options = {
          autoCommit: true,
        };
    
        let resultadoProcedure = await conn.execute(cmdProcedure, bindVariables, options);
    
      await conn.close();
      cr.status = "SUCCESS"; 
      cr.message = "Dados obtidos";
      cr.payload =resultadoProcedure.rows;
  
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






















// listar mapas de voo
mapaRouter.get("/acharMapa/:p_voo_id", async(req,res)=>{
  const p_voo_id = parseInt(req.params.p_voo_id, 10);
  console.log("Voo para achar mapa: ", p_voo_id);

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT * FROM ASS WHERE COD_VOO = :1", [p_voo_id]);
  
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

