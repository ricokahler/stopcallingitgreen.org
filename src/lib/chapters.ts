export interface SourceLink {
  title: string;
  url: string;
}

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export interface ChapterMeta {
  title: string;
  shortTitle: string;
  slug: string;
  order: number;
  chapterLabel: string;
  description: string;
  sources: SourceLink[];
  headings: Heading[];
  words: number;
  minutes: number;
  Content: unknown;
}

interface ChapterModule {
  frontmatter: Omit<ChapterMeta, "Content" | "headings" | "words" | "minutes" | "sources"> & {
    sources?: SourceLink[];
  };
  default: unknown;
  getHeadings?: () => Heading[];
  file?: string;
}

const modules = import.meta.glob<ChapterModule>("../content/chapters/*.mdx", {
  eager: true
});

const rawModules = import.meta.glob<string>("../content/chapters/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default"
});

const WORDS_PER_MINUTE = 230;

function countWords(raw: string) {
  const body = raw
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[#>*_`]/g, " ");
  return body.split(/\s+/).filter((token) => /[A-Za-z0-9]/.test(token)).length;
}

export const chapters = Object.entries(modules)
  .map(([path, module]) => {
    const words = countWords(rawModules[path] ?? "");
    return {
      ...module.frontmatter,
      sources: module.frontmatter.sources ?? [],
      headings: (module.getHeadings?.() ?? []).filter((heading) => heading.depth === 2),
      words,
      minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      Content: module.default
    };
  })
  .sort((a, b) => a.order - b.order) as ChapterMeta[];

export const bookStats = {
  chapters: chapters.length,
  words: chapters.reduce((sum, chapter) => sum + chapter.words, 0),
  minutes: chapters.reduce((sum, chapter) => sum + chapter.minutes, 0),
  sources: chapters.reduce((sum, chapter) => sum + chapter.sources.length, 0)
};

export const editionLabel = "Edition 2 · October 2026";

export function chapterNumber(chapter: ChapterMeta) {
  return String(chapter.order).padStart(2, "0");
}

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
