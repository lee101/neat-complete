fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'

output = (command)->
  command.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  command.stdout.on 'data', (data) ->
    print data.toString()


task 'build', 'Build lib/ from src/', ->
  coffee = spawn 'coffee', ['-l','-j', 'lib/neat_complete.js','-c', 'src']
  output coffee
  coffee.on 'exit', (code)->
    uglify = spawn 'uglifyjs', ['-o', 'lib/neat_complete.min.js', 'lib/neat_complete.js']
    output uglify
  
  sass = spawn 'sass', ['-t','compact','src/scss/style.scss','lib/neat_complete.css']  
  output sass
  

    
task 'watch', 'Watch src/ for changes', ->
  coffee  = spawn 'coffee', ['-w', '-l','-j', 'lib/neat_complete.js', '-c', 'src/coffee']
  output coffee
  sass    = spawn 'sass', ['-t','expanded','-l','--watch','src/scss/style.scss:lib/neat_complete.css']
  output sass
