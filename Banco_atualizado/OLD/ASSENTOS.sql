-- SEQUENCE ID ASSENTOS
CREATE SEQUENCE SEQ_ASSENTOS START WITH 1 INCREMENT BY 1;

-- TABLE ASSENTOS
-- STATUS [0 - LIVRE] [1 - OCUPADO] 
create table ASSENTOS(
  ID_ASSENTO INTEGER PRIMARY KEY NOT NULL,
  NUM_ASSENTO VARCHAR2(4) NOT NULL,
  STATUS_ASSENTO INTEGER NOT NULL,
  AERONAVE INTEGER NOT NULL,
  FOREIGN KEY (AERONAVE) REFERENCES AERONAVES(ID_AERONAVE)
);

-- PROCEDIMENTO CRIADO PARA CADASTRAR ASSENTOS DAS AERONAVES E DIVIDI-LOS EM FILEIRAS COM 10 ASSENTOS CADA (A1 ATÉ A10... B1 ATÉ B10...)
CREATE OR REPLACE PROCEDURE CADASTRAR_ASSENTOS (p_aeronave_id IN INTEGER)
IS
    v_letra VARCHAR2(1);
    v_numero NUMBER;
BEGIN
    -- Obtém a quantidade de assentos da aeronave
    SELECT QNT_ASSENTOS INTO v_numero FROM AERONAVES WHERE ID_AERONAVE = p_aeronave_id;

    -- Loop para inserir assentos
    FOR i IN 1..v_numero
    LOOP
        -- Calcula a letra com base no número do assento
        v_letra := CHR(ASCII('A') + TRUNC((i - 1) / 10));

        -- Insere o assento na tabela ASSENTOS
        INSERT INTO ASSENTOS (ID_ASSENTO, NUM_ASSENTO, STATUS_ASSENTO, AERONAVE)
        VALUES (SEQ_ASSENTOS.nextval, v_letra || TO_CHAR(MOD(i - 1, 10) + 1), 0, p_aeronave_id);
    END LOOP;
END CADASTRAR_ASSENTOS;

-- CHAMADA DO PROCEDIMENTO PARA CADASTRAR OS ASSENTOS DA AERONAVE
BEGIN
    CADASTRAR_ASSENTOS(ID_AERONAVE);
END;


-- -- TRIGGER 60 ASSENTOS - NÃO VOLTA A LISTAGEM QUANDO TROCA A AERONAVE
-- CREATE OR REPLACE TRIGGER TRIGGER_10_ASSENTOS_POR_FILEIRA
-- BEFORE INSERT ON ASSENTOS
-- FOR EACH ROW
-- DECLARE
--     v_letra VARCHAR2(1);
-- BEGIN
--     -- Verifica se o valor da coluna AERONAVE foi alterado
--     IF :NEW.AERONAVE <> NVL(:OLD.AERONAVE, :NEW.AERONAVE) THEN
--         -- Se sim, reinicia a sequência
--         SELECT SEQ_ASSENTOS.nextval INTO :NEW.ID_ASSENTO FROM DUAL;
--     ELSE
--         -- Se não, continua com o próximo valor da sequência
--         :NEW.ID_ASSENTO := SEQ_ASSENTOS.nextval;
--     END IF;

--     -- Calcula a letra com base na divisão do número do assento pela quantidade de assentos por fileira
--     v_letra := CHR(ASCII('A') + (TRUNC((:NEW.ID_ASSENTO - 1) / 10)));

--     -- Gera o valor para a coluna NUM_ASSENTO
--     :NEW.NUM_ASSENTO := v_letra || TO_CHAR(MOD(:NEW.ID_ASSENTO - 1, 10) + 1);
-- END;