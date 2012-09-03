
var through = require('through')
//var from = require('from')

module.exports = function () {
  var loop = [], init = true, i = 0
  var raw
  return through (function (data) {
    if(init) {
      loop.push(data)
      this.emit('data', data)
    }
  }, function () {
    init = false
    var self = this
      console.log(loop.length / 16, loop.length)
    var tl = 0
    for( var i in loop) 
      tl += loop[i].length

    var raw = Buffer.concat(loop)
    var chunk = Math.round((raw.length / 16) / 2)*2
    loop = []
    for (var j = 0; j < 16; j++) {
      console.log('L', j)
      loop.push(raw.slice(~~(j * chunk), ~~(j * chunk + chunk)))
    }
    console.log(loop)
    i = 0, z = 0, off = false

    function next () {
    
      // 30 % chance to change slice when on 
      if((Math.random() < 0.3 && !(i % 2)))
        i = Math.random() < 0.3 ? 0 : 4
      if((Math.random() < 0.1 && (i % loop.length) > 8))
        i = Math.random() < 0.3 ? 6 : 12, off =true

      if(!(z % loop.length * 2) || off && !(z % loop.length)) {
        i = 0
        off = false
      }
//      console.log(i % loop.length)
      self.emit('data', loop[i % (loop.length)] )
      i ++; z ++
      if(this.paused)
        self.once('drain', next)
      else
//        process.nextTick(next)
        setTimeout(next, 20)
    }

    next()
  })
}
