var fs = require('fs')
var spawn = require('child_process').spawn
var looper = require('./loop')

var aplay = spawn('aplay',['-r','44k','-c','2','-f','S16_LE', '-t', 'raw']);

fs.createReadStream('./loops/amen-loop.raw')
.pipe(looper())
.pipe(aplay.stdin)

