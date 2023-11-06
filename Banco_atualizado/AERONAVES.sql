-- PARTE AERONAVES

-- Criando a SEQUENCIA para o ID das AERONAVES
CREATE SEQUENCE SEQ_AERONAVES START WITH 1 INCREMENT BY 1;

-- Criando a tabela de AERONAVES
CREATE TABLE AERONAVES (
    ID_AERONAVE integer PRIMARY KEY NOT NULL,
    FABRICANTE varchar2(20) NOT NULL,
    MODELO varchar2(10) NOT NULL,
    ANOFAB integer NOT NULL,
    QNT_FILEIRAS_VERTICAL integer,
    QNT_ASSENTOS_POR_FILEIRA integer
);

-- Falta inserir mapa de assentos!!!
-- Inserts
INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'EMBRAER', 'EMBRAER195', 2013, 6, 50);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'AirBus', 'A380', 2017, 6, 50);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'Boeing', '787', 2001, 6, 50);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'Boeing', '747', 2008, 4, 50);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'EMBRAER', 'EMBRAER175', 2011, 4, 50);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'AirBus', 'A320', 2021, 4, 50);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'EMBRAER', 'EMBRAER190', 1999, 4, 50);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'AirBus', 'A330', 2017, 4, 31);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'Boeing', 'Boeing757', 2000, 4, 31);

INSERT INTO AERONAVES (ID_AERONAVE, FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES (SEQ_AERONAVES.NEXTVAL, 'Boeing', 'Boeing777', 2016, 4, 31);


-- MAPA DE ASSENTOS EXCLUÍDO
-- Atualize a coluna QNT_ASSENTOS com base em MAPA_ASSENTO
-- SELECT
--     A.ID_AERONAVE,
--     A.FABRICANTE,
--     A.MODELO,
--     A.ANOFAB,
--     (M.NUM_DE_FILEIRAS * M.ASSENTOS_POR_FILEIRA) AS QNT_ASSENTOS
-- FROM
--     AERONAVES A
-- JOIN
--     MAPA_ASSENTO M ON A.QNT_ASSENTOS = M.ID_MAPA;