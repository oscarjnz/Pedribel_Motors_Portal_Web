import { Router } from 'itty-router';
import { json } from 'itty-router/json';

// Crea un router
const router = Router();

// Ruta para obtener productos
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
        
        // Ejecuta la consulta usando D1
        const { results } = await request.env.DB.prepare(query)
            .bind(...queryParams)
            .all();
        
        return json(results);

    } catch (error) {
        console.error('Error fetching products from D1:', error);
        return json({ message: "Error interno del servidor al obtener productos" }, { status: 500 });
    }
});




// Ruta para manejar el formulario de contacto
router.post('/api/contact', async (request) => {
    // Aquí puedes integrar un servicio de email como SendGrid o usar la API de MailChannels
    // para enviar el email, ya que nodemailer no es compatible con Cloudflare Workers.
    // Cloudflare MailChannels es la opción más sencilla.
    // ...
    // Placeholder para la lógica de contacto
    return json({ message: '¡Mensaje enviado con éxito!' });
});


// Asigna el router al evento fetch
export default {
    fetch: router.handle,
};