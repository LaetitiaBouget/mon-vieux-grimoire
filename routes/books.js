const express = require('express');
const auth = require('auth');

const router = express.Router();


const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, booksCtrl.createBook);
router.put('/:id', auth, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;