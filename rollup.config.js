import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import dotenv from 'dotenv';
import pkg from './package.json';

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
        replace({
            exclude: 'node_modules/**',
            'process.env.API_URL': JSON.stringify(process.env.API_URL),
        }),
        typescript({
            typescript: require('typescript'),
        }),
        terser(),
    ],
};
