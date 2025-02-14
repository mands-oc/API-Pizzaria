const express = require('express');
const router = express.Router();
const itempedidoController = require('../controller/itempedidocontroller');

router.get('/itempedido', itempedidoController.listarItempedido);

router.get('/itempedido/:idItem', itempedidoController.listarItempedidoID);

router.post('/itempedido', itempedidoController.adicionarItempedido);

router.put('/itempedido/:idItem', itempedidoController.atualizarItempedido);

router.delete('/itempedido/:idItem', itempedidoController.deletarItempedido);

module.exports = router;