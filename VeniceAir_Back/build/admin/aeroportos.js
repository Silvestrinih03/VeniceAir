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

exports.aeroportoRouter.get("/listarAeroportos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM AEROPORTOS");
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


exports.aeroportoRouter.put("/inserirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const aeroporto = req.body.aeroporto;
    const cidade = req.body.cidade;
    // const pais = req.body.pais as string;
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
        const cmdInsertAeroporto = `INSERT INTO AEROPORTOS 
    (ID_AEROPORTO, NOME, CIDADE)
    VALUES
    (SEQ_AEROPORTOS.NEXTVAL, :1, :2)`;
        const dados = [aeroporto, cidade];
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
exports.aeroportoRouter.delete("/excluirAeroporto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.body.codigo;
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
