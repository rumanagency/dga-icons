import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export function getBasePlugins(options = {}) {
  const { minify = true, tsconfig = 'tsconfig.json' } = options;

  return [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    typescript({
      tsconfig,
      declaration: true,
      declarationDir: './dist',
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    }),
    minify && terser({
      compress: {
        drop_console: false,
        pure_funcs: ['console.debug'],
      },
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      },
    }),
  ].filter(Boolean);
}

export function getOutputConfig(pkg) {
  return [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
  ];
}
