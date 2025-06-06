const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/multer-config');
const imagesCtrl = require('../controllers/upload')
const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, upload, imagesCtrl.uploadImage, booksCtrl.createBook);
router.get('/bestrating', booksCtrl.bestRatingBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, upload, imagesCtrl.uploadImage, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.ratingBook);


module.exports = router;