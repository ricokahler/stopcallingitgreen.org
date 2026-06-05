import { defineCollection, z } from "astro:content";

const chapters = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    slug: z.string(),
    order: z.number(),
    chapterLabel: z.string(),
    description: z.string(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url()
        })
      )
      .default([])
  })
});

export const collections = { chapters };
