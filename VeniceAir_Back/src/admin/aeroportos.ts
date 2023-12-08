// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const aeroportoRouter = express.Router();
const port = 3000;
aeroportoRouter.use(express.json());
aeroportoRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();

// Padronizar respostas do servidor
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Rota para listar aeroportos (listagem de registros)
aeroportoRouter.get("/listarAeroportos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("select ID_AEROPORTO,SIGLA, (select c.NOME from CIDADES c where c.ID_CIDADE = CIDADE) from AEROPORTOS ORDER BY ID_AEROPORTO");
  
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

// Rota para inserir aeroportos no banco
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

// Rota para excluir aeroportos
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
    // Verifique erros da Oracle
    if (e instanceof Error) {
      // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
      if (e.message.includes("ORA-02292")) {
      cr.message = "Antes de excluir este aeroporto, certifique-se de remover os voos vinculados a ele."; 
        console.log(e.message); }
    } else {
        cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
} finally {
    res.send(cr);
}
});

// Rota para editar aeroportos
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
