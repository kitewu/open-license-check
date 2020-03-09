import { ModuleName } from './index';
import { existsSync, readFileSync } from 'fs';
// tslint:disable-next-line: no-var-requires
const gutil = require('gulp-util');

export interface Config {
  patterns: string[];
  options: {
    useGitIgnore?: boolean;
    usePackageJson?: boolean;
    configKey?: string;
    gitIgnoreFile?: string;
    ignore?: string[];
    cwd?: string;
  };
}

export function loadConfig(): Config {
  const defaultConfig: Config = {
    patterns: ['**/*'],
    options: {
      useGitIgnore: true,
      ignore: ['node_modules/**/*'],
    },
  };

  const configFile = process.env.LICENSE_CHECK_CONFIG_PATH;
  if (!configFile) {
    gutil.log(ModuleName, gutil.colors.yellow('Not set env LICENSE_CHECK_CONFIG_PATH, use default config'));
    return defaultConfig;
  }
  if (!existsSync(configFile)) {
    gutil.log(ModuleName, gutil.colors.red(`Can not found config file ${configFile}, use default config`));
    return defaultConfig;
  }

  const configs = readFileSync(configFile).toString();
  if (configs) {
    const json = JSON.parse(configs);
    if (json[ModuleName]) return json[ModuleName];
  }

  gutil.log(ModuleName, gutil.colors.red(`Load config from ${configFile} error, use default config`));
  return defaultConfig;
}
