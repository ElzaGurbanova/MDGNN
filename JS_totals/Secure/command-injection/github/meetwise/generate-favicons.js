#!/usr/bin/env node

import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the public directory exists
const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Path to SVG favicon
const svgPath = path.join(publicDir, "favicon.svg");

// Define sizes for different favicon formats
const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

// Check if SVG file exists
if (!fs.existsSync(svgPath)) {
  console.error("Error: favicon.svg does not exist in the public directory!");
  process.exit(1);
}

console.log("Generating favicon files from SVG...");

// Generate PNG files for each size
sizes.forEach(({ name, size }) => {
  const outputPath = path.join(publicDir, name);

  try {
    console.log(`Generating ${name}...`);
    // Use execFileSync instead of execSync to prevent command injection
    execFileSync("svgexport", [svgPath, outputPath, `${size}:${size}`]);
    console.log(`Generated ${name}`);
  } catch (error) {
    console.error(`Error generating ${name}:`, error.message);
  }
});

console.log("Favicon generation complete!");
