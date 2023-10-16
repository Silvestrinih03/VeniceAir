"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const cidades_1 = require("./cidades");
/*
import { aeronaveRouter } from './routers/aeronave';
import { aeroportoRouter } from './routers/aeroporto';
import { companhiaAereaRouter } from './routers/companhiaAerea';
import { mapaAssentoRouter } from './routers/mapaAssento';
import { metodoPagamentoRouter } from './routers/metPagamento';
import { trechoRouter } from './routers/trecho';
import { vendaRouter } from './routers/venda';
import { vooRouter } from './routers/voo';*/
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('tiny'));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(cidades_1.cidadeRouter);
/*
app.use(aeronaveRouter);
app.use(aeroportoRouter);
app.use(trechoRouter);
app.use(vooRouter);*/
const PORT = parseInt(`${process.env.PORT || 3000}`);
app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));