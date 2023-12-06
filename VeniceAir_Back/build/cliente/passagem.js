"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passagemRouter = void 0;
// Importações dos módulos necessários para que o sistema funcione
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
exports.passagemRouter = express_1.default.Router();
const port = 3000;
exports.passagemRouter.use(express_1.default.json());
exports.passagemRouter.use((0, cors_1.default)());
// Chama o dotenv para receber os dados do banco
dotenv_1.default.config();
// Definir rota da requisição "Atualizar cidade"
exports.passagemRouter.post("/comprarPassagem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idassento = req.body.idassento;
    const idvoo = req.body.idvoo;
    const nomeCliente = req.body.nome;
    const emailCliente = req.body.email;
    console.log("ID ASSENTO: ", idassento);
    console.log("ID VOO: ", idvoo);
    console.log("NOME : ", nomeCliente);
    console.log("EMAIL: ", emailCliente);
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    let conn;
    try {
        conn = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        });
        const cmdUpdateCidade = 'INSERT INTO PASSAGEM (ID_PASSAGEM, NOME_CLIENTE, EMAIL_CLIENTE, ID_ASSENTO, ID_VOO) VALUES (SEQ_PASSAGEM.nextval, :nomeCliente, :emailCliente, :idassento, :idvoo)';
        //'INSERT INTO AEROPORTOS(SIGLA, CIDADE) VALUES (:1, :2)';
        const bindVariables = {
            nomeCliente: { val: nomeCliente, type: oracledb_1.default.STRING, dir: oracledb_1.default.BIND_IN },
            emailCliente: { val: emailCliente, type: oracledb_1.default.STRING, dir: oracledb_1.default.BIND_IN },
            idassento: { val: Number(idassento), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
            idvoo: { val: Number(idvoo), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN }
        };
        const options = {
            autoCommit: true,
        };
        let resUpdate = yield conn.execute(cmdUpdateCidade, bindVariables, options);
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
            cr.status = "SUCCESS";
            cr.message = "Dados da cidade atualizados.";
        }
        else {
            cr.message = "Dados da cidade não atualizados. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.error(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        if (conn !== undefined) {
            yield conn.close();
        }
        res.send(cr);
    }
}));
