-- Criando a tabela avaliações
create table AVALIACOES(
    ID_AVALIACAO integer not null,
    NOME varchar(51) not null,
    EMAIL varchar(51) not null,
    AVALIACAO integer not null,
    DESCRICAO varchar(1000) not null
);

-- SEQUENCE ID AVALIACOES
create sequence SEQ_AVALIACOES minvalue 1 maxvalue 1000 increment by 1;

-- TRIGGER ID AVALIACOES
create or replace trigger PREENCHER_ID_AVALIACOES before insert ON AVALIACOES FOR EACH ROW BEGIN :NEW.ID_AVALIACAO:=SEQ_AVALIACOES.nextval;END;

--INSERT
INSERT INTO AVALIACOES (NOME, EMAIL, AVALIACAO, DESCRICAO)
VALUES ('NICOLE SILVESTRINI', 'NICOLE@TESTE.COM', 5, 'ÓTIMO ATENDIMENTO E AERONAVES MUITO CONFORTÁVEIS');
