// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const buscaRouter = express.Router();
const port = 3000; //muda a porta se não for isso
buscaRouter.use(express.json());
buscaRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();

// Padronizar respostas do servidor
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// // Definir rota da requisição "Buscar voo"
// buscaRouter.post("/buscarVoo", async(req,res)=>{
//   // Extrair os dados necessários para a requisição
//   const tipopassagem = req.body.campo_select as string;
//   const partidaDe = req.body.campo_select2 as number;
//   const chegadaA = req.body.campo_select3 as number;
//   const dataIda = new Date(req.body.data_ida);
//   //const tipopassagem = req.body.campo_select as string;
//   // Iniciar resposta padrão
//   let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
//   // Iniciar conexão com o banco de dados
//   try{
//     const connAttibs: ConnectionAttributes = {
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     }
//     // Comando SQL que retorna os dados requeridos do banco
//     const connection = await oracledb.getConnection(connAttibs);
//     let query =
//       "SELECT V.* FROM VOOS V " +
//       "JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO " +
//       "WHERE ";

//     const params = [];

//     if (tipopassagem === "1") {
//       // Tipo de passagem: Ida
//       query += "V.DATA_PARTIDA = :dataIda AND ";
//       params.push(dataIda);
//     } else if (tipopassagem === "2") {
//       // Tipo de passagem: Ida e volta
//       query += "V.DATA_PARTIDA = :dataIda AND ";
//       //query += "V.DATA_VOLTA = :dataVolta AND ";
//       params.push(dataIda);
//       params.push(new Date(req.body.data_volta));
//     }

//     query += "T.CIDADE_ORIGEM = :partidaDe AND ";
//     query += "T.CIDADE_DESTINO = :chegadaA";

//     params.push(partidaDe);
//     params.push(chegadaA);

//     let resultadoConsulta = await connection.execute(query, params);

//     await connection.close();

//     cr.status = "SUCCESS";
//     cr.message = "Dados obtidos";
//     cr.payload = resultadoConsulta.rows;
//   } catch (e) {
//     if (e instanceof Error) {
//       cr.message = e.message;
//       console.log(e.message);
//     } else {
//       cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//     }
//   } finally {
//     res.send(cr);
//   }
// });

buscaRouter.post("/buscarVoo", async(req,res)=>{
  //const cidadeOrigem = req.body.ori;
  
  //const cidadeDestino = req.body.dest;
  
  //const dataIda = new Date(req.body.dt);
  

  const cidadeOrigem = req.body.ori;
  const cidadeDestino = req.body.dest;
  const dataIda = new Date(req.body.dt);
  
  console.log('cidadeOrigem =', cidadeOrigem);
  console.log('cidadeDestino =', cidadeDestino);
  console.log('dataIda =', dataIda);
  
  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    //let resultadoConsulta = await connection.execute("SELECT V.ID_VOO, CO.NOME AS CIDADE_ORIGEM, CD.NOME AS CIDADE_DESTINO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE WHERE CO.NOME = :cidadeOrigem AND CD.NOME = :cidadeDestino AND V.DATA_PARTIDA = TO_DATE(:dataIda, 'YYYY-MM-DD')", { cidadeOrigem, cidadeDestino, dataIda });
    let resultadoConsulta = await connection.execute("SELECT V.ID_VOO, CO.NOME AS CIDADE_ORIGEM, CD.NOME AS CIDADE_DESTINO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE WHERE CO.ID_CIDADE = :cidadeOrigem AND CD.ID_CIDADE = :cidadeDestino AND V.DATA_PARTIDA = :dataIda", { cidadeOrigem, cidadeDestino, dataIda });
    // comando certo SELECT V.ID_VOO, CO.NOME AS CIDADE_ORIGEM, CD.NOME AS CIDADE_DESTINO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE WHERE CO.ID_CIDADE = 11 AND CD.ID_CIDADE = 13 AND V.DATA_PARTIDA = TO_DATE('14/12/2023', 'DD/MM/YYYY');

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