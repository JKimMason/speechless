import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'

const pkg = require('./package.json')

const libraryName = 'speechless'

export default {
  input: `compiled/speechless.js`,
  output: [
    { file: pkg.main, name: 'Speechless', format: 'umd' },
    { file: pkg.module, format: 'es' }
  ],
  sourcemap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'compiled/**'
  },
  onwarn: function(warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return
    }
    console.error(warning.message)
  },
  plugins: [
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      namedExports: {
        'node_modules/web-recorder/dist/web-recorder.min.js': ['Recorder']
      }
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
}
