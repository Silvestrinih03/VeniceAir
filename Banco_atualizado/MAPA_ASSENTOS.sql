-- SEQUENCE MAPA
CREATE SEQUENCE SEQ_MAPA MINVALUE 1 MAXVALUE 1000 INCREMENT BY 1;

-- TABLE MAPA
-- STATUS [0 - LIVRE] [1 - OCUPADO] 
-- BILHETE [0 - LIVRE] [1 - OCUPADO] 
CREATE TABLE MAPA_ASSENTOS (
    ID_MAPA INTEGER PRIMARY KEY,
    AERONAVE INTEGER NOT NULL,
    NUM_ASSENTO VARCHAR2(4) NOT NULL,
    STATUS INTEGER NOT NULL,
    BILHETE INTEGER NOT NULL,
    VOO INTEGER NOT NULL,
    FOREIGN KEY (AERONAVE) REFERENCES ASSENTOS(AERONAVE),
    FOREIGN KEY (NUM_ASSENTO) REFERENCES ASSENTOS(NUM_ASSENTO),
    FOREIGN KEY (STATUS) REFERENCES ASSENTOS(STATUS),
    FOREIGN KEY (VOO) REFERENCES VOOS(ID_VOO)
);

-- PROCEDIMENTO PARA GERAR MAPA DE ASSENTOS PUXANDO OS DADOS DOS ASSENTOS CADASTRADOS NA TABELA ASSENTOS
CREATE OR REPLACE PROCEDURE CADASTRAR_MAPA_ASSENTOS (
    p_aeronave_id IN INTEGER,
    p_voo_id IN INTEGER
)
IS
BEGIN
    -- Inserir assentos da aeronave no mapa de assentos para o voo especificado
    INSERT INTO MAPA_ASSENTOS (ID_MAPA, AERONAVE, NUM_ASSENTO, STATUS, BILHETE, VOO)
    SELECT
        SEQ_MAPA.nextval,
        A.AERONAVE,
        A.NUM_ASSENTO,
        A.STATUS,
        0,  -- BILHETE inicializado como 0
        p_voo_id
    FROM
        ASSENTOS A
    WHERE
        A.AERONAVE = p_aeronave_id;

    COMMIT;
END CADASTRAR_MAPA_ASSENTOS;

DECLARE
    v_aeronave_id INTEGER := <ID_AERONAVE>; -- Substitua pelo ID da aeronave desejada
    v_voo_id INTEGER := <ID_VOO>; -- Substitua pelo ID do voo desejado
BEGIN
    CADASTRAR_MAPA_ASSENTOS(v_aeronave_id, v_voo_id);
END;

-- RODAR O PROCEDIMENTO ACIMA
DECLARE
    v_aeronave_id INTEGER := <ID_AERONAVE>; -- Substitua pelo ID da aeronave desejada
    v_voo_id INTEGER := <ID_VOO>; -- Substitua pelo ID do voo desejado
BEGIN
    CADASTRAR_MAPA_ASSENTOS(v_aeronave_id, v_voo_id);
END;



-- -- CHAMADA DO PROCEDIMENTO PARA CADASTRAR O MAPA DE ACORDO COM A TABELA ASSENTOS
-- DECLARE
--     v_aeronave_id INTEGER := ID_AERONAVE;
-- BEGIN
--     FOR assento IN (
--         SELECT
--             A.NUM_ASSENTO,
--             A.STATUS,
--             M.BILHETE
--         FROM
--             ASSENTOS A
--         JOIN
--             MAPA_ASSENTOS M ON A.AERONAVE = M.AERONAVE AND A.NUM_ASSENTO = M.NUM_ASSENTO
--         WHERE
--             A.AERONAVE = v_aeronave_id
--     )
--     LOOP
--         DBMS_OUTPUT.PUT_LINE('NUM_ASSENTO: ' || assento.NUM_ASSENTO || ', STATUS: ' || assento.STATUS || ', BILHETE: ' || assento.BILHETE);
--         -- Aqui você pode realizar outras ações com as informações recuperadas, se necessário
--     END LOOP;
-- END;
