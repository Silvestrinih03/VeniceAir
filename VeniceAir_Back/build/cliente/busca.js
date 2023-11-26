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
exports.buscaRouter = void 0;
// Importações dos módulos necessários para que o sistema funcione
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Rotas necessárias para o funcionamento do express e definição da porta onde serão realizadas as requisições
exports.buscaRouter = express_1.default.Router();
const port = 3000; //muda a porta se não for isso
exports.buscaRouter.use(express_1.default.json());
exports.buscaRouter.use((0, cors_1.default)());
// Chama o dotenv para receber os dados do banco
dotenv_1.default.config();
// // Definir rota da requisição "Buscar voo"
// buscaRouter.post("/buscarVoo", async(req,res)=>{
//   // Extrair os dados necessários para a requisição
//   const tipopassagem = req.body.campo_select as string;
//   const partidaDe = req.body.campo_select2 as number;
//   const chegadaA = req.body.campo_select3 as number;
//   const dataIda = new Date(req.body.data_ida);
//   //const tipopassagem = req.body.campo_select as string;
//   // Iniciar resposta padrão
//   let cr: CustomResponse = {status: "ERROR", message: "", payload: undefined,};
//   // Iniciar conexão com o banco de dados
//   try{
//     const connAttibs: ConnectionAttributes = {
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     }
//     // Comando SQL que retorna os dados requeridos do banco
//     const connection = await oracledb.getConnection(connAttibs);
//     let query =
//       "SELECT V.* FROM VOOS V " +
//       "JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO " +
//       "WHERE ";
//     const params = [];
//     if (tipopassagem === "1") {
//       // Tipo de passagem: Ida
//       query += "V.DATA_PARTIDA = :dataIda AND ";
//       params.push(dataIda);
//     } else if (tipopassagem === "2") {
//       // Tipo de passagem: Ida e volta
//       query += "V.DATA_PARTIDA = :dataIda AND ";
//       //query += "V.DATA_VOLTA = :dataVolta AND ";
//       params.push(dataIda);
//       params.push(new Date(req.body.data_volta));
//     }
//     query += "T.CIDADE_ORIGEM = :partidaDe AND ";
//     query += "T.CIDADE_DESTINO = :chegadaA";
//     params.push(partidaDe);
//     params.push(chegadaA);
//     let resultadoConsulta = await connection.execute(query, params);
//     await connection.close();
//     cr.status = "SUCCESS";
//     cr.message = "Dados obtidos";
//     cr.payload = resultadoConsulta.rows;
//   } catch (e) {
//     if (e instanceof Error) {
//       cr.message = e.message;
//       console.log(e.message);
//     } else {
//       cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//     }
//   } finally {
//     res.send(cr);
//   }
// });
exports.buscaRouter.post("/buscarVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cidadeOrigem = req.body.ori;
    console.log('cidadeOrigem =', cidadeOrigem);
    const cidadeDestino = req.body.dest;
    console.log('cidadeDestino =', cidadeDestino);
    const dataIda = new Date(req.body.dt);
    console.log('dataIda =', dataIda);
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT V.ID_VOO, CO.NOME AS CIDADE_ORIGEM, CD.NOME AS CIDADE_DESTINO, TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA, V.HORA_PARTIDA, V.HORA_CHEGADA, AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA, AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA, V.VALOR FROM VOOS V INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE WHERE CO.NOME = :cidadeOrigem AND CD.NOME = :cidadeDestino AND V.DATA_PARTIDA = TO_DATE(:dataIda, 'YYYY-MM-DD')", { cidadeOrigem, cidadeDestino, dataIda });
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
