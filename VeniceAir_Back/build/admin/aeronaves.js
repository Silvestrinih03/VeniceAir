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
const express_1 = __importDefault(require("express"));
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// const app = express();
exports.aeronaveRouter = express_1.default.Router();
const port = 3000; //muda a porta se não for isso
exports.aeronaveRouter.use(express_1.default.json());
exports.aeronaveRouter.use((0, cors_1.default)());
dotenv_1.default.config();
exports.aeronaveRouter.get("/listarAeronaves", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let cr = { status: "ERROR", message: "", payload: undefined, };
    try {
        const connAttibs = {
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_SECRET,
            connectionString: process.env.ORACLE_DB_CONN_STR,
        };
        const connection = yield oracledb_1.default.getConnection(connAttibs);
        let resultadoConsulta = yield connection.execute("SELECT * FROM AERONAVES");
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
// aeronaveRouter.put("/inserirAeronaves", async(req,res)=>{
//   const fabricante = req.body.fabricante as string;
//   const modelo = req.body.modelo as string;
//   const anofab = req.body.anofab as number;
//   const qtdeAssentos = req.body.qtdeAssentos as number;
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
//     const cmdInsertAeronave = 'INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, MAPA_ASSENTOS) VALUES (SEQ_AERONAVES.NEXTVAL, :1, :2, :3, :4)';
//     const dados = [fabricante, modelo, anofab, qtdeAssentos];
//     let resInsert = await conn.execute(cmdInsertAeronave, dados);
//     await conn.commit();
//     const rowsInserted = resInsert.rowsAffected
//     if(rowsInserted !== undefined &&  rowsInserted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Aeronave inserida.";
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
// aeronaveRouter.delete("/excluirAeronave", async(req,res)=>{
//   const codigo = req.body.codigo as number;
//     let cr: CustomResponse = {
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
//     const cmdDeleteAeronave = `DELETE AERONAVES WHERE ID_AERONAVE = :1`
//     const dados = [codigo];
//     let resDelete = await connection.execute(cmdDeleteAeronave, dados);
//     await connection.commit();
//     await connection.close();
//     const rowsDeleted = resDelete.rowsAffected
//     if(rowsDeleted !== undefined &&  rowsDeleted === 1) {
//       cr.status = "SUCCESS"; 
//       cr.message = "Aeronave excluída.";
//     }else{
//       cr.message = "Aeronave não excluída. Verifique se o código informado está correto.";
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