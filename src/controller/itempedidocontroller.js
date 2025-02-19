const db = require('../db/db');
const joi = require('joi');

const itempedidoSchema = joi.object({
    qtde: joi.string().required(),
    valorParcial: joi.string().required(),
    idProduto: joi.string().required(),
    idPedido: joi.string().required()
});

exports.listarItempedido = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM itempedido');
        res.json(result);
    } catch (err) {
        console.error('Erro ao buscar item pedido:', err);
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
};

exports.listarItempedidoID = async (req, res) => {
    const { idItem } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM itempedido WHERE idItem = ?', [idItem]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Item pedido não encontrado' });
        }
        res.json(result[0])
    } catch (err) {
        console.error('Erro ao buscar item pedido', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

exports.adicionarItempedido = async (req, res) => {
    const { qtde, valorParcial, idProduto, idPedido } = req.body;

    const { error } = itempedidoSchema.validate({ qtde, valorParcial, idProduto, idPedido });
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }
    try {
        const novoItempedido = { qtde, valorParcial, idProduto, idPedido};
        await db.query('INSERT INTO itempedido SET ?', novoItempedido);

        res.json({ message: 'Item pedido adicionado com sucesso'});
    } catch (err) {
        console.error('Erro ao adicionar item pedido:', err);
        res.status(500).json({ error: 'Erro ao adicionar item pedido'})
    }
};

exports.atualizarItempedido = async (req, res) => {
    const { idItem } = req.params;
    const { qtde, valorParcial, idProduto, idPedido } = req.body;
    
    const { error } = itempedidoSchema.validate({ qtde, valorParcial, idProduto, idPedido });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
    
    const [result] = await db.query('SELECT * FROM itempedido WHERE idItem = ?', [idItem]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Item pedido não encontrado'});
        }
    
    const itempedidoAtualizado = {idItem, qtde, valorParcial, idProduto, idPedido};
    await db.query('UPDATE itempedido SET ? WHERE idItem = ? ', [itempedidoAtualizado, idItem]);
    res.json({message: 'Item pedido atualizado com sucesso'});
    } catch (err) {
    console.error('Erro ao atualizar item pedido:', err); 
    res.status(500).json({error: 'Erro ao atualizar'});
    }
};

exports.deletarItempedido = async (req, res) => {
    const { idItem } = req.params;
    try {
    
    const [result] = await db.query('SELECT * FROM itempedido WHERE idItem = ?', [idItem]);
    if (result.length === 0) {
        return res.status(400).json({ error: 'Item pedido não encontrado'});
    }
    await db.query('DELETE FROM itempedido WHERE idItem = ?', [idItem]);
    res.json({message: 'Item pedido deletado com sucesso'});
    } catch (err) {
        console.error('Erro ao deletar item pedido:', err);
        res.status(500).json({error: 'Erro ao deletar item pedido'});
    }
};