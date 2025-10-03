"use babel";

import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { Emitter } from "atom";

export default class Compiler {
  constructor() {
    this.emitter = new Emitter();
    this.pid = null;
    this.err = null;
    this.stdout = '';
    this.stderr = '';
  }

  onDidCleanSuccess(callback) {
    this.emitter.on("did-clean-success", callback);
  }

  onDidCompileSuccess(callback) {
    this.emitter.on("did-compile-success", callback);
  }

  onDidCompileError(callback) {
    this.emitter.on("did-compile-error", callback);
  }

  destroy() {
    this.emitter.dispose();
  }

  latex_build(cmd, options, project, userData) {
    const args = this.build_args(project); // array now
    const child = execFile(cmd, args, options, (err, stdout, stderr) => {
      this.err = err;
      this.stdout = stdout;
      this.stderr = stderr;
      if (err) {
        this.emitter.emit("did-compile-error", userData);
      } else {
        this.emitter.emit("did-compile-success", userData);
      }
    });
    this.pid = child && child.pid;
  }

  latex_clean(cmd, options, project) {
    const args = this.clean_args(project); // array now
    const child = execFile(cmd, args, options, (err, stdout, stderr) => {
      this.err = err;
      this.stdout = stdout;
      this.stderr = stderr;
      this.emitter.emit("did-clean-success");
    });
    this.pid = child && child.pid;
  }

  build_args(project) {
    const args = [];
    // split common/default options into tokens
    const latexmk_common = ["-interaction=nonstopmode", "-f", "-cd", "-file-line-error", "-synctex=1"];
    const latexmk_defaults = ["-bibtex", "-pdf", "-shell-escape"]; // keep existing default

    args.push(...latexmk_common);

    if (atom.config.get("latex-plus.advancedEnabled")) {
      // Filter out unwanted options.
      let latexmk_options = project.latexmkOptions || "";
      const unwanted = ["-cd-", "-f-", "-h", "-help", "--help", "-xelatex", "-lualatex"];
      for (const u of unwanted) {
        latexmk_options = latexmk_options.replace(new RegExp(u, "g"), "");
      }
      // Split remaining options on whitespace
      args.push(...latexmk_options.trim().split(/\s+/).filter(Boolean));
    } else {
      args.push(...latexmk_defaults);
    }

    if (project.texProgram && project.texProgram !== "pdflatex") {
      args.push(project.texProgram);
    }

    if (project.texOutput) args.push(`-outdir=${project.texOutput}`);
    if (project.texRoot) args.push(project.texRoot);

    return args;
  }

  clean_args(project) {
    const args = [];
    args.push("-C", "-cd");
    if (project.texOutput) args.push(`-outdir=${project.texOutput}`);
    if (project.texRoot) args.push(project.texRoot);
    return args;
  }

  kill(pid) {
    if (!this.pid) {
      console.log("No pid to kill.");
    } else {
      try {
        process.kill(this.pid, "SIGINT");
      } catch (e) {
        if (e.code === "ESRCH") {
          throw new Error(`Process ${this.pid} has already been killed.`);
        } else {
          throw (e);
        }
      }
    }
  }
}

