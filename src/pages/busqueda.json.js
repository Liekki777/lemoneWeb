import { getCollection } from 'astro:content';

export async function GET({}) {
    // 1. Obtenemos tus posts (ajusta 'blog' si tu colección se llama de otra forma)
    const posts = await getCollection('blog');
    
    // 2. Preparamos los datos que queremos buscar
    const searchList = posts.map((post) => ({
        slug: post.slug,
        title: post.data.title,
        description: post.data.description,
        // Agrega aquí más campos si quieres buscar por tags, fecha, etc.
    }));

    return new Response(JSON.stringify(searchList), {
        headers: {
            'content-type': 'application/json',
        },
    });
}