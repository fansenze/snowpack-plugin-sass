import * as path from 'path';
import sass, { Result } from 'node-sass';
import { Options } from './interface';

export async function render(content: string, options: Options) {
  return new Promise<Result | never>((resolve, reject) => {
    // content
    const extname = path.extname(options.file as string);
    sass.render(
      {
        outputStyle: 'expanded',
        // Set `indentedSyntax: false` to disable the indented syntax which is Sass’s original syntax,
        // and enable the curly braces syntax for scss file.
        indentedSyntax: extname === '.sass',
        ...options,
        data: content,
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
}
