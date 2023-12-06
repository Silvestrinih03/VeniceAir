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
exports.assentoRouter = void 0;
// Importações dos módulos necessários para que o sistema funcione
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
exports.assentoRouter = express_1.default.Router();
const port = 3000;
exports.assentoRouter.use(express_1.default.json());
exports.assentoRouter.use((0, cors_1.default)());
// Chama o dotenv para receber os dados do banco
dotenv_1.default.config();
// Definir rota da requisição "comprarAssento"
exports.assentoRouter.post("comprarAssento/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idassento = req.params.id;
    //const idvoo = req.body.idvoo as Number;
    console.log("ID ASSENTO (TABELA ASSENTO): ", idassento);
    //console.log("ID VOO (TABELA ASSENTO): ", idvoo);
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
        const cmdUpdateAssento = `
            UPDATE ASS
            SET STATUS_ASSENTO = 1
            WHERE ID_ASSENTO = :idassento
        `;
        const bindVariables = {
            idassento: { val: Number(idassento), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
        };
        const options = {
            autoCommit: true,
        };
        let resUpdate = yield conn.execute(cmdUpdateAssento, bindVariables, options);
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
            cr.status = "SUCCESS";
            cr.message = "Dados do assento atualizados.";
        }
        else {
            cr.message = "Dados do assento não atualizados. Verifique se o código informado está correto.";
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
