-- PARTE VOOS

-- Criando a SEQUENCIA para o ID dos VOOS
CREATE SEQUENCE SEQ_VOOS START WITH 1 INCREMENT BY 1;

-- Criando a tabela de VOOS
CREATE TABLE VOOS (
    ID_VOO integer PRIMARY KEY NOT NULL,
    VOO varchar2(5) NOT NULL,
    ORIGEM varchar2(20) NOT NULL,
    DESTINO varchar2(20) NOT NULL,
    DIA date NOT NULL,
    HORARIO number(4) NOT NULL,
    VALOR number(*,2) NOT NULL
);

-- select
