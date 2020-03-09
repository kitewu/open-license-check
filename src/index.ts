#!/usr/bin/env node
import { exec } from 'child_process';
import convert from 'xml-js';
import { loadConfig } from './config';
import { processFiles } from './utils';
// tslint:disable-next-line: no-var-requires
const deglob = require('deglob');
// tslint:disable-next-line: no-var-requires
const gutil = require('gulp-util');

function doCheck() {
  const command = `java -jar /rat-0.13.jar -x -d ${WorkDir}`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      gutil.log(ModuleName, gutil.colors.red(err));
      process.exit(-1);
    }
    if (stderr) {
      gutil.log(ModuleName, gutil.colors.red(stderr));
      process.exit(-1);
    }

    // Transform from xml to json
    const jsonObj = convert.xml2json(stdout.substr(stdout.indexOf("<rat-report")), { compact: true, spaces: 4 });
    const report = JSON.parse(jsonObj)["rat-report"];

    // report.resource maybe an Array or an Object
    let resources: Array<any> = [];
    if (report.resource instanceof Array) {
      resources = report.resource;
    } else {
      resources.push(report.resource);
    }

    // Classify the results
    let passed: Array<string> = [];
    let failed: Array<string> = [];
    let skipped: Array<string> = [];
    for (let i in resources) {
      const resource = resources[i];
      const approval = resource['license-approval'];
      if (resource.type._attributes.name === "binary") {
        skipped.push(resource._attributes.name);
      } else if (approval && approval._attributes && approval._attributes.name && approval._attributes.name === true) {
        passed.push(resource._attributes.name);
      } else {
        failed.push(resource._attributes.name);
      }
    }

    // show result
    if (failed.length !== 0) {
      gutil.log(ModuleName, gutil.colors.red("The following files failed the check"));
      for (let i in failed) gutil.log(ModuleName, gutil.colors.red(failed[i]));
      process.exitCode = -1;
    }
    if (skipped.length !== 0) {
      gutil.log(ModuleName, gutil.colors.yellow("The following files skipped the check"));
      for (let i in skipped) gutil.log(ModuleName, gutil.colors.yellow(skipped[i]));
    }
    if (passed.length !== 0) {
      gutil.log(ModuleName, gutil.colors.green("The following files passed the check"));
      for (let i in passed) gutil.log(ModuleName, gutil.colors.green(passed[i]));
    }
  })
}

export const ModuleName = 'open-license-check';
export let WorkDir = '../test';
if (process.env.WORK_DIR) WorkDir = process.env.WORK_DIR;

const config = loadConfig();
deglob(config.patterns, config.options, (err: any, files: string[]) => {
  if (err) {
    gutil.log(ModuleName, gutil.colors.red(err));
    process.exit(-1);
  }
  processFiles(files);
  doCheck();
});
