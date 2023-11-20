// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const avaliacaoRouter = express.Router();
const port = 3000;
avaliacaoRouter.use(express.json());
avaliacaoRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();

// Padronizar respostas do servidor
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Definir rota da requisição "Inserir avaliação"
avaliacaoRouter.put("/inserirAvaliacao", async(req,res)=>{
  // Extrair os dados necessários para a requisição
  const nome = req.body.nome as string;
  const email = req.body.email as string;
  const avaliacao = req.body.avaliacao as number;
  const descricao = req.body.descricao as string;
  // Iniciar resposta padrão
  let cr: CustomResponse = {
    status: "ERROR",
    message: "",
    payload: undefined,
  };
  // Conectar com o banco de dados
  let conn;
  try{
    conn = await oracledb.getConnection({
      user: process.env.ORACLE_DB_USER,
      password: process.env.ORACLE_DB_SECRET,
      connectionString: process.env.ORACLE_DB_CONN_STR,
    });
    // Comando SQL que insere os dados no banco
    const cmdInsertAvaliacao = 'INSERT INTO AVALIACOES(NOME, EMAIL, AVALIACAO, DESCRICAO) VALUES (:1, :2, :3, :4)';
    // Array dos dados que serão inseridos no banco
    const dados = [nome, email, avaliacao, descricao];
    // Executa o comando SQL no banco de dados e salva a ação
    let resInsert = await conn.execute(cmdInsertAvaliacao, dados);
    await conn.commit();
    // Verifica se a inserção foi bem sucedida
    const rowsInserted = resInsert.rowsAffected;
    if (rowsInserted !== undefined &&  rowsInserted === 1) {
      cr.status = "SUCCESS"; 
      cr.message = "Avaliação enviada com sucesso! Agradecemos pelo feedback!";
    }
    }catch(e){
      // Tratamente de erros que podem ocorrer durante a execução
      if(e instanceof Error){
        cr.message = e.message;
        console.log(e.message);
      }else{
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    } finally {
      // Finaliza a conexão com o banco de dados
      if(conn!== undefined){
        await conn.close();
      }
      // Envia resposta para o cliente
      res.send(cr);  
    }
  });