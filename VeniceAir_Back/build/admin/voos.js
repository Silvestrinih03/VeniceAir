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
exports.vooRouter = void 0;
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
exports.vooRouter = express_1.default.Router();
const port = 3000;
exports.vooRouter.use(express_1.default.json());
exports.vooRouter.use((0, cors_1.default)());
dotenv_1.default.config();
exports.vooRouter.get("/listarVoos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT V.ID_VOO, CO.NOME AS CIDADE_ORIGEM, CD.NOME AS CIDADE_DESTINO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE");
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
exports.vooRouter.put("/inserirVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trecho = req.body.trecho;
    const data_partida = req.body.data_partida;
    const hora_partida = req.body.hora_partida;
    const hora_chegada = req.body.hora_chegada;
    const aeroporto_partida = req.body.aeroporto_partida;
    const aeroporto_chegada = req.body.aeroporto_chegada;
    const valor = req.body.valor;
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
        const cmdInsertVoo = `INSERT INTO VOOS VALUES (SEQ_TRECHOS.NEXTVAL, :1, :2, :3, :4, :5, :6, :7)`;
        const dados = [trecho, data_partida, hora_partida, hora_chegada, aeroporto_partida, aeroporto_chegada, valor];
        let resInsert = yield conn.execute(cmdInsertVoo, dados);
        yield conn.commit();
        const rowsInserted = resInsert.rowsAffected;
        if (rowsInserted !== undefined && rowsInserted === 1) {
            cr.status = "SUCCESS";
            cr.message = "Voo inserido.";
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
// vooRouter.delete("/excluirVoo", async(req,res)=>{
//   const codigo = req.body.codigo as number;
//   let cr: CustomResponse = {
//     status: "ERROR",
//     message: "",
//     payload: undefined,
//   };
//   try{
//     const connection = await oracledb.getConnection({
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     });
//     const cmdDeleteVoo = `DELETE VOO WHERE ID_VOO = :1`
//     const dados = [codigo];
//     let resDelete = await connection.execute(cmdDeleteVoo, dados);
//     await connection.commit();
//     await connection.close();
//     const rowsDeleted = resDelete.rowsAffected
//     if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Voo excluído.";
//     }else{
//       cr.message = "Voo não excluído. Verifique se o código informado está correto.";
//     }
//   }catch(e){
//     if(e instanceof Error){
//       cr.message = e.message;
//       console.log(e.message);
//     }else{
//       cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//     }
//   } finally {
//     res.send(cr);  
//   }
// });
// vooRouter.put("/atualizarVoo", async (req, res) => {
//   const codigo = req.body.codigo as number;
//   const voo = req.body.voo as string;
//   const origem = req.body.origem as string;
//   const destino = req.body.destino as string;
//   const dia = req.body.dia as number;
//   const horario = req.body.horario as number;
//   const valor = req.body.valor as number;
//   let cr: CustomResponse = {
//     status: "ERROR",
//     message: "",
//     payload: undefined,
//   };
//   let conn;
//   try {
//     conn = await oracledb.getConnection({
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     });
//     const cmdUpdateVoo = `UPDATE VOOS 
//       SET VOO = :1, ORIGEM = :2, DESTINO = :3, DIA = :4, HORARIO = :5, VALOR = :6
//       WHERE ID_VOO = :7`;
//     const dados = [voo, origem, destino, dia, horario, valor, codigo];
//     let resUpdate = await conn.execute(cmdUpdateVoo, dados);
//     await conn.commit();
//     const rowsUpdated = resUpdate.rowsAffected;
//     if (rowsUpdated !== undefined && rowsUpdated === 1) {
//       cr.status = "SUCCESS";
//       cr.message = "Voo atualizado.";
//     } else {
//       cr.message = "Voo não atualizado. Verifique se o código informado está correto.";
//     }
//   } catch (e) {
//     if (e instanceof Error) {
//       cr.message = e.message;
//       console.log(e.message);
//     } else {
//       cr.message = "Erro ao conectar ao Oracle. Sem detalhes.";
//     }
//   } finally {
//     if (conn !== undefined) {
//       await conn.close();
//     }
//     res.send(cr);
//   }
// });
