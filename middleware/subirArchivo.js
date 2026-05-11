import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const crearUpload = (carpeta = 'comprobantes', fieldName = 'file') => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./public/uploads/${carpeta}/`);
        },
        filename: function (req, file, cb) {
            cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
        }
    });

    const upload = multer({ 
        storage,
        limits: { fileSize: 20000000 },
        fileFilter: (req, file, cb) => {
            const filetypes = /jpeg|jpg|png|pdf/;
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(
                path.extname(file.originalname).toLowerCase()
            );

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb(new Error('Archivo no válido. Solo imágenes o PDF.'));
        }
    });

    return upload.single(fieldName);
};

export default crearUpload;
