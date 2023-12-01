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

// Rota para listar trechos cadastrados (listagem de registros)
trechoRouter.get("/listarTrechos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT ID_TRECHO, (SELECT c.NOME FROM CIDADES c WHERE c.ID_CIDADE = T.CIDADE_ORIGEM) AS CIDADE_ORIGEM,(SELECT c.NOME FROM CIDADES c WHERE c.ID_CIDADE = T.CIDADE_DESTINO) AS CIDADE_DESTINO FROM TRECHOS T ORDER BY ID_TRECHO");
  
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

// Rota para inserir trechos
trechoRouter.post("/inserirTrecho", async(req,res)=>{
  
  const origem = req.body.origem as number;
  const destino = req.body.destino as number;
  
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

    const cmdInsertTrecho = `INSERT INTO TRECHOS 
    (ID_TRECHO, CIDADE_ORIGEM, CIDADE_DESTINO)
    VALUES
    (SEQ_TRECHOS.NEXTVAL, :1, :2)`

    const dados = [origem, destino];
    let resInsert = await conn.execute(cmdInsertTrecho, dados);
    await conn.commit();
  
    const rowsInserted = resInsert.rowsAffected
    if(rowsInserted !== undefined &&  rowsInserted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Trecho inserido.";
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

// Rota para excluir trechos
trechoRouter.delete("/excluirTrecho/:codigo", async (req, res) => {
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

      const cmdDeleteTrecho = `DELETE TRECHOS WHERE ID_TRECHO = :1`;
      const dados = [codigo];
      let resDelete = await connection.execute(cmdDeleteTrecho, dados);
      await connection.commit();
      await connection.close();

      const rowsDeleted = resDelete.rowsAffected;
      if (rowsDeleted !== undefined && rowsDeleted === 1) {
          cr.status = "SUCCESS";
          cr.message = "Trecho excluído.";
      } else {
          cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
      }
  } catch (e) {
    // Verifique erros da Oracle
    if (e instanceof Error) {
      // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
      if (e.message.includes("ORA-02292")) {
      cr.message = "Antes de excluir este trecho, certifique-se de remover os voos vinculados a ele."; 
        console.log(e.message); }
    } else {
        cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
} finally {
    res.send(cr);
}
});

// Rota para editar trechos
trechoRouter.post("/editarTrecho/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  const novaOrigem = req.body.origem as number;
  const novoDestino = req.body.destino as number;

  console.log(codigo);
  console.log(novaOrigem);
  console.log(novoDestino);
  
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
            UPDATE TRECHOS
            SET CIDADE_ORIGEM = :novaOrigem, CIDADE_DESTINO = :novoDestino
            WHERE ID_TRECHO = :codigo
        `;

        const bindVariables = {
          codigo: { val: Number(codigo), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          novaOrigem: { val: Number(novaOrigem), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          novoDestino: { val: Number(novoDestino), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
        };
    
        const options = {
          autoCommit: true,
        };
    
        let resUpdate = await conn.execute(cmdUpdateAeroporto, bindVariables, options);
    
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
          cr.status = "SUCCESS";
          cr.message = "Dados do trecho atualizados.";
        } else {
          cr.message = "Dados do trecho não atualizados.";
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
