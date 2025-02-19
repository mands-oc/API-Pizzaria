const db = require('../db/db'); //Módulo de conexão com o banco de dados
const Joi = require('joi');//Biblioteca de validação de dados

//Validação com Joi
const pedidoSchema = Joi.object({
    dataPedido: Joi.date().required(),
    qtdeItens: Joi.string().min(1).required(),
    formaPagto: Joi.string().required().max(15),
    valorTotal: Joi.string().required(),
    observacao: Joi.string().required().max(50),
    cpf: Joi.string().length(11).required(),
    //CPF deve ser uma string de exatamente 11 caracteres
    idEntregador: Joi.string().required(),
});

//Listar todos os pedidos
exports.listarPedidos = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM pedido')
        res.json(result);
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

//Buscar um pedido por ID
exports.listarPedidosID = async (req, res) => {
    const { idPedido } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [idPedido]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

//Adicionar um novo pedido
exports.adicionarPedido = async (req, res) => {
    const { dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador } = req.body;

    //Validação de dados 
    const { error } = pedidoSchema.validate({ dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const novoPedido = { dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador };
        await db.query('INSERT INTO pedido SET ?', novoPedido)

        res.json({ message: 'Pedido adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar pedido:', err);
        res.status(500).json({ error: 'Erro ao adicionar pedido' });
    }
};

//Atualizar um pedido
exports.atualizarPedido = async (req, res) => {
    const { idPedido } = req.params;
    const { dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador } = req.body;

    //Validação de dados
    const { error } = pedidoSchema.validate({ dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        //Verifica se o pedido existe antes de atualizar
        const [result] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [idPedido]);
        if (result.length === 0) {
            return res.status(400).json({ error: 'Pedido não encontrado' })
        }
        const pedidoAtualizado = { dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador };
        await db.query('UPDATE pedido SET ? WHERE idPedido = ?', [pedidoAtualizado, idPedido]);
        res.json({ message: 'Pedido atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar pedido:', err);
        res.status(500).json({ error: ' Erro ao atualizar pedido' });
    }
};

//Deletar um pedido
exports.deletarPedido = async (req, res) => {
    const { idPedido } = req.params;
    try {
        //Verifica se o pedido existe antes de deletar
        const [result] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [idPedido]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        await db.query('DELETE FROM pedido WHERE idPedido = ?', [idPedido]);
        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar pedido:', err);
        res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
};