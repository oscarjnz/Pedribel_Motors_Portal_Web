export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/motos") {
      const motos = [
        { id: 1, marca: "Honda", modelo: "CBR 500", precio: 8000, descripcion: "Moto deportiva de media cilindrada." },
        { id: 2, marca: "Yamaha", modelo: "MT-07", precio: 7500, descripcion: "Estilo naked con gran versatilidad." }
      ];

      return new Response(JSON.stringify(motos), {
        headers: { "content-type": "application/json; charset=utf-8" }
      });
    }

    return new Response("Ruta no encontrada", { status: 404 });
  }
};
