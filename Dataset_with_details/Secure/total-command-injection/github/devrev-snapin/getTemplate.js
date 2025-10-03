#!/usr/bin/env node

const { checkDevRevCLI } = require("./install-deps/installDevRev");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const checkRename = require("./utils");

const rename = process.argv[5];
const templateName = process.argv[3];

const mapTemplates = {
  default: {
    url: "https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/starters.zip",
    name: "1-starter",
  },
  internal_action: {
    url: "https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/internal-action.zip",
    name: "6-timer-ticket-creator",
  },
  external_actions: {
    url: "https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/external-actions.zip",
    name: "9-external-action",
  },
  external_webhooks: {
    url: "https://github.com/nimit2801/devrev-snapin-templates/releases/download/template-release/external-webhook.zip",
    name: "8-external-github-webhook",
  },
};

async function getDevRevSnapInTemplate() {
  const devrevCLICheck = checkDevRevCLI();
  if (!devrevCLICheck) {
    console.error("please run npx devrev-snapin:setup");
    return;
  }

  if (process.argv[2] === "--template") {
    if (!templateName) console.error("No template selected");

    switch (templateName) {
      case "default":
        await downloadAndExtractZip(mapTemplates.default.url, process.cwd());
        if (checkRename) renameDefault(mapTemplates.default.name, rename);
        break;
      case "internal-action":
        await downloadAndExtractZip(mapTemplates.internal_action.url, process.cwd());
        if (checkRename) renameDefault(mapTemplates.internal_action.name, rename);
        break;
      case "external-action":
        await downloadAndExtractZip(mapTemplates.external_actions.url, process.cwd());
        if (checkRename) renameDefault(mapTemplates.external_actions.name, rename);
        break;
      case "external-trigger":
        await downloadAndExtractZip(mapTemplates.external_webhooks.url, process.cwd());
        if (checkRename) renameDefault(mapTemplates.external_webhooks.name, rename);
        break;
      default:
        console.log("Invalid template name");
    }

    console.log("exists");
  }
}

function renameDefault(defaultName, newName) {
  if (!defaultName || !newName) {
    console.error("Both defaultName and rename parameters are required.");
    return;
  }
  if (!fs.existsSync(defaultName)) {
    console.error(`Source directory "${defaultName}" does not exist.`);
    return;
  }
  try {
    fs.renameSync(defaultName, newName);
    console.log(`Successfully renamed template to: ${newName}`);
  } catch (error) {
    console.error(`Error renaming template: ${error.message}`);
  }
}

async function downloadAndExtractZip(url, outputPath) {
  return new Promise((resolve, reject) => {
    axios({ method: "get", url, responseType: "stream" })
      .then((response) => {
        response.data
          .pipe(unzipper.Extract({ path: outputPath }))
          .on("close", () => {
            console.log("Download and extraction complete.");
            resolve();
          })
          .on("error", (err) => {
            console.error(`Error during extraction: ${err.message}`);
            reject(err);
          });
      })
      .catch((err) => {
        console.error(`Error during download: ${err.message}`);
        reject(err);
      });
  });
}

getDevRevSnapInTemplate();

