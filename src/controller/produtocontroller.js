const db = require('../db/db'); //Módulo de conexão com o banco de dados
const Joi = require('joi'); //Biblioteca de validação de dados

//Validação com Joi
const produtoSchema = Joi.object({
    idProduto: Joi.string().required(),
    nomeProduto: Joi.string().required().max(30),
    //Nome deve ser uma string e é obrigatório
    tipo: Joi.string().required().max(30),
    descricao: Joi.string().required().max(100),
    valorUnit: Joi.string.required(),
    imagem: Joi.allow.max(200)
});

//Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM produto');
        res.json(result); //Aqui retornamos apenas os dados da consulta
    } catch (err) {
        console.error ('Erro ao buscar produtos:', err);
        res.status(500).json({ error: 'Erro interno do servidor'});
    }
};

//Buscar um produto por ID
exports.listarProdutosID = async (req, res) => {
    const {idProduto} = req.params;
    try {
        const [result] = await db.query('SELECT * FROM produto WHERE idProduto = ?', [idProduto]);
        if (result.length === 0) {
            return res.status(404).json({error: 'Produto não encontrado'});
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar produto:',err);
        res.status(500).json({ error: 'Erro interno do servidor'});
    }
};

//Adicionar um novo produto
exports.adicionarProduto = async (req, res) => {
    const {idProduto, nomeProduto, tipo, descricao, valorUnit, imagem} = req.body;

    //Validação de dados
    const {error} = produtoSchema.validate({idProduto, nomeProduto, tipo, descricao, valorUnit, imagem});
    if (error) {
       return res.status(400).json({error: error.details[0].message}); 
    }
    try {
        
    }
}