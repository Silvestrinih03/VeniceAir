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
exports.avaliacaoRouter = void 0;
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// const app = express();
exports.avaliacaoRouter = express_1.default.Router();
const port = 3000;
exports.avaliacaoRouter.use(express_1.default.json());
exports.avaliacaoRouter.use((0, cors_1.default)());
dotenv_1.default.config();
// Função OK
exports.avaliacaoRouter.put("/inserirAvaliacao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.body.nome;
    const email = req.body.email;
    const avaliacao = req.body.avaliacao;
    const descricao = req.body.descricao;
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
        const cmdInsertAvaliacao = 'INSERT INTO AVALIACOES(NOME, EMAIL, AVALIACAO, DESCRICAO) VALUES (:1, :2, :3, :4)';
        const dados = [nome, email, avaliacao, descricao];
        let resInsert = yield conn.execute(cmdInsertAvaliacao, dados);
        yield conn.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Avaliação enviada com sucesso! Agradecemos pelo feedback!";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao oracle. Sem detalhes";
        }
    }
    finally {
        if (conn !== undefined) {
            yield conn.close();
        }
        res.send(cr);
    }
}));
