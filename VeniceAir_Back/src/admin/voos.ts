// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";
// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const vooRouter = express.Router();
const port = 3000;
vooRouter.use(express.json());
vooRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();

// Padronizar respostas do servidor
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Rota para listar os voos cadastrados no banco (listagem de registros)
vooRouter.get("/listarVoos", async(req,res)=>{

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT V.ID_VOO, CO.NOME AS CIDADE_ORIGEM, CD.NOME AS CIDADE_DESTINO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE ORDER BY ID_VOO");
  
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

// Definir rota da requisição para inserir voos
vooRouter.post("/inserirVoo", async (req, res) => {
  const trecho = req.body.trecho as number;
  const data_partida = new Date(req.body.data_partida);
  data_partida.setDate(data_partida.getDate() + 1);
  // teste
  console.log('dataa que a /inserirVoo esta recebendo =', data_partida);
  const hora_partida = req.body.hora_partida as string;
  const hora_chegada = req.body.hora_chegada as string;
  const aeroporto_partida = req.body.aeroporto_partida as number;
  const aeroporto_chegada = req.body.aeroporto_chegada as number;
  const valor = req.body.valor as number;

  let cr = {
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

    const cmdInsertVoo =
      'INSERT INTO VOOS (TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR) VALUES (:1, :2, :3, :4, :5, :6, :7)';

    const dados = [trecho, data_partida, hora_partida, hora_chegada, aeroporto_partida, aeroporto_chegada, valor];
    let resInsert = await conn.execute(cmdInsertVoo, dados);
    await conn.commit();

    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      cr.status = "SUCCESS";
      cr.message = "Voo inserido.";
    }
  } catch (e) {
    if (e instanceof Error) {
      cr.message = e.message;
      console.log(e.message);
    } else {
      cr.message = "Erro ao conectar ao Oracle. Sem detalhes.";
    }
  } finally {
    if (conn !== undefined) {
      await conn.close();
    }
    res.send(cr);
  }
});

// Definir rota da requisição para excluir voos
vooRouter.delete("/excluirVoo/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  console.log('codigo p excluir', codigo);

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

      const cmdDeleteTrecho = 'DELETE FROM VOOS WHERE ID_VOO = :1';
      const dados = [codigo];
      let resDelete = await connection.execute(cmdDeleteTrecho, dados);
      await connection.commit();
      await connection.close();

      const rowsDeleted = resDelete.rowsAffected;
      if (rowsDeleted !== undefined && rowsDeleted === 1) {
          cr.status = "SUCCESS";
          cr.message = "Voo excluído.";
      }
  } catch (e) {
    // Verifique erros da Oracle
    if (e instanceof Error) {
      // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
      if (e.message.includes("ORA-02292")) {
      cr.message = "Antes de excluir este voo, certifique-se de remover os mapas de assentos vinculados a ele."; 
        console.log(e.message); }
    } else {
        cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
    }
} finally {
    res.send(cr);
}
});


// Rota criada para editar os voos cadastrados no banco - lista os campos para que o usuário possa editar
vooRouter.get("/listarVoo/:codigo", async(req,res)=>{
  const codigo = req.params.codigo;

  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    const resultadoConsulta = await connection.execute("SELECT V.ID_VOO, T.ID_TRECHO AS ID_TRECHO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO WHERE V.ID_VOO = :1", [codigo]);

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

//Rota criada para alterar dados dos voos cadastrados
vooRouter.put("/editarVoo/:codigo", async(req, res) => {
  const codigo = req.params.codigo;
  const trecho = req.body.trecho as number;
  const data_partida = req.body.data_partida as Date;
  const hora_partida = req.body.hora_partida as string;
  const hora_chegada = req.body.hora_chegada as string;
  const aeroporto_partida = req.body.aeroporto_partida as number;
  const aeroporto_chegada = req.body.aeroporto_chegada as number;
  const valor = req.body.valor as number;

  console.log(codigo);
  console.log(trecho);
  console.log(data_partida);
  console.log(hora_partida);
  console.log(hora_chegada);
  console.log(aeroporto_partida);
  console.log(aeroporto_chegada);
  console.log(valor);

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

  //Validação dos dados da alteração de voos

  const cmdUpdateVoo = `
            UPDATE VOOS
            SET TRECHO = :trecho, DATA_PARTIDA = :data_partida, HORA_PARTIDA = :hora_partida, HORA_CHEGADA = :hora_chegada, AEROPORTO_PARTIDA = :aeroporto_partida, AEROPORTO_CHEGADA = :aeroporto_chegada, VALOR = :valor
            WHERE ID_VOO = :codigo
        `;

        const bindVariables = {
          codigo: { val: Number(codigo), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          trecho: { val: Number(trecho), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          data_partida: { val: data_partida, type: oracledb.DATE, dir: oracledb.BIND_IN },
          hora_partida: { val: Number(hora_partida), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          hora_chegada: { val: Number(hora_chegada), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          aeroporto_partida: { val: Number(aeroporto_partida), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          aeroporto_chegada: { val: Number(aeroporto_chegada), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          valor: { val: Number(valor), type: oracledb.NUMBER, dir: oracledb.BIND_IN }};
    
        const options = {
          autoCommit: true,
        };
    
        let resUpdate = await conn.execute(cmdUpdateVoo, bindVariables, options);
    
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
          cr.status = "SUCCESS";
          cr.message = "Dados do voo atualizados.";
        } else {
          cr.message = "Dados do voo não atualizados.";
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
