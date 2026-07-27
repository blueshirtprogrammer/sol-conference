import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../website/index.html", import.meta.url), "utf8");
const required = [
  "Turn any room into a",
  "Sol Link",
  "Sol Fabric",
  "Sol Room",
  "Sol Work",
  "Sol Presence",
  "Routing matrix",
  "Raspberry Pi",
  "Sell the room",
  "Do not replace difficult local audio/device work"
];

for (const phrase of required) {
  if (!html.includes(phrase)) throw new Error(`Missing required site phrase: ${phrase}`);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) throw new Error(`Duplicate IDs: ${[...new Set(duplicates)].join(", ")}`);

if (!html.includes("SpeechSynthesisUtterance")) throw new Error("Local spoken pitch is missing");
if (!html.includes("data-scene")) throw new Error("Interactive room scenes are missing");
if (!html.includes("data-case")) throw new Error("Interactive use-case switching is missing");

console.log(`Validated Sol Room website with ${ids.length} unique IDs and ${required.length} canonical phrases.`);
