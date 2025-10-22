#!/usr/bin/env node

/**
 * Node.js version of the Python directory structure generator
 * Features:
 *  - Lists all folders and files in tree format
 *  - Lets user select folder or "whole" project
 *  - Optionally includes all file contents
 *  - Skips node_modules, .git, dist, build, etc.
 */

import fs from "fs";
import path from "path";
import readline from "readline";

const EXTENSION = ".txt";

// Create readline interface for CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

const IGNORED_DIRS = ["node_modules", ".git", "dist", "build", ".next", ".cache"];

function generateStructure(targetPath, depth = 0) {
  let structure = "";
  try {
    const items = fs.readdirSync(targetPath).sort();
    for (const item of items) {
      const itemPath = path.join(targetPath, item);
      const isDir = fs.statSync(itemPath).isDirectory();

      if (IGNORED_DIRS.includes(item)) continue;

      if (isDir) {
        structure += "│   ".repeat(depth) + "├── " + item + "/\n";
        structure += generateStructure(itemPath, depth + 1);
      } else {
        structure += "│   ".repeat(depth) + "├── " + item + "\n";
      }
    }
  } catch (err) {
    structure += "│   ".repeat(depth) + "├── [Permission Denied]\n";
  }
  return structure;
}

function showFileContents(filePath, outputStream) {
  try {
    const content = fs.readFileSync(filePath, "utf-8").trim();
    if (!content) return;

    const foldername = path.dirname(filePath).replace(/\\/g, "/");
    const filename = path.basename(filePath);

    outputStream.write(`${foldername}/${filename}\n`);
    outputStream.write("<DOCUMENT>\n");
    outputStream.write(content + "\n");
    outputStream.write("</DOCUMENT>\n\n");
  } catch (e) {
    console.error(`Error reading file ${filePath}: ${e}`);
  }
}

async function showDirectoryOptions(parentDir) {
  console.log("\nSelect a folder to generate the structure for or choose 'whole' for the entire directory:\n");

  const directories = fs
    .readdirSync(parentDir)
    .filter((d) => fs.statSync(path.join(parentDir, d)).isDirectory());

  console.log("[whole] Generate structure for the entire directory");
  directories.forEach((folder, i) => console.log(`[${i + 1}] ${folder}`));

  const choice = (await ask("\nEnter your choice: ")).trim();
  let targetPath = "";

  if (choice.toLowerCase() === "whole") {
    targetPath = parentDir;
    console.log("\nGenerating structure for the entire directory...\n");
  } else if (!isNaN(choice) && choice > 0 && choice <= directories.length) {
    targetPath = path.join(parentDir, directories[parseInt(choice) - 1]);
    console.log(`\nGenerating structure for folder: ${directories[parseInt(choice) - 1]}\n`);
  } else {
    console.log("Invalid choice. Exiting.");
    rl.close();
    return;
  }

  const structure = generateStructure(targetPath);
  console.log(structure);

  const structureFilename = (await ask("\nEnter filename to save directory structure (without extension): ")).trim() + EXTENSION;
  fs.writeFileSync(structureFilename, "Directory Structure:\n\n" + structure, "utf-8");
  console.log(`\n✅ Directory structure saved to ${structureFilename}`);

  const includeContents = (await ask("Do you want to include file contents as well? (y/n): ")).trim().toLowerCase();
  if (includeContents === "y") {
    const contentFilename = (await ask("Enter filename to save file contents (without extension): ")).trim() + EXTENSION;
    const outputStream = fs.createWriteStream(contentFilename, { flags: "w", encoding: "utf-8" });

    const processDirectory = (dirPath) => {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        if (IGNORED_DIRS.includes(file)) continue;

        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          processDirectory(filePath);
        } else if (file !== "__init__.py") {
          showFileContents(filePath, outputStream);
        }
      }
    };

    processDirectory(targetPath);
    outputStream.end();
    console.log(`\n✅ File contents saved to ${contentFilename}`);
  }

  rl.close();
}import { fileURLToPath } from "url";

// Get real filesystem path of the running script
const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);

// Start the interactive script
showDirectoryOptions(scriptDir);