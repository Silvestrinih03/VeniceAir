// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const passagemRouter = express.Router();
const port = 3000;
passagemRouter.use(express.json());
passagemRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();

// Padronizar respostas do servidor
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};

// Definir rota da requisição "Atualizar cidade"
passagemRouter.post("/comprarPassagem", async (req, res) => {
  const idassento = req.body.idassento;
  const idvoo = req.body.idvoo as Number;
  const nomeCliente = req.body.nome as String;
  const emailCliente = req.body.email as String;

  console.log("ID ASSENTO: ", idassento);
  console.log("ID VOO: ", idvoo);
  console.log("NOME : ", nomeCliente);
  console.log("EMAIL: ", emailCliente);
  


  
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

    const cmdUpdateCidade = 'INSERT INTO PASSAGEM (ID_PASSAGEM, NOME_CLIENTE, EMAIL_CLIENTE, ID_ASSENTO, ID_VOO) VALUES (SEQ_PASSAGEM.nextval, :nomeCliente, :emailCliente, :idassento, :idvoo)'
//'INSERT INTO AEROPORTOS(SIGLA, CIDADE) VALUES (:1, :2)';
        const bindVariables = {
          nomeCliente: { val: nomeCliente, type: oracledb.STRING, dir: oracledb.BIND_IN },
          emailCliente: { val: emailCliente, type: oracledb.STRING, dir: oracledb.BIND_IN },
          idassento: { val: Number(idassento), type: oracledb.NUMBER, dir: oracledb.BIND_IN },
          idvoo: { val: Number(idvoo), type: oracledb.NUMBER, dir: oracledb.BIND_IN }
        };
    
        const options = {
          autoCommit: true,
        };
    
        let resUpdate = await conn.execute(cmdUpdateCidade, bindVariables, options);
    
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
          cr.status = "SUCCESS";
          cr.message = "Dados da cidade atualizados.";
        } else {
          cr.message = "Dados da cidade não atualizados. Verifique se o código informado está correto.";
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
