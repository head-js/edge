module.exports = {
  plugins: [
  ],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: '3',
      include: [
      ],
      exclude: [
        '@babel/plugin-transform-for-of',
      ],
    }]
  ],
}
