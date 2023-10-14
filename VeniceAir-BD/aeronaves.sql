-- PARTE AERONAVES

-- Criando a SEQUENCIA para o ID das AERONAVES
CREATE SEQUENCE SEQ_AERONAVES START WITH 1 INCREMENT BY 1;

-- Criando a tabela de AERONAVES
CREATE TABLE AERONAVES (
    ID_AERONAVE integer PRIMARY KEY NOT NULL,
    FABRICANTE varchar2(20) NOT NULL,
    MODELO varchar2(10) NOT NULL,
    ANOFAB integer NOT NULL,
    NUM_ASSENTOS integer NOT NULL
);

-- select