import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { cidadeRouter } from './cidades';
/*
import { aeronaveRouter } from './routers/aeronave';
import { aeroportoRouter } from './routers/aeroporto';
import { companhiaAereaRouter } from './routers/companhiaAerea';
import { mapaAssentoRouter } from './routers/mapaAssento';
import { metodoPagamentoRouter } from './routers/metPagamento';
import { trechoRouter } from './routers/trecho';
import { vendaRouter } from './routers/venda';
import { vooRouter } from './routers/voo';*/

dotenv.config();

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cidadeRouter);
/*
app.use(aeronaveRouter);
app.use(aeroportoRouter);
app.use(trechoRouter);
app.use(vooRouter);*/

const PORT = parseInt(`${process.env.PORT || 3000}`);
app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));