import sass from 'node-sass';
import * as fs from 'fs';
import * as path from 'path';
import { Options } from '../src/interface';
import { render } from '../src/render';

describe('test src/render.ts', () => {
  it('render(): called with node-sass', async () => {
    const spy = jest.spyOn(sass, 'render');
    const filepath = path.join(__dirname, './fixtures/a.scss');
    const css = fs.readFileSync(filepath, 'utf-8');
    const options: Options = { file: filepath };

    // mock for test args
    spy.mockImplementation((options, cb) => {
      return cb(null, options);
    });

    expect(spy).not.toBeCalled();
    let args = render(css, options);
    expect(args).toBeInstanceOf(Promise);

    args = await args;
    expect(args).toStrictEqual({
      ...options,
      data: css,
      indentedSyntax: path.extname(filepath) === '.sass',
      outputStyle: 'expanded',
    });
    expect(spy).toBeCalledTimes(1);
    spy.mockRestore();

    // test render result
    const result = await render(css, options);
    expect(result.css.toString().trim()).toStrictEqual(css);
  });
});
