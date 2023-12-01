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
exports.mapaRouter = void 0;
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// const app = express();
exports.mapaRouter = express_1.default.Router();
const port = 3000; //muda a porta se não for isso
exports.mapaRouter.use(express_1.default.json());
exports.mapaRouter.use((0, cors_1.default)());
dotenv_1.default.config();
// INSERIR NOVO MAPA DE ASSENTOS
exports.mapaRouter.post("/inserirMapa", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const aeronave = req.body.aeronave;
    const voo = req.body.voo;
    const numAssentos = req.body.total;
    console.log("aeronave: ", aeronave);
    console.log("voo: ", voo);
    console.log("numeroAss: ", numAssentos);
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
        const cmdInsertMapa = 'INSERT INTO MAPA_DE_ASSENTOS (ID_MAPA, AERONAVE, VOO, TOTAL_ASSENTOS) VALUES (SEQ_MAPA_DE_ASSENTOS.nextval, :1, :2, :3)';
        const dados = [aeronave, voo, numAssentos];
        let resInsert = yield conn.execute(cmdInsertMapa, dados);
        yield conn.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Mapa inserido.";
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
// listar mapas de voo
exports.mapaRouter.get("/listarMapas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM MAPA_DE_ASSENTOS");
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
exports.mapaRouter.post("/procedureMapa", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const p_aeronave_id = req.body.p_aeronave_id as number;
    const p_aeronave_id = parseInt(req.body.p_aeronave_id, 10);
    console.log("Typeof p_aeronave_id:", typeof p_aeronave_id);
    console.log("veja aqui: ", p_aeronave_id);
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let conn;
    try {
        conn = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        });
        const cmdProcedure = `BEGIN CADASTRA_ASSENTO(:p_aeronave_id); END;`;
        const bindVariables = {
            p_aeronave_id: { val: Number(p_aeronave_id), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN }
        };
        const options = {
            autoCommit: true,
        };
        let resultadoProcedure = yield conn.execute(cmdProcedure, bindVariables, options);
        yield conn.close();
        cr.status = "SUCCESS";
        cr.message = "Dados obtidos";
        cr.payload = resultadoProcedure.rows;
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
// listar mapas de voo
exports.mapaRouter.get("/acharMapa/:p_voo_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const p_voo_id = parseInt(req.params.p_voo_id, 10);
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM ASSENTOS WHERE ");
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
