import express from 'express';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

R2_BUCKET = 'pedribel-motors',
R2_ENDPOINT = ''

// Configuración de cliente S3 (R2)
const s3 = new S3Client({
  region: process.env.REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  },
  forcePathStyle: false,
});

// Ruta para servir imágenes desde R2
app.get('/foto/:nombre', async (req, res) => {
  const key = `x1000/${req.params.nombre}`;
  try {
    const cmd = new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key });
    const data = await s3.send(cmd);

    if (data.ContentType) res.setHeader('Content-Type', data.ContentType);
    const stream = data.Body;
    stream.pipe(res);
  } catch (err) {
    console.error('Error proxy R2 ->', err);
    res.status(404).send('Imagen no encontrada');
  }
});

// --- RUTAS DE LA API ---

// Ruta para obtener productos con filtrado y búsqueda
app.get('/api/products', async (req, res) => {
    try {
        const { category = 'all', search = '' } = req.query;
        let query = 'SELECT * FROM products WHERE 1=1';
        const queryParams = [];

        if (category && category !== 'all') {
            query += ' AND category = ?';
            queryParams.push(category);
        }

        if (search) {
            const searchTerm = `%${search.toLowerCase().trim()}%`;
            query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)';
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }
        
        const [rows] = await dbPool.query(query, queryParams);
        res.json(rows);

    } catch (error) {
        console.error('Error fetching products from DB:', error);
        res.status(500).json({ message: "Error interno del servidor al obtener productos" });
    }
});

// // Ruta principal para servir el frontend
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
