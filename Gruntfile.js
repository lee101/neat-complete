
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-shell');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: [{
      files: "src/coffee/*.coffee",
      tasks: 'coffee'
    },{
      files: "src/scss/*.scss",
      tasks: "sass"
    },{
      files: ["lib/<%= pkg.name %>.js","test/test.js"],
      tasks: "qunit"
    }],
    connect: {
      server: {
        options: {
          port: 8000
        }
      }
    },
    qunit:{
      all:{
        options:{
          urls: ["http://localhost:<%= connect.server.options.port %>/test/index.html"]
        }
      }
    },
    sass:{
      dev:{
        options: {
          style: 'expanded'
        },
        files: {
          'lib/<%= pkg.name %>.css': 'src/scss/style.scss'
        }
      }
    },
    coffee:{
      dev: {
        files:{
          "lib/<%= pkg.name %>.js": "src/coffee/*.coffee"
        }
      }
    },
    uglify: {
      options: {
        banner: '// <%= pkg.name %> v<%= pkg.version %> \n//\n// (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> \n// <%= pkg.license %>\n'
      },
      build: {
        src:  'lib/<%= pkg.name %>.js',
        dest: 'lib/<%= pkg.name %>.min.js'
      }
    },
    shell:{
      codo: {
        command: "node_modules/codo/bin/codo",
        options: {
            stdout: true
        }
      }
    }
  });
  // Default task(s).
  grunt.registerTask('dev', ['connect','watch']);
  grunt.registerTask('test',['connect', 'qunit']);
  grunt.registerTask('build', ['coffee', 'test', 'shell:codo', 'uglify'])

};
