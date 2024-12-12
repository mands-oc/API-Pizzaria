const express = require('express');
const router = express.Router();
const pedidoController = require('../controller/pedidocontroller'); //Importa o controller de pedidos

//Rota para listar todos os pedidos
router.get('/pedidos', pedidoController.listarPedidos);

//Rota para buscar um pedido por ID
router.get('/pedidos/:idPedido', pedidoController.listarPedidosID);

//Rota para adicionar um novo pedido
router.post('/pedidos', pedidoController.adicionarPedido);

//Rota para atualizar um pedido por ID
router.put('/pedidos/:idPedido', pedidoController.atualizarPedido);

//Rota para deletar um pedido por ID
router.delete('/pedidos/:idPedido', pedidoController.deletarPedido);

module.exports = router;

