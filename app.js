const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise'); // Importa mysql2 con promesas
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting para proteger contra ataques de fuerza bruta y spam
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

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

// Ruta para manejar el formulario de contacto (sin cambios, ya que está bien)
app.post('/api/contact', async (req, res) => {
    // ... (El código de la ruta de contacto se mantiene igual)
});

// Ruta principal para servir el frontend (sin cambios, ya que está bien)
app.get('*', (req, res) => {
    // ... (El código de la ruta principal se mantiene igual)
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
