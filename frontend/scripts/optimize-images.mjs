import { mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "assets", "images");
const outputDir = path.join(root, "public", "images");

const jobs = [
  {
    name: "chapel",
    file: "chapel.webp",
    widths: [640, 960, 1280, 1920],
    avif: true,
  },
  {
    name: "celebrations",
    file: "celebrations.webp",
    widths: [640, 960, 1280, 1600],
    avif: true,
  },
  {
    name: "connect",
    file: "connect.webp",
    widths: [640, 960, 1280, 1600],
    avif: true,
  },
  {
    name: "about",
    file: "about.webp",
    widths: [640, 960, 1280, 1600],
    avif: true,
  },
  {
    name: "pastor",
    file: "pastor.webp",
    widths: [320, 640, 960, 1200],
    avif: true,
  },
  {
    name: "avatar",
    file: "avatar.jpg",
    widths: [320, 640],
    avif: true,
  },
  {
    name: "logo",
    file: "Chapel Of Praise Logo.png",
    widths: [128, 256],
    quality: 90,
  },
  {
    name: "combined-logos",
    file: "Combined Logos.png",
    widths: [241, 482],
    quality: 90,
  },
];

const kb = (bytes) => `${Math.round(bytes / 102.4) / 10} KB`;

await mkdir(outputDir, { recursive: true });

for (const job of jobs) {
  const input = path.join(sourceDir, job.file);
  const metadata = await sharp(input).metadata();

  for (const width of job.widths) {
    if (width > metadata.width) continue;

    const base = sharp(input).resize({ width, withoutEnlargement: true });
    const webpPath = path.join(outputDir, `${job.name}-${width}.webp`);
    const avifPath = path.join(outputDir, `${job.name}-${width}.avif`);

    await base
      .clone()
      .webp({ quality: job.quality ?? 78, effort: 5, smartSubsample: true })
      .toFile(webpPath);

    const outputs = [webpPath];

    if (job.avif) {
      await base
        .clone()
        .avif({ quality: 50, effort: 4 })
        .toFile(avifPath);
      outputs.push(avifPath);
    }

    for (const output of outputs) {
      const { size } = await stat(output);
      console.log(
        `${path.relative(root, output).replaceAll("\\", "/")}  ${kb(size)}`,
      );
    }
  }
}
