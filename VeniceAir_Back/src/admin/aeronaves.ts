// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const aeronaveRouter = express.Router();
const port = 3000; //muda a porta se não for isso
aeronaveRouter.use(express.json());
aeronaveRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();

// Padronizar respostas do servidor
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Rota para listar aeronaves (listagem de registros)
aeronaveRouter.get("/listarAeronaves", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT * FROM AERONAVES ORDER BY ID_AERONAVE");
  
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

// Rota para inserir aeronaves no banco
aeronaveRouter.post("/inserirAeronaves", async(req,res)=>{
  
  const fabricante = req.body.fabricante as Selection;
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
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    });

    const cmdInsertAeronave = 'INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_ASSENTOS) VALUES (:1, :2, :3, :4)';

    const dados = [fabricante, modelo, anofab, qtdeAssentos];
    let resInsert = await conn.execute(cmdInsertAeronave, dados);
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

// Rota para excluir aeronave do banco
aeronaveRouter.delete("/excluirAeronave/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  console.log("codigo=====", codigo);

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

      const cmdDeleteTrecho = `DELETE AERONAVES WHERE ID_AERONAVE = :1`;
      const dados = [codigo];
      let resDelete = await connection.execute(cmdDeleteTrecho, dados);
      await connection.commit();
      await connection.close();

      const rowsDeleted = resDelete.rowsAffected;
      if (rowsDeleted !== undefined && rowsDeleted === 1) {
          cr.status = "SUCCESS";
          cr.message = "Aeronave excluída.";
      } else {
          cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
      }
  } catch (e) {
      // Verifique erros da Oracle
      if (e instanceof Error) {
        // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
        if (e.message.includes("ORA-02292")) {
        cr.message = "Antes de excluir esta aeronave, certifique-se de remover os dados vinculados ao seu mapa de assentos."; 
          console.log(e.message); }
      } else {
          cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
      }
  } finally {
      res.send(cr);
  }
});

// Rota para listar dados da aeronave na função de editar
aeronaveRouter.get("/listarAeronave/:codigo", async(req,res)=>{
  const codigo = req.params.codigo;

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    const resultadoConsulta = await connection.execute("SELECT ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_ASSENTOS FROM AERONAVES WHERE ID_AERONAVE = :1", [codigo]);

    //let resultadoConsulta = await connection.execute("SELECT FROM AERONAVES WHERE ID_AERONAVE = :1");
  
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

// Rota para editar dados da aeronave no banco
aeronaveRouter.post("/editarAeronave/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  const fabricante = req.body.fabricante as string;
  const modelo = req.body.modelo as string;
  const anofab = req.body.anofab as number;
  const qtdAssentos = req.body.qtd as number;

  console.log(codigo);
  console.log(fabricante);
  console.log(modelo);
  console.log(anofab);
  console.log(qtdAssentos);

  
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

    const cmdUpdateAeronave = `
            UPDATE AERONAVES
            SET FABRICANTE = :fabricante, MODELO = :modelo, ANOFAB = :anofab, QNT_ASSENTOS = :qtdAssentos
            WHERE ID_AERONAVE = :codigo
        `;

        const bindVariables = {
          codigo: { val: Number(codigo), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          fabricante: { val: fabricante, type: oracledb.STRING, dir: oracledb.BIND_IN },
          modelo: { val: modelo, type: oracledb.STRING, dir: oracledb.BIND_IN },
          anofab: { val: Number(anofab), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          qtdAssentos: { val: Number(qtdAssentos), type: oracledb.NUMBER, dir: oracledb.BIND_IN },


        };
    
        const options = {
          autoCommit: true,
        };
    
        let resUpdate = await conn.execute(cmdUpdateAeronave, bindVariables, options);
    
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
          cr.status = "SUCCESS";
          cr.message = "Dados da aeronave atualizados.";
        } else {
          cr.message = "Dados da aeronave não atualizados.";
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
