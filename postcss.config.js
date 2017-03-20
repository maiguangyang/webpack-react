
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: [
        'ie 6-8',
        'Firefox <= 20',
        '> 5%',
        'last 2 versions',
        'iOS 7'
      ]
    })
  ]
}