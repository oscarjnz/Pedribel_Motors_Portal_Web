export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // if (url.pathname === "/api/products") {
      const { results } = await env.productos.prepare(
        "SELECT id, Marca, Modelo, Precio, Descripcion, anio, imagen_url FROM motos"
      ).all();

      // Transformar datos de la DB al formato que tu frontend espera
      const products = results.map(row => ({
        name: `${row.Marca} ${row.Modelo}`,
        category: "Motocicleta", // podrías crear una tabla de categorías después
        price: row.Precio,
        description: row.Descripcion,
        year: row.anio,
        image: `${env.pedribel_motors_url}/${row.imagen_url}` //  armamos la URL de R2
      }));

      return new Response(JSON.stringify(products), {
        headers: { "Content-Type": "application/json" },
      });
    // }

    return new Response("Not found", { status: 404 });
  },
};
