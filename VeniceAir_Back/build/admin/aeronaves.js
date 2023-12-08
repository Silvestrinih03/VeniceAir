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
exports.aeronaveRouter = void 0;
// Importações dos módulos necessários para que o sistema funcione
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
exports.aeronaveRouter = express_1.default.Router();
const port = 3000; //muda a porta se não for isso
exports.aeronaveRouter.use(express_1.default.json());
exports.aeronaveRouter.use((0, cors_1.default)());
// Chama o dotenv para receber os dados do banco
dotenv_1.default.config();
// Rota para listar aeronaves (listagem de registros)
exports.aeronaveRouter.get("/listarAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM AERONAVES ORDER BY ID_AERONAVE");
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
// Rota para inserir aeronaves no banco
exports.aeronaveRouter.post("/inserirAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fabricante = req.body.fabricante;
    const modelo = req.body.modelo;
    const anofab = req.body.anofab;
    const qtdeAssentos = req.body.qtdeAssentos;
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
        const cmdInsertAeronave = 'INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_ASSENTOS) VALUES (:1, :2, :3, :4)';
        const dados = [fabricante, modelo, anofab, qtdeAssentos];
        let resInsert = yield conn.execute(cmdInsertAeronave, dados);
        yield conn.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave inserida.";
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
// Rota para excluir aeronave do banco
exports.aeronaveRouter.delete("/excluirAeronave/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.params.codigo;
    console.log("codigo=====", codigo);
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
        const cmdDeleteTrecho = `DELETE AERONAVES WHERE ID_AERONAVE = :1`;
        const dados = [codigo];
        let resDelete = yield connection.execute(cmdDeleteTrecho, dados);
        yield connection.commit();
        yield connection.close();
        const rowsDeleted = resDelete.rowsAffected;
        if (rowsDeleted !== undefined && rowsDeleted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Aeronave excluída.";
        }
        else {
            cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
        }
    }
    catch (e) {
        // Verifique erros da Oracle
        if (e instanceof Error) {
            // Retorna mensagem amigável para o erro ORA-02292 - Ação não pode ser realizada, pois este registro possui filhos cadastrados em outras tabelas
            if (e.message.includes("ORA-02292")) {
                cr.message = "Antes de excluir esta aeronave, certifique-se de remover os dados vinculados ao seu mapa de assentos.";
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
// Rota para listar dados da aeronave na função de editar
exports.aeronaveRouter.get("/listarAeronave/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.params.codigo;
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        const resultadoConsulta = yield connection.execute("SELECT ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_ASSENTOS FROM AERONAVES WHERE ID_AERONAVE = :1", [codigo]);
        //let resultadoConsulta = await connection.execute("SELECT FROM AERONAVES WHERE ID_AERONAVE = :1");
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
// Rota para editar dados da aeronave no banco
exports.aeronaveRouter.post("/editarAeronave/:codigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const codigo = req.params.codigo;
    const fabricante = req.body.fabricante;
    const modelo = req.body.modelo;
    const anofab = req.body.anofab;
    const qtdAssentos = req.body.qtd;
    console.log(codigo);
    console.log(fabricante);
    console.log(modelo);
    console.log(anofab);
    console.log(qtdAssentos);
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
        const cmdUpdateAeronave = `
            UPDATE AERONAVES
            SET FABRICANTE = :fabricante, MODELO = :modelo, ANOFAB = :anofab, QNT_ASSENTOS = :qtdAssentos
            WHERE ID_AERONAVE = :codigo
        `;
        const bindVariables = {
            codigo: { val: Number(codigo), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
            fabricante: { val: fabricante, type: oracledb_1.default.STRING, dir: oracledb_1.default.BIND_IN },
            modelo: { val: modelo, type: oracledb_1.default.STRING, dir: oracledb_1.default.BIND_IN },
            anofab: { val: Number(anofab), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
            qtdAssentos: { val: Number(qtdAssentos), type: oracledb_1.default.NUMBER, dir: oracledb_1.default.BIND_IN },
        };
        const options = {
            autoCommit: true,
        };
        let resUpdate = yield conn.execute(cmdUpdateAeronave, bindVariables, options);
        const rowsUpdated = resUpdate.rowsAffected;
        if (rowsUpdated !== undefined && rowsUpdated === 1) {
            cr.status = "SUCCESS";
            cr.message = "Dados da aeronave atualizados.";
        }
        else {
            cr.message = "Dados da aeronave não atualizados.";
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
