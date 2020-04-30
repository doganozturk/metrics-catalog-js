import dotenv from 'dotenv';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

dotenv.config();

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
        {
            file: pkg.browser,
            format: 'iife',
            name: 'MetricsCatalog',
        },
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        injectProcessEnv({
            API_URL: process.env.API_URL,
        }),
        terser(),
    ],
};
