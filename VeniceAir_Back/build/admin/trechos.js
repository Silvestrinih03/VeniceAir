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
exports.trechoRouter = void 0;
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
exports.trechoRouter = express_1.default.Router();
const port = 3000;
exports.trechoRouter.use(express_1.default.json());
exports.trechoRouter.use((0, cors_1.default)());
dotenv_1.default.config();
// Função para listar trechos cadastrados - OK
exports.trechoRouter.get("/listarTrechos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT ID_TRECHO, (SELECT c.NOME FROM CIDADES c WHERE c.ID_CIDADE = T.CIDADE_ORIGEM) AS CIDADE_ORIGEM,(SELECT c.NOME FROM CIDADES c WHERE c.ID_CIDADE = T.CIDADE_DESTINO) AS CIDADE_DESTINO FROM TRECHOS T");
        yield connection.close();
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = resultadoConsulta.rows;
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
        res.send(cr);
    }
}));
// Função para inserir trecho - OK
exports.trechoRouter.post("/inserirTrecho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const origem = req.body.origem;
    const destino = req.body.destino;
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
        const cmdInsertTrecho = `INSERT INTO TRECHOS 
    (ID_TRECHO, CIDADE_ORIGEM, CIDADE_DESTINO)
    VALUES
    (SEQ_TRECHOS.NEXTVAL, :1, :2)`;
        const dados = [origem, destino];
        let resInsert = yield conn.execute(cmdInsertTrecho, dados);
        yield conn.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho inserido.";
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
// Função para excluir trecho - OK
exports.trechoRouter.delete("/excluirTrecho/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.params.codigo;
    let cr = {
        status: "ERROR",
        message: "",
        payload: undefined,
    };
    try {
        const connection = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        });
        const cmdDeleteTrecho = `DELETE TRECHOS WHERE ID_TRECHO = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteTrecho, dados);
        yield connection.commit();
        yield connection.close();
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Trecho excluído.";
        }
        else {
            cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        if (e instanceof Error) {
            cr.message = e.message;
            console.log(e.message);
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        res.send(cr);
    }
}));
// FUNCAO ALTERAR
exports.trechoRouter.post("/editarTrecho/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.params.codigo;
    const novaOrigem = req.body.origem;
    const novoDestino = req.body.destino;
    console.log(codigo);
    console.log(novaOrigem);
    console.log(novoDestino);
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
        const cmdUpdateAeroporto = `
            UPDATE TRECHOS
            SET CIDADE_ORIGEM = :novaOrigem, CIDADE_DESTINO = :novoDestino
            WHERE ID_TRECHO = :codigo
        `;
        const bindVariables = {
            codigo: { val: Number(codigo), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
            novaOrigem: { val: Number(novaOrigem), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
            novoDestino: { val: Number(novoDestino), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
        };
        const options = {
            autoCommit: true,
        };
        let resUpdate = yield conn.execute(cmdUpdateAeroporto, bindVariables, options);
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
            cr.status = "SUCCESS";
            cr.message = "Dados do trecho atualizados.";
        }
        else {
            cr.message = "Dados do trecho não atualizados.";
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
