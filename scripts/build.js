/**
 * @file Build script
 * @author bdwenxi(bdwenxi@baidu.com)
 */

// basic
const fs = require('fs-extra');
const zlib = require('zlib');
const {promisify} = require('util');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const {terser} = require('rollup-plugin-terser');
const co = require('co');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const execa = require('execa');
const rimraf = require('rimraf');

// utils
const utils = require('./utils');

const gzip = promisify(zlib.gzip);

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

function getSizeNum(code) {
    return (Buffer.from(code, 'utf-8').length / 1024).toFixed(2);
}

function getSize(code) {
    return getSizeNum(code) + 'KB';
}

const buildByModule = co.wrap(function* (moduleType) {
    const defaults = {compilerOptions: {module: 'commonjs'}, exclude: ['node_modules']};
    const override = {
        compilerOptions: {module: 'es2015', sourceMap: true},
        exclude: [
            'node_modules', 'scripts', 'packages/**/__tests__', 'packages/**/dist'
        ]
    };

    const buildConfig = {
        input: utils.pathResolve('./packages/bd-emitter/src/index.ts'),
        output: {
            file: utils.pathResolve(`./packages/bd-emitter/dist/bd-emitter.${moduleType}.js`),
            format: moduleType,
            name: 'BdEmitter',
            plugins: [
                terser({
                    numWorkers: 1
                })
            ]
        },
        plugins: [
            typescript({
                verbosity: -1,
                tsconfigDefaults: defaults,
                tsconfig: 'tsconfig.json',
                tsconfigOverride: override,
                objectHashIgnoreUnknownHack: true,
                rollupCommonJSResolveHack: true,
                typescript: require('typescript')
            })
        ]
    };

    const bundle = yield rollup.rollup(buildConfig);
    const output = yield bundle.write(buildConfig.output);

    for (let [, out] of output.output.entries()) {
        if (!/.js$/.test(out.fileName)) {
            continue;
        }
        const zipped = yield gzip(out.code);
        const zippedWords = `bd-emitter.${moduleType}.js gzipped: ${chalk.magenta(getSize(zipped))}`;
        console.log(chalk.magenta(zippedWords));
    }
});

const build = co.wrap(function* () {
    const format = ['all', 'cjs', 'esm', 'umd'];
    const questions = [
        {
            type: 'checkbox-plus',
            name: 'format',
            message: 'Please choice module format type',
            pageSize: 10,
            highlight: true,
            default: ['cjs'],
            searchable: true,
            source(answersSoFar, input) {
                input = input || '';

                return new Promise(function (resolve) {
                    const fuzzyResult = fuzzy.filter(input, format);
                    const data = fuzzyResult.map(function (element) {
                        return element.original;
                    });

                    resolve(data);
                });
            }
        }
    ];

    let answers;

    try {
        answers = yield inquirer.prompt(questions);
    }
    catch (e) {
        throw e;
    }

    let formatModuleTypes = answers.format;

    if (!formatModuleTypes.length) {
        throw new Error('Please choice module format at least one');
    }

    if (formatModuleTypes.includes('all')) {
        formatModuleTypes = ['esm', 'cjs', 'umd'];
    }

    for (let module of formatModuleTypes) {
        yield buildByModule(module);
    }

    const sourceDir = utils.pathResolve('./packages/bd-emitter/dist/packages/bd-emitter/src/*');
    const targetDir = utils.pathResolve('./packages/bd-emitter/dist/typings/');

    yield fs.ensureDir(targetDir);
    yield execa(`mv ${sourceDir} ${targetDir}`, {shell: true});
    rimraf.sync(utils.pathResolve('packages/bd-emitter/dist/packages'));
});

build()
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
