const compiler = require('node-sass');
const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');

const render = async (filepath, pluginOptions) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const extname = path.extname(filepath);
        compiler.render(
          {
            file: filepath,
            data,
            outputStyle: 'expanded',
            // Set `indentedSyntax: false` to disable the indented syntax which is Sass’s original syntax,
            // and enable the curly braces syntax for scss file.
            indentedSyntax: extname === '.sass',
            ... pluginOptions,
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      }
    });
  });
};

module.exports = function plugin(snowpackConfig, pluginOptions) {
  return {
    name: pkg.name,
    resolve: {
      input: ['.sass', '.scss'],
      output: ['.css'],
    },
    async load({ filePath }) {
      try {
        const result = await render(filePath, pluginOptions);
        return {
          '.css': result.css.toString(),
        };
      } catch (err) {
        console.error(err);
      }
    },
  };
};
