-- SEQUENCIA ID AERONAVES
CREATE SEQUENCE SEQ_AERONAVES START WITH 1 INCREMENT BY 1;

-- TRIGGER ID AERONAVES
create or replace trigger PREENCHER_ID_AERONAVES before insert ON AERONAVES FOR EACH ROW BEGIN :NEW.ID_AERONAVE:=SEQ_AERONAVES.nextval;END;

-- Criando a tabela de AERONAVES
CREATE TABLE AERONAVES (
    ID_AERONAVE integer PRIMARY KEY NOT NULL,
    FABRICANTE varchar2(20) NOT NULL,
    MODELO varchar2(10) NOT NULL,
    ANOFAB integer NOT NULL,
    QNT_ASSENTOS integer,
);

-- Inserts após criar trigger
INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('EMBRAER', 'EMBRAER195', 2013, 6, 50);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('AirBus', 'A380', 2017, 6, 50);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('Boeing', '787', 2001, 6, 50);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('Boeing', '747', 2008, 4, 50);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('EMBRAER', 'EMBRAER175', 2011, 4, 50);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('AirBus', 'A320', 2021, 4, 50);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('EMBRAER', 'EMBRAER190', 1999, 4, 50);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('AirBus', 'A330', 2017, 4, 31);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('Boeing', 'Boeing757', 2000, 4, 31);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('Boeing', 'Boeing777', 2016, 4, 31);

INSERT INTO AERONAVES (FABRICANTE, MODELO, ANOFAB, QNT_FILEIRAS_VERTICAL, QNT_ASSENTOS_POR_FILEIRA)
VALUES ('Teste', 'Teste', 2016, 4, 31);


-- Inserts antes de criar o trigger
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