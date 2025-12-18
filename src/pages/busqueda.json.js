// src/pages/busqueda.json.js
import { getCollection } from 'astro:content';

export async function GET({}) {
    // Asegúrate de que 'blog' es el nombre correcto de tu colección
    const posts = await getCollection('blog');
    
    const searchList = posts.map((post) => {
        // Intentamos obtener la ruta de la imagen.
        // Si usas Astro Assets, la ruta suele estar en post.data.image.src
        // Si usas rutas directas a /public, suele ser post.data.image
        // Esta línea intenta cubrir ambos casos:
        const imagePath = post.data.image?.src || post.data.image || null;

        return {
            slug: post.slug,
            title: post.data.title,
            description: post.data.description,
            // AÑADIMOS LA IMAGEN AQUÍ:
            image: imagePath,
        };
    });

    return new Response(JSON.stringify(searchList), {
        headers: {
            'content-type': 'application/json',
        },
    });
}