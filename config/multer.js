const multer = require('multer');
const path = require('path');

// Définition des types MIME d'images autorisés
const imageMimeTypes = ['image/jpeg', 'image/png'];

// Définition des extensions de fichiers autorisées
const imageFileExtensions = ['.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/plantes')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.originalname + '-' + uniqueSuffix + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    // Vérification du type de fichier (uniquement les images)
    if (!imageMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Le fichier doit être une image de type JPEG, PNG"), false);
    }

    // Vérification de l'extension du fichier
    const fileExtension = path.extname(file.originalname);
    if (!imageFileExtensions.includes(fileExtension.toLowerCase())) {
        return cb(new Error("L'extension du fichier n'est pas autorisée. Les extensions autorisées sont : " + imageFileExtensions.join(", ")), false);
    }

    // Vérification de la taille du fichier (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
        return cb(new Error("Le fichier est trop volumineux. Maximum 5 Mo autorisés."), false);
    }

    // Appelle la fonction cb(null, true) si le fichier correspond aux normes demandées
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter 
});

module.exports = upload;
