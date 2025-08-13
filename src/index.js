export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/motos") {
      // Consultar todas las motos
      const { results } = await env.DB.prepare("SELECT * FROM motos").all();

      return new Response(JSON.stringify(results), {
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    return new Response("Ruta no encontrada", { status: 404 });
  }
};
