export interface SourceLink {
  title: string;
  url: string;
}

export interface ChapterMeta {
  title: string;
  shortTitle: string;
  slug: string;
  order: number;
  chapterLabel: string;
  description: string;
  sources?: SourceLink[];
  Content: unknown;
}

interface ChapterModule {
  frontmatter: Omit<ChapterMeta, "Content">;
  default: unknown;
}

const modules = import.meta.glob<ChapterModule>("../content/chapters/*.mdx", {
  eager: true
});

export const chapters = Object.values(modules)
  .map((module) => ({
    ...module.frontmatter,
    sources: module.frontmatter.sources ?? [],
    Content: module.default
  }))
  .sort((a, b) => a.order - b.order) as ChapterMeta[];

export function getChapterIndex(slug: string) {
  return chapters.findIndex((chapter) => chapter.slug === slug);
}

export function getAdjacentChapters(slug: string) {
  const index = getChapterIndex(slug);
  return {
    previous: index > 0 ? chapters[index - 1] : null,
    next: index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null
  };
}
