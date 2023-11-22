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

// Função OK
aeroportoRouter.get("/listarAeroportos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("select ID_AEROPORTO,SIGLA, (select c.NOME from CIDADES c where c.ID_CIDADE = CIDADE) from AEROPORTOS");
  
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

// Função OK
aeroportoRouter.post("/inserirAeroportos", async(req,res)=>{

  const sigla = req.body.sigla as string;
  const cidade = req.body.cidade as number;

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

    const cmdInsertAeroporto = 'INSERT INTO AEROPORTOS(SIGLA, CIDADE) VALUES (:1, :2)';

    const dados = [sigla, cidade];
    let resInsert = await conn.execute(cmdInsertAeroporto, dados);
    await conn.commit();
  
    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined &&  rowsInserted === 1) {
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

// Função OK
aeroportoRouter.delete("/excluirAeroporto/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  let cr = {
      status: "ERROR",
      message: "",
      payload: undefined,
  };

  try {
      const connection = await oracledb.getConnection({
          user: process.env.ORACLE_DB_USER,
          password: process.env.ORACLE_DB_SECRET,
          connectionString: process.env.ORACLE_DB_CONN_STR,
      });

      const cmdDeleteAeroporto = `DELETE AEROPORTOS WHERE ID_AEROPORTO = :1`;
      const dados = [codigo];
      let resDelete = await connection.execute(cmdDeleteAeroporto, dados);
      await connection.commit();
      await connection.close();

      const rowsDeleted = resDelete.rowsAffected;
      if (rowsDeleted !== undefined && rowsDeleted === 1) {
          cr.status = "SUCCESS";
          cr.message = "Aeroporto excluído.";
      } else {
          cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
      }
  } catch (e) {
      if (e instanceof Error) {
          cr.message = e.message;
          console.log(e.message);
      } else {
          cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
      }
  } finally {
      res.send(cr);
  }
});

// ALTERAR FUNCIONADO
aeroportoRouter.post("/editarAeroporto/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  const novaSigla = req.body.sigla as string;
  const novaCidade = req.body.cidade as number;

  console.log(codigo);
  console.log(novaSigla);
  console.log(novaCidade);
  
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };

  let conn;

  try {
    conn = await oracledb.getConnection({
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    });

    const cmdUpdateAeroporto = `
            UPDATE AEROPORTOS
            SET SIGLA = :novaSigla, CIDADE = :novaCidade
            WHERE ID_AEROPORTO = :codigo
        `;

        const bindVariables = {
          codigo: { val: Number(codigo), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          novaSigla: { val: novaSigla, type: oracledb.STRING, dir: oracledb.BIND_IN },
          novaCidade: { val: Number(novaCidade), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
        };
    
        const options = {
          autoCommit: true,
        };
    
        let resUpdate = await conn.execute(cmdUpdateAeroporto, bindVariables, options);
    
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
          cr.status = "SUCCESS";
          cr.message = "Dados do aeroporto atualizados.";
        } else {
          cr.message = "Dados do aeroporto não atualizados.";
        }
      } catch (e) {
        if (e instanceof Error) {
          cr.message = e.message;
          console.error(e.message);
        } else {
          cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
      } finally {
        if (conn !== undefined) {
          await conn.close();
        }
        res.send(cr);
      }
    });
