import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const manuscriptDir = process.env.MANUSCRIPT_DIR;
const outputDir = path.join(root, "src", "content", "chapters");

if (!manuscriptDir) {
  console.error(
    "Set MANUSCRIPT_DIR to the private manuscript directory before running this optional migration."
  );
  process.exit(1);
}

const chapters = [
  {
    file: "00-introduction.md",
    slug: "introduction",
    order: 0,
    chapterLabel: "Start here",
    title: "Introduction: Stop Calling It Green",
    shortTitle: "Introduction",
    description:
      "The practical thing got branded as the ideological thing, while the ideological thing got branded as normal."
  },
  {
    file: "01-the-neutral-electron.md",
    slug: "electron-and-joe-rogan",
    order: 1,
    chapterLabel: "Chapter 1",
    title: "The Electron and Joe Rogan",
    shortTitle: "The Electron and Joe Rogan",
    description:
      "Electricity is not a culture. The light turns on, or it does not."
  },
  {
    file: "02-follow-the-money-both-ways.md",
    slug: "follow-the-money",
    order: 2,
    chapterLabel: "Chapter 2",
    title: "Follow The Money Both Ways",
    shortTitle: "Follow The Money",
    description:
      "If clean energy deserves scrutiny for incentives, oil and gas deserve the same scrutiny with interest."
  },
  {
    file: "03-the-original-energy-propaganda.md",
    slug: "energy-propaganda",
    order: 3,
    chapterLabel: "Chapter 3",
    title: "The Original Energy Propaganda",
    shortTitle: "Energy Propaganda",
    description:
      "Oil did not become normal by accident. The industry invested in common sense."
  },
  {
    file: "04-the-natural-gas-detour.md",
    slug: "natural-gas-detour",
    order: 4,
    chapterLabel: "Chapter 4",
    title: "The Natural Gas Detour",
    shortTitle: "Natural Gas",
    description:
      "Natural gas is mostly methane, and the bridge fuel story became a destination."
  },
  {
    file: "05-corn-cows-and-the-weirdest-possible-land-panic.md",
    slug: "land-panic",
    order: 5,
    chapterLabel: "Chapter 5",
    title: "Corn, Cows, And The Weirdest Possible Land Panic",
    shortTitle: "Land Panic",
    description:
      "America already makes massive land choices. Solar just has to justify itself from scratch."
  },
  {
    file: "06-the-strait-of-hormuz-is-not-freedom.md",
    slug: "hormuz",
    order: 6,
    chapterLabel: "Chapter 6",
    title: "The Strait Of Hormuz Is Not Freedom",
    shortTitle: "Hormuz",
    description:
      "A narrow waterway half a world away should not get to reach into ordinary American budgets."
  },
  {
    file: "07-yes-the-sun-goes-down.md",
    slug: "sun-goes-down",
    order: 7,
    chapterLabel: "Chapter 7",
    title: "Yes, The Sun Goes Down",
    shortTitle: "The Sun Goes Down",
    description:
      "Variability is not a gotcha. It is a design constraint for a system."
  },
  {
    file: "08-the-builder-ethos.md",
    slug: "builder-ethos",
    order: 8,
    chapterLabel: "Chapter 8",
    title: "The Builder Ethos",
    shortTitle: "Builder Ethos",
    description:
      "The future does not need to look like a climate conference. It can look like a workshop."
  },
  {
    file: "09-conclusion-stop-getting-played.md",
    slug: "conclusion",
    order: 9,
    chapterLabel: "Chapter 9",
    title: "Conclusion: Stop Getting Played",
    shortTitle: "Conclusion",
    description:
      "Vote for the wire, not the lobbyist. Become harder to fool."
  }
];

const subheads = new Map(
  Object.entries({
    "00-introduction.md": [
      ["That is the part I cannot get over.", "The Suspicious Thing"],
      ["Oil got a different deal.", "The Framing War"],
      ["If solar has subsidies, fine.", "Count Everything"],
      [
        "The United States already gets electricity",
        "The Numbers Are Already Here"
      ],
      ["Oil has a story.", "The Stories Attached To Power"],
      ["This book has an agenda", "The Door Into The Room"]
    ],
    "01-the-neutral-electron.md": [
      ["That sounds obvious, which is why", "Electricity Is Not A Culture"],
      ["The first step out is to be boring on purpose.", "Be Boring On Purpose"],
      ["Solar's role has become much more serious", "A Tool, Not A Team"],
      ["The phrase \"green energy\" hides", "The Costume Problem"],
      ["Meanwhile, fossil fuels get treated", "Normal Is Not Neutral"],
      ["One reason solar is so clarifying", "The Fuel Chain"],
      ["This is not just a Republican problem.", "More Doorways In"]
    ],
    "02-follow-the-money-both-ways.md": [
      ["Government money does attract opportunists.", "The Instinct Is Not Stupid"],
      [
        "This is where a lot of American energy skepticism quietly breaks.",
        "Older Money Looks Like Scenery"
      ],
      ["OpenSecrets reporting republished by AllSides", "Follow It To The Lobby"],
      ["This is where Joe Rogan is useful", "The Rogan Test"],
      ["If I can teach you to be suspicious", "Selective Suspicion"],
      ["The fossil fuel industry has spent decades", "The Old Machine"],
      ["That asymmetry is everywhere.", "Politics Pretending To Be Neutral"],
      ["If a wind farm has to answer", "One Standard"]
    ],
    "03-the-original-energy-propaganda.md": [
      ["The claim of this chapter is simple", "How Normal Gets Manufactured"],
      ["Climate Town's source trail points", "The Classroom Door"],
      ["If a child learns", "True Facts, Rigged Frames"],
      ["This is the part Americans need", "Propaganda Lives In The Therefore"],
      ["But a solar farm? Suddenly", "The Purity Test"],
      ["This is where reactionary idealism", "The Moral Drama"],
      ["And again, the answer is not", "Honest Energy Education"],
      ["And if you think this stopped", "The Streaming Version"],
      ["The propaganda is not always", "Common Sense With Good Lighting"]
    ],
    "04-the-natural-gas-detour.md": [
      ["America tried to quit coal", "The Word Natural"],
      ["The bridge-fuel story went something like this", "The Bridge That Stayed"],
      ["Let's state this explicitly", "Mostly Methane"],
      ["The second problem is infrastructure lock-in.", "Assets Have Politics"],
      ["The third problem is export logic.", "Exporting The Detour"],
      ["The fourth problem is language.", "The Branding Victory"],
      ["Here is the fair objection:", "What Gas Actually Does"],
      ["The gas detour teaches", "Ask What The Bridge Wants"]
    ],
    "05-corn-cows-and-the-weirdest-possible-land-panic.md": [
      ["The land-use objection to solar is not always fake.", "The Fair Concern"],
      ["Start with the solar numbers.", "The Scale Check"],
      ["Now compare that with corn.", "Corn That Is Fuel"],
      ["Grazing makes the scale even stranger", "The Uses We Stop Seeing"],
      ["There is a good-faith version", "Good Faith, Bad Faith"],
      ["Solar has some unusual strengths", "What Counts As A Tradeoff"],
      ["It is tempting to say", "The Ethanol Thought Experiment"],
      ["Corn for ethanol is legitimate", "Legitimacy Is The Fight"]
    ],
    "06-the-strait-of-hormuz-is-not-freedom.md": [
      ["This is where American energy language gets slippery.", "The Slogan Problem"],
      ["Electricity made from domestic sources", "Different Dependencies"],
      ["This is why China is such an uncomfortable example.", "Read The Map"],
      ["The point is not that solar replaces", "Exposure, Not Purity"],
      ["Imagine explaining the current system", "Which One Sounds Like Freedom"],
      ["There is a fair objection here:", "The Follow-Up"],
      ["\"Energy independence\" should not mean", "What Independence Should Mean"]
    ],
    "07-yes-the-sun-goes-down.md": [
      ["The question is not whether solar varies.", "Variability Is Not New"],
      ["How much solar?", "The Real Questions"],
      ["The NREL/DOE Solar Futures work", "Build A System"],
      ["Batteries are where the cultural story", "Texas Is Already Doing It"],
      ["A gas plant has fuel costs.", "Every Tool Has A Bill"],
      ["The better skeptical question", "Serious Skepticism"],
      ["This is where the cultural frame", "Design Constraints Are Normal"],
      ["The supporting system will not be built", "The Work Under The Slogan"]
    ],
    "08-the-builder-ethos.md": [
      ["This is worth saying because", "Fewer Vibes, More Toolboxes"],
      ["Zack Nelson, the creator behind", "Electricity Can Feel Like Capability"],
      ["The phrase \"green jobs\"", "Call The Work What It Is"],
      ["This is where solar can be deeply American", "Local Power Is Practical Power"],
      [
        "There is a version of American self-reliance",
        "Self-Reliance Does Not Belong To Oil"
      ],
      ["This is why Not A Wheelchair", "The Material Answer"],
      ["A country that understood this", "Look At The Machine"],
      ["The builder ethos cuts through", "Does The Tool Give People More Capability"]
    ],
    "09-conclusion-stop-getting-played.md": [
      ["There is a patriotic version", "The Boring Dream"],
      ["The skeptical instinct is good.", "Keep The Skepticism"],
      ["This does not require a new identity.", "Become Harder To Fool"],
      ["When someone says \"green energy,\"", "The Questions To Carry"],
      ["Politically, this means voting", "Vote For The Wire"],
      ["The goal is not to make everyone", "Adults Can Handle Tradeoffs"],
      ["The United States has the land", "Build Like We Mean It"]
    ]
  })
);

function yamlString(value) {
  return JSON.stringify(value);
}

function parseSources(notes = "") {
  const lines = notes
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "));

  return lines
    .filter((line) => !/sources\/transcripts|transcript saved/i.test(line))
    .map((line) => {
      const content = line.slice(2).replace(/`/g, "");
      const url = content.match(/https?:\/\/\S+/)?.[0]?.replace(/[).,]+$/, "");
      if (!url) return null;
      const title = content
        .replace(url, "")
        .replace(/\s*:\s*$/, "")
        .replace(/\s+/g, " ")
        .trim();
      return {
        title: title || url,
        url
      };
    })
    .filter(Boolean);
}

function insertSubheads(body, file) {
  const entries = subheads.get(file) ?? [];
  if (entries.length === 0) return body;

  const used = new Set();
  const lines = body.split("\n");
  const output = [];

  for (const line of lines) {
    const match = entries.find(
      ([needle]) => !used.has(needle) && line.startsWith(needle)
    );
    if (match) {
      used.add(match[0]);
      if (output.at(-1)?.trim()) output.push("");
      output.push(`## ${match[1]}`);
      output.push("");
    }
    output.push(line);
  }

  return output.join("\n");
}

function replaceVideoBlocks(body) {
  let hasVideos = false;

  const pattern =
    /> \*\*Watch This: ([^*]+)\*\*\n>\n> <iframe[^>]*src="([^"]+)" title="([^"]+)"[^>]*><\/iframe>\n>\n> Why this matters: ([^\n]+)\n>\n> (Video|Clip|Source page): (https?:\/\/\S+)/g;

  const next = body.replace(
    pattern,
    (_match, heading, embedUrl, iframeTitle, caption, sourceLabel, sourceUrl) => {
      hasVideos = true;
      return `<VideoCard
  title={${yamlString(heading.trim())}}
  embedUrl={${yamlString(embedUrl.trim())}}
  iframeTitle={${yamlString(iframeTitle.trim())}}
  caption={${yamlString(caption.trim())}}
  sourceLabel={${yamlString(sourceLabel.trim())}}
  sourceUrl={${yamlString(sourceUrl.trim())}}
/>`;
    }
  );

  return { body: next, hasVideos };
}

function simplifyConclusion(body) {
  if (!body.includes("# Epilogue: The Shoulders Under This")) return body;

  let next = body
    .replace("# Epilogue: The Shoulders Under This", "## Epilogue: The Shoulders Under This")
    .replace("# A Note On How This Was Made", "## A Note On How This Was Made");

  const marker = "## A Note On How This Was Made";
  const index = next.indexOf(marker);
  if (index === -1) return next;

  const before = next.slice(0, index).trimEnd();
  const note = `${marker}

This book was created with heavy AI assistance and human responsibility. I used frontier-model large language models to structure arguments, refine language, organize research, and keep a large source trail readable.

The project is self-funded, free, and intentionally not a business. I used subsidized compute while it was available to make something public-interest and checkable.

The facts still have to stand on their sources. The machine helped arrange the work. It did not make the facts true.`;

  return `${before}\n\n${note}\n`;
}

function frontmatter(chapter, sources) {
  const sourceYaml =
    sources.length === 0
      ? "[]"
      : `\n${sources
          .map(
            (source) =>
              `  - title: ${yamlString(source.title)}\n    url: ${yamlString(source.url)}`
          )
          .join("\n")}`;
  const sourcesBlock =
    sources.length === 0 ? "sources: []" : `sources:${sourceYaml}`;

  return `---
title: ${yamlString(chapter.title)}
shortTitle: ${yamlString(chapter.shortTitle)}
slug: ${yamlString(chapter.slug)}
order: ${chapter.order}
chapterLabel: ${yamlString(chapter.chapterLabel)}
description: ${yamlString(chapter.description)}
${sourcesBlock}
---`;
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const chapter of chapters) {
  const sourcePath = path.join(manuscriptDir, chapter.file);
  const source = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");
  const [main, notes = ""] = source.split(/\n## Source Notes\n/);
  const sources = parseSources(notes);
  let body = main.replace(/^# .+\n+/, "").trim();

  if (chapter.file === "09-conclusion-stop-getting-played.md") {
    body = simplifyConclusion(body);
  }

  body = insertSubheads(body, chapter.file);
  const videoResult = replaceVideoBlocks(body);
  body = videoResult.body.trim();

  const imports = videoResult.hasVideos
    ? "\n\nimport VideoCard from '../../components/VideoCard.astro';\n"
    : "";

  const output = `${frontmatter(chapter, sources)}${imports}\n\n${body}\n`;
  fs.writeFileSync(path.join(outputDir, `${chapter.slug}.mdx`), output);
}

console.log(`Migrated ${chapters.length} chapters to ${path.relative(root, outputDir)}.`);
