-- Criando a SEQUENCIA para o ID dos VOOS
CREATE SEQUENCE SEQ_VOOS START WITH 1 INCREMENT BY 1;

-- Criando a tabela de VOOS
CREATE TABLE VOOS (
    ID_VOO integer PRIMARY KEY NOT NULL,
    TRECHO integer,
    DATA_PARTIDA date NOT NULL,
    HORA_PARTIDA varchar2(40) NOT NULL,
    HORA_CHEGADA varchar2(40) NOT NULL,
    AEROPORTO_PARTIDA integer,
    AEROPORTO_CHEGADA integer,
    VALOR number(*,2) NOT NULL,
    FOREIGN KEY (TRECHO) REFERENCES TRECHOS(ID_TRECHO),
    FOREIGN KEY (AEROPORTO_PARTIDA) REFERENCES AEROPORTOS(ID_AEROPORTO),
    FOREIGN KEY (AEROPORTO_CHEGADA) REFERENCES AEROPORTOS(ID_AEROPORTO)
);

-- Imprimir dados completos ao invés do ID
SELECT V.ID_VOO,
       CO.NOME AS CIDADE_ORIGEM,
       CD.NOME AS CIDADE_DESTINO,
       TO_CHAR(V.DATA_PARTIDA, 'DD/MM/YYYY') AS DATA_PARTIDA,
       V.HORA_PARTIDA,
       V.HORA_CHEGADA,
       AP_PARTIDA.SIGLA AS AEROPORTO_PARTIDA,
       AP_CHEGADA.SIGLA AS AEROPORTO_CHEGADA,
       V.VALOR
FROM VOOS V
INNER JOIN TRECHOS T ON V.TRECHO = T.ID_TRECHO
INNER JOIN AEROPORTOS AP_PARTIDA ON V.AEROPORTO_PARTIDA = AP_PARTIDA.ID_AEROPORTO
INNER JOIN AEROPORTOS AP_CHEGADA ON V.AEROPORTO_CHEGADA = AP_CHEGADA.ID_AEROPORTO
INNER JOIN CIDADES CO ON T.CIDADE_ORIGEM = CO.ID_CIDADE
INNER JOIN CIDADES CD ON T.CIDADE_DESTINO = CD.ID_CIDADE;

-- Inserts
INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 2, '24/11/2023', '13:00 (Brásilia)', '14:45 (Campinas)', 7, 1, 850.00);
INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 2, '24/11/2023', '19:00 (Brásilia)', '20:45 (Campinas)', 7, 1, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 2, '24/11/2023', '07:00 (Brásilia)', '08:45 (Campinas)', 7, 1, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 6, '02/12/2023', '15:30 (São Paulo)', '16:35 (Curitiba)', 1, 2, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 6, '02/12/2023', '20:50 (São Paulo)', '21:55 (Curitiba)', 1, 2, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 6, '02/12/2023', '06:50 (São Paulo)', '07:55 (Curitiba)', 1, 2, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 3, '22/12/2023', '05:00 (Salvador)', '20:15 (Porto Alegre)', 4, 9, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 3, '22/12/2023', '21:00 (Salvador)', '00:15 (Porto Alegre)', 4, 9, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 3, '22/12/2023', '14:00 (Salvador)', '17:15 (Porto Alegre)', 4, 9, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 9, '14/12/2023', '09:45 (Nova Iorque)', '21:30 (São Paulo)', 14, 1, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 9, '14/12/2023', '12:30 (Nova Iorque)', '00:10 (São Paulo)', 14, 1, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 9, '14/12/2023', '20:00 (Nova Iorque)', '07:40 (São Paulo)', 14, 1, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 4, '16/12/2023', '19:20 (Rio de Janeiro)', '20:55 (Florianópolis)', 3, 8, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 4, '16/12/2023', '11:00 (Rio de Janeiro)', '12:35 (Florianópolis)', 3, 8, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 4, '16/12/2023', '15:00 (Rio de Janeiro)', '16:35 (Florianópolis)', 3, 8, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 1, '07/12/2023', '10:00 (São Paulo)', '11:15 (Belo Horizonte)', 1, 6, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 1, '07/12/2023', '20:00 (São Paulo)', '21:15 (Belo Horizonte)', 1, 6, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 1, '07/12/2023', '05:00 (São Paulo)', '06:15 (Belo Horizonte)', 1, 6, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 7, '23/12/2023', '19:55 (São Paulo)', '21:00 (Rio de Janeiro)', 1, 3, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 7, '23/12/2023', '08:00 (São Paulo)', '09:05 (Rio de Janeiro)', 1, 3, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 7, '23/12/2023', '14:00 (São Paulo)', '15:05 (Rio de Janeiro)', 1, 3, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 5, '20/12/2023', '04:00 (Recife)', '07:20 (São Paulo)', 10, 1, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 5, '20/12/2023', '21:00 (Recife)', '00:20 (São Paulo)', 10, 1, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 5, '20/12/2023', '15:15 (Recife)', '18:35 (São Paulo)', 10, 1, 850.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 8, '09/01/2023', '23:20 (São Paulo)', '13:45 (Londres)', 1, 16, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 8, '09/01/2023', '01:50 (São Paulo)', '16:15 (Londres)', 1, 16, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 8, '09/01/2023', '11:00 (São Paulo)', '01:25 (Londres)', 1, 16, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 10, '18/12/2023', '15:20 (Roma)', '17:20 (Frankfurt)', 12, 18, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 10, '18/12/2023', '04:30 (Roma)', '06:30 (Frankfurt)', 12, 18, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 10, '18/12/2023', '21:00 (Roma)', '23:00 (Frankfurt)', 12, 18, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 11, '10/12/2023', '11:00 (Nova Iorque)', '17:10 (Honolulu)', 14, 20, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 11, '10/12/2023', '18:00 (Nova Iorque)', '00:10 (Honolulu)', 14, 20, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 11, '10/12/2023', '00:30 (Nova Iorque)', '06:40 (Honolulu)', 14, 20, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 12, '22/12/2023', '13:45 (Lisboa)', '19:15 (Cancun)', 17, 19, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 12, '22/12/2023', '23:00 (Lisboa)', '04:30 (Cancun)', 17, 19, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 13, '14/12/2023', '20:10 (Madri)', '22:15 (Paris)', 15, 13, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 13, '14/12/2023', '21:00 (Madri)', '23:05 (Paris)', 15, 13, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 15, '21/12/2023', '01:00 (São Paulo)', '09:00 (Toronto)', 1, 11, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 15, '21/12/2023', '23:00 (São Paulo)', '07:00 (Toronto)', 1, 11, 2000.00);

INSERT INTO VOOS (ID_VOO, TRECHO, DATA_PARTIDA, HORA_PARTIDA, HORA_CHEGADA, AEROPORTO_PARTIDA, AEROPORTO_CHEGADA, VALOR)
VALUES (SEQ_VOOS.NEXTVAL, 15, '21/12/2023', '10:00 (São Paulo)', '18:00 (Toronto)', 1, 11, 2000.00);