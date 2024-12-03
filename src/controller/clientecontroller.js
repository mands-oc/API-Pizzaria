const db = require('../db/db'); //Módulo de conexão com o banco de dados
const Joi = require('joi'); //Biblioteca de validação de dados
const bcrypt = require('bcrypt'); //Para encriptação de senhas

//Validação com Joi
const clienteSchema = Joi.object({
    cpf: Joi.string().length(11).required(),
    //CPF deve ser uma string de exatamente 11 caracteres
    nome: Joi.string().required().max(50),
    //Nome deve ser uma string e é obrigatório
    endereco: Joi.string().required().max(80),
    //Endereço deve ser uma string e é obrigatório
    bairro: Joi.string().required().max(30),
    //Bairro deve ser uma string e é obrigatório
    cidade: Joi.string().required().max(30),
    //Cidade deve ser uma string e é obrigatório
    cep: Joi.string().required(),
    //CEP deve ser uma string e é obrigatório
    telefone: Joi.string().required(),
    //Telefone deve ser uma string e é obrigatório
    email: Joi.string().email().required().max(50),
    //Email deve ser válido e é obrigatório
    senha: Joi.string().min(6).required().max(300)
    //Senha deve ter no mínimo 6 caracteres e é obrigatória
});

//Listar todos os clientes
exports.listarClientes = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM cliente');
        res.json(result); //Aqui retornamos apenas os dados da consulta
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

//Buscar um cliente por CPF
exports.listarClientesCpf = async (req, res) => {
    const { cpf } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

//Adicionar um novo cliente
exports.adicionarCliente = async (req, res) => {
    const { cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha } = req.body;

    //Validação de dados 
    const { error } = clienteSchema.validate({ cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        //Criptografando a senha
        const hash = await bcrypt.hash(senha, 10);

        const novoCliente = { cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha: hash };
        await db.query('INSERT INTO cliente SET ?', novoCliente)

        res.json({ message: 'Cliente adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(500).json({ error: 'Erro ao adicionar cliente' });
    }
};