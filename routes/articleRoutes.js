const express = require ('express') ; // 1. load the Express framework module
const router= express.Router();
const articleController = require('../controllers/articlecontrollers')

router.get('/', articleController.getAllArticles ) ;
router.get('/:id', articleController.getArticleById ) ;
router.post('/', articleController.createArticle ) ;
router.put('/:id', articleController.updateArticle ) ;
router.delete('/:id', articleController.deleteArticle ) ;
module.exports = router ;