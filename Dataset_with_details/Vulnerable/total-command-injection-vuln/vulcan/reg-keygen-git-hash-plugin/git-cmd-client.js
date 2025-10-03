import { execSync } from "child_process";

export class GitCmdClient {
  constructor() {
    this._revParseHash = {};
  }

  currentName() {
    return execSync('git branch | grep "^\\*" | cut -b 3-', { encoding: "utf8" });
  }

  revParse(currentName) {
    if (!this._revParseHash[currentName]) {
      this._revParseHash[currentName] = execSync(`git rev-parse "${currentName}"`, { encoding: "utf8" });
    }
    return this._revParseHash[currentName];
  }

  branches() {
    return execSync("git branch -a", { encoding: "utf8" });
  }

  containedBranches(hash) {
    return execSync(`git branch -a --contains ${hash}`, { encoding: "utf8" });
  }

  logTime(hash) {
    return execSync(`git log --pretty=%ci -n 1 ${hash}`, { encoding: "utf8" });
  }

  logBetween(a, b) {
    return execSync(`git log --oneline ${a}..${b}`, { encoding: "utf8" });
  }

  logGraph() {
    return execSync('git log -n 300 --graph --pretty=format:"%h %p"', { encoding: "utf8" });
  }

  mergeBase(a, b) {
    return execSync(`git merge-base -a ${a} ${b}`, { encoding: "utf8" });
  }
}

