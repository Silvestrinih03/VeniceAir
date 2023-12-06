// Importações dos módulos necessários para que o sistema funcione
import express from "express";
import oracledb, { Connection, ConnectionAttributes } from "oracledb";
import dotenv from "dotenv";
import cors from "cors";

// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
export const assentoRouter = express.Router();
const port = 3000;
assentoRouter.use(express.json());
assentoRouter.use(cors());

// Chama o dotenv para receber os dados do banco
dotenv.config();

// Padronizar respostas do servidor
type CustomResponse = {
  status: string,
  message: string,
  payload: any
};


// Definir rota da requisição "comprarAssento"
assentoRouter.post("/comprarAssento", async (req, res) => {
  const idassento = req.body.idassento;
  //const idvoo = req.body.idvoo as Number;

  console.log("ID ASSENTO (TABELA ASSENTO): ", idassento);
  //console.log("ID VOO (TABELA ASSENTO): ", idvoo);

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

    const cmdUpdateAssento = `
            UPDATE ASS
            SET STATUS_ASSENTO = 1
            WHERE ID_ASSENTO = :idassento
        `;

        const bindVariables = {
          idassento: { val: Number(idassento), type: oracledb.NUMBER, dir: oracledb.BIND_IN },

        };
    
        const options = {
          autoCommit: true,
        };
    
        let resUpdate = await conn.execute(cmdUpdateAssento, bindVariables, options);
    
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
          cr.status = "SUCCESS";
          cr.message = "Dados do assento atualizados.";
        } else {
          cr.message = "Dados do assento não atualizados. Verifique se o código informado está correto.";
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
