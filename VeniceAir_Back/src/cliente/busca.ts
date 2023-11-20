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

buscaRouter.get("/buscarVoo", async(req,res)=>{
  
  let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};

  try{
    const connAttibs: ConnectionAttributes = {
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    }
    const connection = await oracledb.getConnection(connAttibs);
    let resultadoConsulta = await connection.execute("SELECT * FROM CIDADES");
  
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