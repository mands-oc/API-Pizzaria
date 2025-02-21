const db = require('../db/db'); //Módulo de conexão com o banco de dados
const Joi = require('joi'); //Biblioteca de validação de dados

//Validação com Joi
const entregadorSchema = Joi.object({
    nomeEntregador: Joi.string().required().max(50),
    //Nome deve ser uma string e é obrigatório
    cnh: Joi.string().required(),
    //CNH deve ser uma string e é obrigatório
    telefoneEntregador: Joi.string().required(),
    //Telefone deve ser uma string e é obrigatório 
});

//Listar todos os entregadores
exports.listarEntregador = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM entregador');
        res.json(result); //Aqui retornamos apenas os dados da consulta
    } catch (err) {
        console.error('Erro ao buscar entregador:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

//Buscar um entregador por ID
exports.listarEntregadorID = async (req, res) => {
    const { idEntregador } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM entregador WHERE idEntregador = ?', [idEntregador]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Entregador não encontrado' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar entregador:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

//Adicionar um novo entregador
exports.adicionarEntregador = async (req, res) => {
    const { nomeEntregador, cnh, telefoneEntregador } = req.body;

    //Validação de dados
    const { error } = entregadorSchema.validate({ nomeEntregador, cnh, telefoneEntregador });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const novoEntregador = { nomeEntregador, cnh, telefoneEntregador };
        await db.query('INSERT INTO entregador SET ?', novoEntregador)

        res.json({ message: 'Entregador adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar entregador:', err);
        res.status(500).json({ error: 'Erro ao adicionar entregador' })
    }
};

//Atualizar um entregador
exports.atualizarEntregador = async (req, res) => {
    const { idEntregador } = req.params;
    const { nomeEntregador, cnh, telefoneEntregador } = req.body;
    //Validação de dados
    const { error } = entregadorSchema.validate({ nomeEntregador, cnh, telefoneEntregador });
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    try {
        //Verifica se o entregador existe antes de atualizar
        const [result] = await db.query('SELECT * FROM entregador WHERE idEntregador = ?', [idEntregador]);
        if (result.length === 0) {
            return res.status(400).json({ error: 'Entregador não encontrado' })
        }
        const entregadorAtualizado = { telefoneEntregador };
        await db.query('UPDATE entregador SET ? WHERE idEntregador = ?', [entregadorAtualizado, idEntregador]);
        res.json({ message: 'Entregador atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar entregador:', err);
        res.status(500).json({ error: 'Erro ao atualizar entregador' });
    }
};

//Deletar um entregador 
exports.deletarEntregador = async (req, res) => {
    const { idEntregador } = req.params;
    try {
        //Verifica se o entregador existe antes de deletar 
        const [result] = await db.query('SELECT * FROM entregador WHERE idEntregador = ?', [idEntregador]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Entregador não encontrado' });
        }
        await db.query('DELETE FROM entregador WHERE idEntregador = ?', [idEntregador]);
        res.json({ message: 'Entregador deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar entregador:', err);
        res.status(500).json({ error: 'Erro ao deletar entregador' });
    }
};
