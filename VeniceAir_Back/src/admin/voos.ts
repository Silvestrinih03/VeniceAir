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

// Função OK
vooRouter.get("/listarVoos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT V.ID_VOO, CO.NOME AS CIDADE_ORIGEM, CD.NOME AS CIDADE_DESTINO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE");
  
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
  
  // meu deus era só colocar letra maiuscula
  const trecho = req.body.Trecho as number;
  const data_partida = req.body.Data as string;
  const hora_partida = req.body.HorarioPartida as string;
  const hora_chegada = req.body.HorarioChegada as string;
  const aeroporto_partida = req.body.AeroportoPartida as number;
  const aeroporto_chegada = req.body.AeroportoChegada as number;
  const valor = req.body.Valor as number;


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

    console.log("Dados para inserção:", {
      trecho,
      data_partida,
      hora_partida,
      hora_chegada,
      aeroporto_partida,
      aeroporto_chegada,
      valor,
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

// Função OK
vooRouter.delete("/excluirVoo/:codigo", async (req, res) => {
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

      const cmdDeleteVoo = `DELETE VOOS WHERE ID_VOO = :1`;
      const dados = [codigo];
      let resDelete = await connection.execute(cmdDeleteVoo, dados);
      await connection.commit();
      await connection.close();

      const rowsDeleted = resDelete.rowsAffected;
      if (rowsDeleted !== undefined && rowsDeleted === 1) {
          cr.status = "SUCCESS";
          cr.message = "Voo excluído.";
      } else {
          cr.message = "Voo não excluído. Verifique se o código informado está correto.";
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
