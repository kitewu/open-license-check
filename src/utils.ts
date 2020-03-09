import { ModuleName, WorkDir } from './index';
import { renameSync, existsSync, mkdirSync } from 'fs';
// import { join } from 'path';
import *  as path from 'path';
// tslint:disable-next-line: no-var-requires
const gutil = require('gulp-util');

export function processFiles(files: string[]) {
  if (files.length === 0) {
    gutil.log(ModuleName, gutil.colors.yellow(`No files found`));
    process.exit(0);
  }

  // move files to be checked to separate directories
  const len = process.cwd().length;
  for (let i in files) {
    const newPath = path.join(WorkDir, files[i].substr(len + 1));

    // check if parent path exist
    const parentPath = path.dirname(newPath);
    if (!existsSync(parentPath)) mkdirSync(parentPath);

    renameSync(files[i], newPath);
  }
}