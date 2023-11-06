import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

export const vooRouter = express.Router();

const port = 3000;
vooRouter.use(express.json());
vooRouter.use(cors());


dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

vooRouter.get("/listarVoos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
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

vooRouter.put("/inserirVoo", async(req,res)=>{
  
  const trecho = req.body.trecho as number;
  const data_partida = req.body.data_partida as string;
  const hora_partida = req.body.hora_partida as string;
  const hora_chegada = req.body.hora_chegada as string;
  const aeroporto_partida = req.body.aeroporto_partida as number;
  const aeroporto_chegada = req.body.aeroporto_chegada as number;
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
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    });

    const cmdInsertVoo = `INSERT INTO VOOS VALUES (SEQ_TRECHOS.NEXTVAL, :1, :2, :3, :4, :5, :6, :7)`

    const dados = [trecho, data_partida, hora_partida, hora_chegada, aeroporto_partida, aeroporto_chegada, valor];
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

// vooRouter.delete("/excluirVoo", async(req,res)=>{
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

//     const cmdDeleteVoo = `DELETE VOO WHERE ID_VOO = :1`
//     const dados = [codigo];
//     let resDelete = await connection.execute(cmdDeleteVoo, dados);
//     await connection.commit();
//     await connection.close();

//     const rowsDeleted = resDelete.rowsAffected
//     if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Voo excluído.";
//     }else{
//       cr.message = "Voo não excluído. Verifique se o código informado está correto.";
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

// vooRouter.put("/atualizarVoo", async (req, res) => {
//   const codigo = req.body.codigo as number;
//   const voo = req.body.voo as string;
//   const origem = req.body.origem as string;
//   const destino = req.body.destino as string;
//   const dia = req.body.dia as number;
//   const horario = req.body.horario as number;
//   const valor = req.body.valor as number;

//   let cr: CustomResponse = {
//     status: "ERROR",
//     message: "",
//     payload: undefined,
//   };

//   let conn;

//   try {
//     conn = await oracledb.getConnection({
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     });

//     const cmdUpdateVoo = `UPDATE VOOS 
//       SET VOO = :1, ORIGEM = :2, DESTINO = :3, DIA = :4, HORARIO = :5, VALOR = :6
//       WHERE ID_VOO = :7`;

//     const dados = [voo, origem, destino, dia, horario, valor, codigo];
//     let resUpdate = await conn.execute(cmdUpdateVoo, dados);
//     await conn.commit();

//     const rowsUpdated = resUpdate.rowsAffected;
//     if (rowsUpdated !== undefined && rowsUpdated === 1) {
//       cr.status = "SUCCESS";
//       cr.message = "Voo atualizado.";
//     } else {
//       cr.message = "Voo não atualizado. Verifique se o código informado está correto.";
//     }
//   } catch (e) {
//     if (e instanceof Error) {
//       cr.message = e.message;
//       console.log(e.message);
//     } else {
//       cr.message = "Erro ao conectar ao Oracle. Sem detalhes.";
//     }
//   } finally {
//     if (conn !== undefined) {
//       await conn.close();
//     }
//     res.send(cr);
//   }
// });