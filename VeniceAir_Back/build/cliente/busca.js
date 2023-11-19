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
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// const app = express();
exports.buscaRouter = express_1.default.Router();
const port = 3000; //muda a porta se não for isso
exports.buscaRouter.use(express_1.default.json());
exports.buscaRouter.use((0, cors_1.default)());
dotenv_1.default.config();
// Função OK
exports.buscaRouter.post("/buscarVoo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tipopassagem = req.body.campo_select;
    const partidaDe = req.body.campo_select2;
    const chegadaA = req.body.campo_select3;
    const dataIda = new Date(req.body.data_ida);
    //const tipopassagem = req.body.campo_select as string;
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let query = "SELECT V.* FROM VOOS V " +
            "JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO " +
            "WHERE ";
        const params = [];
        if (tipopassagem === "1") {
            // Tipo de passagem: Ida
            query += "V.DATA_PARTIDA = :dataIda AND ";
            params.push(dataIda);
        }
        else if (tipopassagem === "2") {
            // Tipo de passagem: Ida e volta
            query += "V.DATA_PARTIDA = :dataIda AND ";
            //query += "V.DATA_VOLTA = :dataVolta AND ";
            params.push(dataIda);
            params.push(new Date(req.body.data_volta));
        }
        query += "T.CIDADE_ORIGEM = :partidaDe AND ";
        query += "T.CIDADE_DESTINO = :chegadaA";
        params.push(partidaDe);
        params.push(chegadaA);
        let resultadoConsulta = yield connection.execute(query, params);
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
// Função OK
// aeroportoRouter.put("/inserirAeroportos", async(req,res)=>{
//     const sigla = req.body.sigla as string;
//     const cidade = req.body.cidade as number;
//     let cr: CustomResponse = {
//       status: "ERROR",
//       message: "",
//       payload: undefined,
//     };
//     let conn;
//     try{
//       conn = await oracledb.getConnection({
//          user: process.env.ORACLE_DB_USER,
//          password: process.env.ORACLE_DB_SECRET,
//          connectionString: process.env.ORACLE_DB_CONN_STR,
//       });
//       const cmdInsertAeroporto = 'INSERT INTO AEROPORTOS(SIGLA, CIDADE) VALUES (:1, :2)';
//       const dados = [sigla, cidade];
//       let resInsert = await conn.execute(cmdInsertAeroporto, dados);
//       await conn.commit();
//       const rowsInserted = resInsert.rowsAffected;
//       if (rowsInserted !== undefined &&  rowsInserted === 1) {
//         cr.status = "SUCCESS"; 
//         cr.message = "Aeroporto inserido.";
//       }
//     }catch(e){
//       if(e instanceof Error){
//         cr.message = e.message;
//         console.log(e.message);
//       }else{
//         cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//       }
//     } finally {
//       if(conn!== undefined){
//         await conn.close();
//       }
//       res.send(cr);  
//     }
//   });
