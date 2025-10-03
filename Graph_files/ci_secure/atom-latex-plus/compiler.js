'use babel';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Emitter } from 'atom';
export default const Compiler = function Compiler() {
    this.emitter = new Emitter();
    this.pid = null;
    this.err = null;
    this.stdout = '';
    this.stderr = '';
};