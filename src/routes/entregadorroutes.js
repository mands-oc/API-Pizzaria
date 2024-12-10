const express = require('express');
const router = express.Router();
const entregadorController = require('../controller/entregadorcontroller'); //Importa o controller de entregador

//Rota para listar todos os entregadores
router.get('/entregador', entregadorController.listarEntregador);

//Rota para buscar um entregador por ID
router.get('/entregador/:idEntregador', entregadorController.listarEntregadorID);

//Rota para adicionar um novo entregador
router.post('/entregador', entregadorController.adicionarEntregador);

//Rota para atualizar um entregador por ID
router.put('/entregador/:idEntregador', entregadorController.atualizarEntregador);

//Rota ´para deletar um entregador por ID
router.delete('/entregador/:idEntregador', entregadorController.deletarEntregador);

module.exports = router;

