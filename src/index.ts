import * as fs from 'fs';
import { SnowpackPluginFactory } from 'snowpack';
import { Options } from './interface';
import { render } from './render';

const pkg = require('../package.json');

const plugin: SnowpackPluginFactory<Options> = (snowpackConfig, options = {}) => {
  return {
    name: pkg.name,
    resolve: {
      input: ['.sass', '.scss'],
      output: ['.css'],
    },
    async load({ filePath }) {
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const result = await render(content, {
          ...options,
          file: filePath,
        });
        return {
          '.css': {
            code: result.css.toString(),
          },
        };
      } catch (err) {
        console.error(err);
      }
    },
  };
};

export = plugin;
