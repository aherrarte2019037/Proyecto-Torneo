module.exports = {
  mode: 'jit',
  purge: [ './src/**/*.{html, ts}', './projects/**/*.{html, ts}' ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
}
