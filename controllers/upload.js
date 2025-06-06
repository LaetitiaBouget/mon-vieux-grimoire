const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = (path.join(__dirname,'../images'));

exports.uploadImage = async (req, res,  next) => {
const isCreating = req.method ==='POST';

    //If the user don't modify the image, then go to the next middleware
    if (!req.file) {
        if (isCreating) {
            return res.status(400).json({ message: "Une image est requise." })
        }
        return next();
    }
    
    try {
        fs.access(imagesDir, (error) => {
            if (error) {
                fs.mkdirSync(imagesDir);
            }
        });
        const { buffer, originalname } = req.file;
        const name = originalname.split(' ').join('_').replace(/\.[^/.]+$/, '');
        const ref = `${name}-${Date.now()}.webp`;
        await sharp(buffer)
            .webp({ quality: 20 })
            .resize(null, 600)
            .toFile(path.join(imagesDir,ref));

        req.fileName = ref;

        next();

    } catch (error) {
        res.status(500).json({ error })
    }
}

