export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/x1000") {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.catalogo_db.prepare(
        "SELECT * FROM Productos WHERE Marca = ?"
      )
        .bind("X1000")
        .run();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      "Call /api/beverages to see everyone who works at X1000"
    );
  },
};

