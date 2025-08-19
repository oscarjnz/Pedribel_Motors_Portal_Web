import { Router } from 'itty-router';
import { json } from 'itty-router/json';

// Crea un router
const router = Router();

// ---------------------------
// Ruta: /api/products
// ---------------------------
router.get('/api/products', async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || 'all';
        const search = searchParams.get('search') || '';

        let query = 'SELECT * FROM products WHERE 1=1';
        const queryParams = [];

        if (category !== 'all') {
            query += ' AND category = ?';
            queryParams.push(category);
        }

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }
        
        const { results } = await request.env.DB.prepare(query)
            .bind(...queryParams)
            .all();
        
        return json(results);

    } catch (error) {
        console.error('Error fetching products from D1:', error);
        return json({ message: "Error interno del servidor al obtener productos" }, { status: 500 });
    }
});

// ---------------------------
// Ruta: /api/contact
// ---------------------------
router.post('/api/contact', async (request) => {
    // Lógica para enviar emails con MailChannels o similar
    return json({ message: '¡Mensaje enviado con éxito!' });
});

// ---------------------------
// Ruta para servir fotos desde R2
// ---------------------------
router.get('/foto/:nombre', async (request) => {
  try {
    const { nombre } = request.params; // nombre de la foto, ej: honda_cbr500.jpg
    const foto = await request.env.catalogo_db.get(`x1000/${nombre}`);

    if (!foto) return new Response("Imagen no encontrada", { status: 404 });

    return new Response(foto.body, {
      headers: { "content-type": foto.httpMetadata.contentType }
    });
  } catch (error) {
    console.error('Error al obtener foto:', error);
    return new Response("Error interno al obtener la foto", { status: 500 });
  }
});

