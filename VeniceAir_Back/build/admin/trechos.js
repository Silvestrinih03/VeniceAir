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
// trechoRouter.put("/inserirTrecho", async(req,res)=>{
//   const origem = req.body.origem as string;
//   const destino = req.body.destino as string;
//   let cr: CustomResponse = {
//     status: "ERROR",
//     message: "",
//     payload: undefined,
//   };
//   let conn;
//   try{
//     conn = await oracledb.getConnection({
//       user: process.env.ORACLE_DB_USER,
//       password: process.env.ORACLE_DB_SECRET,
//       connectionString: process.env.ORACLE_DB_CONN_STR,
//     });
//     const cmdInsertTrecho = `INSERT INTO TRECHOS 
//     (ID_TRECHO, ORIGEM, DESTINO)
//     VALUES
//     (SEQ_TRECHOS.NEXTVAL, :1, :2)`
//     const dados = [origem, destino];
//     let resInsert = await conn.execute(cmdInsertTrecho, dados);
//     await conn.commit();
//     const rowsInserted = resInsert.rowsAffected
//     if(rowsInserted !== undefined &&  rowsInserted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Trecho inserido.";
//     }
//   }catch(e){
//     if(e instanceof Error){
//       cr.message = e.message;
//       console.log(e.message);
//     }else{
//       cr.message = "Erro ao conectar ao oracle. Sem detalhes";
//     }
//   } finally {
//     if(conn!== undefined){
//       await conn.close();
//     }
//     res.send(cr);  
//   }
// });
// trechoRouter.delete("/excluirTrecho", async(req,res)=>{
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
//     const cmdDeleteTrecho = `DELETE TRECHO WHERE ID_TRECHO = :1`
//     const dados = [codigo];
//     let resDelete = await connection.execute(cmdDeleteTrecho, dados);
//     await connection.commit();
//     await connection.close();
//     const rowsDeleted = resDelete.rowsAffected
//     if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Trecho excluído.";
//     }else{
//       cr.message = "Trecho não excluído. Verifique se o código informado está correto.";
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