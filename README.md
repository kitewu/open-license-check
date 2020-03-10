# open-license-check

`open-license-check` is an open source module for license checking.

## Getting start

### Install

`npm i -g open-license-check`

### Run

```shell
# open-license-check
```

## Docs

### The definition of Config

Please refer to [deglob](https://www.npmjs.com/package/deglob)

```typescript
interface Config {
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
```

#### Default config

```javascript
{
  patterns: [ '**/*' ],
  options: {
    useGitIgnore: true,
    ignore: [ 'node_modules/**/*' ],
  },
}
```

#### Customer configuration

Note: In order to facilitate the user to integrate the configuration into the package.json file, after loading the configuration file, the configuration will be read from the `open-license-check` field, so the specific configuration should be included in the `open-license-check` field, for example:

```json
{
  "open-license-check": {
    "patterns": [ "**/*" ],
    "options": {
      "useGitIgnore": true,
      "ignore": [ "node_modules/**/*" ]
    }
  }
}
```

The configuration file can be placed in any path of the project and specified by `LICENSE_CHECK_CONFIG_PATH` environment variable, for example:

```bash
# export LICENSE_CHECK_CONFIG_PATH=./open-license-check.json
# open-license-check
```

#### Parameters

Users can pass parameters to decide which log information to output. The parameters are as follows:

- -p, --passed [false | true], false means do not output files that passed the check, true means normal output, default is true
- -s,-skipped [false | true], false means do not output files that skipped the checking, true means normal output, default is true
- -f, --failed [false | true], false means do not output files that failed the check, true means normal output, default is true

### docker

#### build

```bash
# docker build -t open-license-check .
```

#### run

```bash
# docker run -it -v src/path:/github/workspace open-license-check -p false
```
