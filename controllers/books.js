const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({ 
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.fileName}`
     });

     book.save()
        .then(() => {res.status(201).json({ message: 'Livre enregistré ! '})})
        .catch(error => res.status(400).json({ error }));
};


exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(201).json(book))
        .catch(error => res.status(404).json({ error }));
}

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.fileName}`
    } :  { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (book.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Non-authorisé' });
        }

        //If new image, delete old one
        if (req.file && book.imageUrl) {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Erreur suppression ancienne image' });
                }

                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                    .catch(error => res.status(401).json({ error }));
            });
        } else {

            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                .catch(error => res.status(401).json({ error }));
        }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id:req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({  message:'Non-authorisé'})
            } else  {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({ message:'Livre supprimé !' })})
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => { res.status(500).json({ error })});

};

exports.ratingBook = (req, res, next) => {

    const ratingObject = { 
        userId: req.body.userId,
        grade: req.body.rating
    }

    const userRating = req.body.rating;

    Book.findOne({_id:req.params.id})
        .then(book => {
            if(!book) {
                return res.status(401).json({  message:'Livre non trouvé'})
            }

            if (book.ratings.some( rating => rating.userId === req.auth.userId)) {
                return res.status(400).json({  message:'Vous avez déjà noté ce livre'})
            } 

            if (userRating < 0 || userRating > 5) {
                return res.status(400).json({ message: 'Note non valide'})
            }

            book.ratings.push(ratingObject)

            let sumRatings = 0;
            let nbOfRatings = book.ratings.length;
            book.ratings.forEach(rating => {
                sumRatings += rating.grade;
            })
            
            book.averageRating = Math.round(sumRatings / nbOfRatings);
            
            book.save()
                .then(() => {res.status(201).json(book)})
                .catch(error => res.status(400).json({ error }));
        })       
}

exports.bestRatingBook = (req, res, next) => {
    Book.find()
        .then( books => {
            const bestRatedBooks = books.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);
            res.status(200).json(bestRatedBooks);
        })
        .catch (error => res.status(400).json({ error }));
};