import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Type: 'content' es para archivos Markdown/MDX
  type: 'content', 
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Lemone'),
    tags: z.array(z.string()),
    
    // AQUÍ ESTÁ LA MAGIA: Definimos que 'image' es un archivo de imagen local
    image: image().optional(), 
  }),
});

export const collections = { blog };