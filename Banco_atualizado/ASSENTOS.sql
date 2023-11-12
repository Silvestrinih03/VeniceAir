-- SEQUENCE ID ASSENTOS
CREATE SEQUENCE SEQ_ASSENTOS START WITH 1 INCREMENT BY 1;

-- SEQUENCE NUMERO_ASSENTO (NÃO ESTÁ SENDO UTILIZADA)
CREATE SEQUENCE SEQ_NUM_ASSENTO MINVALUE 1 MAXVALUE 100 INCREMENT BY 1;

-- TRIGGER ASSENTOS
CREATE OR REPLACE TRIGGER TRIGGER_50_ASSENTOS_POR_FILEIRA
BEFORE INSERT ON ASSENTOS
FOR EACH ROW
DECLARE
    v_letra VARCHAR2(1);
BEGIN
    -- Insere o próximo valor da sequência para a coluna ID_ASSENTO
    :NEW.ID_ASSENTO := SEQ_ASSENTOS.nextval;

    -- Calcula a letra com base na divisão do número do assento pela quantidade de assentos por fileira
    v_letra := CHR(ASCII('A') + (TRUNC((:NEW.ID_ASSENTO - 1) / 50)));

    -- Gera o valor para a coluna COD_ASSENTO
    :NEW.NUM_ASSENTO := v_letra || TO_CHAR(MOD(:NEW.ID_ASSENTO - 1, 50) + 1);
END;

-- TABLE ASSENTOS
create table ASSENTOS(
  ID_ASSENTO INTEGER PRIMARY KEY NOT NULL,
  NUM_ASSENTO VARCHAR2(4) NOT NULL,
  STATUS INTEGER NOT NULL,
  AERONAVE INTEGER NOT NULL,
  FOREIGN KEY (AERONAVE) REFERENCES AERONAVES(ID_AERONAVE)
);


-- INSERT - NECESSÁRIO ALTERAR O ID DA AERONAVE DE ACORDO COM QUAL AERONAVE DESEJA INSERIR
INSERT INTO ASSENTOS(STATUS, AERONAVE) VALUES (0, 1);