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
exports.aeroportoRouter = void 0;
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// const app = express();
exports.aeroportoRouter = express_1.default.Router();
const port = 3000;
exports.aeroportoRouter.use(express_1.default.json());
exports.aeroportoRouter.use((0, cors_1.default)());
dotenv_1.default.config();
// Rota para listar aeroportos (listagem de registros)
exports.aeroportoRouter.get("/listarAeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("select ID_AEROPORTO,SIGLA, (select c.NOME from CIDADES c where c.ID_CIDADE = CIDADE) from AEROPORTOS ORDER BY ID_AEROPORTO");
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
// Rota para inserir aeroportos no banco
exports.aeroportoRouter.post("/inserirAeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sigla = req.body.sigla;
    const cidade = req.body.cidade;
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
        const cmdInsertAeroporto = 'INSERT INTO AEROPORTOS(SIGLA, CIDADE) VALUES (:1, :2)';
        const dados = [sigla, cidade];
        let resInsert = yield conn.execute(cmdInsertAeroporto, dados);
        yield conn.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto inserido.";
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
// Rota para excluir aeroportos
exports.aeroportoRouter.delete("/excluirAeroporto/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const cmdDeleteAeroporto = `DELETE AEROPORTOS WHERE ID_AEROPORTO = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteAeroporto, dados);
        yield connection.commit();
        yield connection.close();
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeroporto excluído.";
        }
        else {
            cr.message = "Aeroporto não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        // Verifique erros da Oracle
        if (e instanceof Error) {
            // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
            if (e.message.includes("ORA-02292")) {
                cr.message = "Antes de excluir este aeroporto, certifique-se de remover os voos vinculados a ele.";
                console.log(e.message);
            }
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        res.send(cr);
    }
}));
// Rota para editar aeroportos
exports.aeroportoRouter.post("/editarAeroporto/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.params.codigo;
    const novaSigla = req.body.sigla;
    const novaCidade = req.body.cidade;
    console.log(codigo);
    console.log(novaSigla);
    console.log(novaCidade);
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
            UPDATE AEROPORTOS
            SET SIGLA = :novaSigla, CIDADE = :novaCidade
            WHERE ID_AEROPORTO = :codigo
        `;
        const bindVariables = {
            codigo: { val: Number(codigo), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
            novaSigla: { val: novaSigla, type: oracledb_1.default.STRING, dir: oracledb_1.default.BIND_IN },
            novaCidade: { val: Number(novaCidade), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
        };
        const options = {
            autoCommit: true,
        };
        let resUpdate = yield conn.execute(cmdUpdateAeroporto, bindVariables, options);
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
            cr.status = "SUCCESS";
            cr.message = "Dados do aeroporto atualizados.";
        }
        else {
            cr.message = "Dados do aeroporto não atualizados.";
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
