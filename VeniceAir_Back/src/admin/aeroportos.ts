import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";

import cors from "cors";

// const app = express();
export const aeroportoRouter = express.Router();
const port = 3000;
aeroportoRouter.use(express.json());
aeroportoRouter.use(cors());


dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

aeroportoRouter.get("/listarAeroportos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT * FROM AEROPORTOS");
  
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



// TESTE
// exports.aeroportoRouter.get('/getCidades', async (req: Request, res: Response) => {
//     let connection: Connection | undefined;
  
//     try {
//       connection = await oracledb.getConnection(dbConfig);
  
//       const result = await connection.execute('SELECT nome FROM CIDADES');
  
//       const cidades = result.rows.map((row: any) => row[0]);
//       res.json(cidades);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Erro ao obter cidades');
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (err) {
//           console.error(err.message);
//         }
//       }
//     }
//   });



aeroportoRouter.put("/inserirAeroporto", async(req,res)=>{
  
  const aeroporto = req.body.aeroporto as string;
  const cidade = req.body.cidade as number;
  // const pais = req.body.pais as string;

  
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

    const cmdInsertAeroporto = `INSERT INTO AEROPORTOS 
    (ID_AEROPORTO, SIGLA, CIDADE)
    VALUES
    (SEQ_AEROPORTOS.NEXTVAL, :1, :2)`

    const dados = [aeroporto, cidade];
    let resInsert = await conn.execute(cmdInsertAeroporto, dados);
    await conn.commit();
  
    const rowsInserted = resInsert.rowsAffected
    if(rowsInserted !== undefined &&  rowsInserted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeroporto inserido.";
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

aeroportoRouter.delete("/excluirAeroporto", async(req,res)=>{
  const codigo = req.body.codigo as number;
 
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  try{
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    });

    const cmdDeleteAeroporto = `DELETE AEROPORTOS WHERE ID_AEROPORTO = :1`
    const dados = [codigo];
    let resDelete = await connection.execute(cmdDeleteAeroporto, dados);
    await connection.commit();
    await connection.close();

    const rowsDeleted = resDelete.rowsAffected
    if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Aeroporto excluído.";
    }else{
      cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
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