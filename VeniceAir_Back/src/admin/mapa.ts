// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const mapaRouter = express.Router();
const port = 3000; //muda a porta se não for isso
mapaRouter.use(express.json());
mapaRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Definir rota da requisição listar mapas de voo
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

// Definir rota para requisição inserir mapa de assentos
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
  
  // Definir rota da requisição para chamar o procedure e gerar os assentos
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

// Definir rota para encontrar mapa de assentos quando o usuário seleciona o voo
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

// Definir rota da requisição "Excluir mapas"
mapaRouter.delete("/excluirMapa/:codigo", async (req, res) => {
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

      const cmdDeleteCidade = `DELETE MAP WHERE ID_MAP = :1`;
      const dados = [codigo];
      let resDelete = await connection.execute(cmdDeleteCidade, dados);
      await connection.commit();
      await connection.close();

      const rowsDeleted = resDelete.rowsAffected;
      if (rowsDeleted !== undefined && rowsDeleted === 1) {
          cr.status = "SUCCESS";
          cr.message = "Mapa excluído.";
      } else {
          cr.message = "Mapa não excluído. Verifique se o código informado está correto.";
      }
  } catch (e) {
    // Verifique erros da Oracle
    if (e instanceof Error) {
      // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
      // if (e.message.includes("ORA-02292")) {
      // cr.message = "Antes de excluir esta mapa, certifique-se de remover os trechos e aeroportos vinculados a ela."; 
      //   console.log(e.message); }
    } else {
        cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
} finally {
    res.send(cr);
}
});

// Definir rota da requisição "Excluir assentos"
mapaRouter.delete("/excluirAssentos/:codigo", async (req, res) => {
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

      const cmdDeleteCidade = `DELETE ASS WHERE COD_VOO = :1`;
      const dados = [codigo];
      let resDelete = await connection.execute(cmdDeleteCidade, dados);
      await connection.commit();
      await connection.close();

      const rowsDeleted = resDelete.rowsAffected;
      if (rowsDeleted !== undefined && rowsDeleted === 1) {
          cr.status = "SUCCESS";
          cr.message = "Assentos excluídos.";
      } else {
          cr.message = "Assentos não excluídos. Verifique se o código informado está correto.";
      }
  } catch (e) {
    // Verifique erros da Oracle
    if (e instanceof Error) {
      // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
      // if (e.message.includes("ORA-02292")) {
      // cr.message = "Antes de excluir esta mapa, certifique-se de remover os trechos e aeroportos vinculados a ela."; 
      //   console.log(e.message); }
    } else {
        cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
} finally {
    res.send(cr);
}
});