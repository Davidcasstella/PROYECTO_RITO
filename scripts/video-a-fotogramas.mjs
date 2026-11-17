// Convierte un video en las dos tandas de fotogramas WebP que usa el recorrido por scroll:
//   lg: 240 fotogramas a 1280 px (escritorio)
//   sm: 120 fotogramas a 820 px  (celular)
//
// Requiere ffmpeg instalado. Uso, desde la raíz del repositorio:
//   node scripts/video-a-fotogramas.mjs originales/entrada.mp4 entrada
//
// Deja los archivos en frontend/public/frames/<nombre>/{lg,sm}/0001.webp…
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const [video, nombre = "entrada"] = process.argv.slice(2);
if (!video) {
  console.error(
    "Uso: node scripts/video-a-fotogramas.mjs <video.mp4> [nombre]",
  );
  process.exit(1);
}

const duracion = Number(
  execFileSync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    video,
  ])
    .toString()
    .trim(),
);

for (const { clave, ancho, cuantos, calidad } of [
  { clave: "lg", ancho: 1280, cuantos: 240, calidad: 62 },
  { clave: "sm", ancho: 820, cuantos: 120, calidad: 56 },
]) {
  const destino = path.join("frontend", "public", "frames", nombre, clave);
  rmSync(destino, { recursive: true, force: true });
  mkdirSync(destino, { recursive: true });
  // Fotogramas repartidos por igual a lo largo de todo el video.
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-i",
    video,
    "-vf",
    `fps=${cuantos / duracion},scale=${ancho}:-2`,
    "-frames:v",
    String(cuantos),
    "-c:v",
    "libwebp",
    "-quality",
    String(calidad),
    path.join(destino, "%04d.webp"),
  ]);
  console.log(
    `${clave}: ${readdirSync(destino).length} fotogramas en ${destino}`,
  );
}
