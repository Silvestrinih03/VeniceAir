import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { cidadeRouter } from './admin/cidades';
import { aeronaveRouter } from './admin/aeronaves';
import { aeroportoRouter } from './admin/aeroportos';
import { trechoRouter } from './admin/trechos';
import { vooRouter } from './admin/voos';
import { avaliacaoRouter } from './cliente/avaliacao';
import { buscaRouter } from './cliente/busca';
import { mapaRouter } from './admin/mapa';
import { passagemRouter } from './cliente/passagem';
import { assentoRouter } from './cliente/assento';



dotenv.config();

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cidadeRouter);
app.use(aeronaveRouter);
app.use(aeroportoRouter);
app.use(trechoRouter);
app.use(vooRouter);
app.use(avaliacaoRouter);
app.use(buscaRouter);
app.use(mapaRouter);
app.use(passagemRouter);
app.use(assentoRouter);


const PORT = parseInt(`${process.env.PORT || 3000}`);
app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));