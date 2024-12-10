const express = require('express');
const router = express.Router();
const produtoController = require('../controller/produtocontroller'); //Importa o controller de produtos

//Rota para listar todos os produtos
router.get('/produtos', produtoController.listarProdutos);

//Rota para buscar um produto por ID
router.get('/produtos/:idProduto', produtoController.listarProdutosID);

//Rota para buscar produtos por nome (prefixo)
router.get('/produtos/nome/:nomeProduto', produtoController.buscarProdutoNome);

//Rota para adicionar um novo produto 
router.post('/produtos', produtoController.adicionarProduto);

//Rota para atualizar um produto por ID
router.put('/produtos/:idProduto', produtoController.atualizarProduto);

//Rota para deletar um produto por ID
router.delete('/produtos/:idProduto', produtoController.deletarProduto);

module.exports = router;