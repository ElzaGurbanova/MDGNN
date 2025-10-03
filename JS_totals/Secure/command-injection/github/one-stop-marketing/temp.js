import { execFile } from "child_process";
import path from "path";
import fs from "fs";

/**
 * Escape text for FFmpeg drawtext filter (NOT shell escaping).
 * See FFmpeg filter documentation for characters that must be escaped.
 */
function escapeDrawtextText(s) {
  return String(s)
    .replace(/\\/g, "\\\\")  // backslashes
    .replace(/:/g, "\\:")    // colons separate options in filters
    .replace(/'/g, "\\'");   // single quotes inside the filter string
}

/**
 * Adds text overlay to a video at a specific position and adds audio
 */
function addTextToVideo(
  inputVideoPath,
  outputVideoPath,
  text,
  x,
  y,
  fontSize = 50,
  fontColor = "white",
  fontFile = null,
  audioFile = null
) {
  const args = [];

  // Inputs
  args.push("-i", inputVideoPath);
  const hasAudio = audioFile && fs.existsSync(audioFile);
  if (hasAudio) args.push("-i", audioFile);

  // Filter string
  const escapedText = escapeDrawtextText(text);
  let drawOpts = `text='${escapedText}':x=${x}:y=${y}:fontsize=${fontSize}:fontcolor=${fontColor}`;
  if (fontFile && fs.existsSync(fontFile)) {
    drawOpts += `:fontfile='${fontFile}'`;
  }

  if (hasAudio) {
    // Apply drawtext to video stream 0, use audio stream 1
    const filter = `[0:v]drawtext=${drawOpts}[v]`;
    args.push("-filter_complex", filter, "-map", "[v]", "-map", "1:a", "-shortest");
  } else {
    args.push("-vf", `drawtext=${drawOpts}`, "-codec:a", "copy");
  }

  // Output
  args.push(outputVideoPath);

  return new Promise((resolve, reject) => {
    console.log(`Executing: ffmpeg ${args.join(" ")}`);
    execFile("ffmpeg", args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) console.log(`FFmpeg stderr: ${stderr}`);
      console.log(`Video processed successfully: ${outputVideoPath}`);
      resolve(outputVideoPath);
    });
  });
}

// Example usage
async function main() {
  try {
    const result = await addTextToVideo(
      "./input-video.mp4",
      "./output-video.mp4",
      "this is social media campaign app, designed to run your full social media campaign",
      50,
      100,
      36,
      "white",
      null,
      "./background-music.mp3"
    );
    console.log(`Success! Output saved to: ${result}`);
  } catch (error) {
    console.error("Failed to process video:", error);
  }
}

main();

