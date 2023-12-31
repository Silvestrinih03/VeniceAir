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
// Importações dos módulos necessários para que o sistema funcione
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
exports.mapaRouter = express_1.default.Router();
const port = 3000; //muda a porta se não for isso
exports.mapaRouter.use(express_1.default.json());
exports.mapaRouter.use((0, cors_1.default)());
// Chama o dotenv para receber os dados do banco
dotenv_1.default.config();
// Definir rota da requisição listar mapas de voo
exports.mapaRouter.get("/listarMapas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM MAP");
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
// Definir rota para requisição inserir mapa de assentos
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
        const cmdInsertMapa = 'INSERT INTO MAP (ID_MAPA, AERONAVE, VOO, TOTAL_ASSENTOS) VALUES (SEQ_MAPA_DE_ASSENTOS.nextval, :1, :2, :3)';
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
// Definir rota da requisição para chamar o procedure e gerar os assentos
exports.mapaRouter.post("/procedureMapa2", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const p_aeronave_id = req.body.p_aeronave_id as number;
    const p_voo_id = parseInt(req.body.p_voo_id, 10);
    console.log("Typeof p_voo_id:", typeof p_voo_id);
    console.log("veja aqui: ", p_voo_id);
    let cr = { status: "ERROR", message: "", payload: undefined, };
    let conn;
    try {
        conn = yield oracledb_1.default.getConnection({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        });
        const cmdProcedure = `BEGIN PROCEDUREASSENTO(:p_voo_id); END;`;
        const bindVariables = {
            p_voo_id: { val: Number(p_voo_id), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN }
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
// Definir rota para encontrar mapa de assentos quando o usuário seleciona o voo
exports.mapaRouter.get("/acharMapa/:p_voo_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const p_voo_id = parseInt(req.params.p_voo_id, 10);
    console.log("Voo para achar mapa: ", p_voo_id);
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM ASS WHERE COD_VOO = :1", [p_voo_id]);
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
// Definir rota da requisição "Excluir mapas"
exports.mapaRouter.delete("/excluirMapa/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.params.codigo;
    console.log("chegou pra excluir da MAP: ", codigo);
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
        const cmdDeleteCidade = `DELETE MAP WHERE VOO = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteCidade, dados);
        yield connection.commit();
        yield connection.close();
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Mapa excluído.";
        }
        else {
            cr.message = "Mapa não excluído. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        // Verifique erros da Oracle
        if (e instanceof Error) {
            // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
            // if (e.message.includes("ORA-02292")) {
            // cr.message = "Antes de excluir esta mapa, certifique-se de remover os trechos e aeroportos vinculados a ela."; 
            //   console.log(e.message); }
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        res.send(cr);
    }
}));
// Definir rota da requisição "Excluir assentos"
exports.mapaRouter.delete("/excluirAssentos/:cod_voo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cod_voo = req.params.cod_voo;
    console.log("aqui no back chegou codigo: ", cod_voo);
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
        const cmdDeleteCidade = `DELETE ASS WHERE COD_VOO = :1`;
        const dados = [cod_voo];
        let resDelete = yield connection.execute(cmdDeleteCidade, dados);
        yield connection.commit();
        yield connection.close();
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Assentos excluídos.";
        }
        else {
            cr.message = "Assentos não excluídos. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        // Verifique erros da Oracle
        if (e instanceof Error) {
            // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
            // if (e.message.includes("ORA-02292")) {
            // cr.message = "Antes de excluir esta mapa, certifique-se de remover os trechos e aeroportos vinculados a ela."; 
            //   console.log(e.message); }
        }
        else {
            cr.message = "Erro ao conectar ao Oracle. Sem detalhes";
        }
    }
    finally {
        res.send(cr);
    }
}));
