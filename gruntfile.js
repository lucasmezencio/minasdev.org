module.exports = function( grunt ) {
  'use strict';

  // autoload modules from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Tasks configurations
  grunt.initConfig({
    htmlmin: {
      compile: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          '../dist/index.html': 'public/index.html'
        }
      }
    },
    concat: {
      scripts: {
        src: [
          'sources/scripts/**/*.js'
        ],
        dest: '.tmp/scripts.js'
      },
      vendors: {
        src: [
          'sources/libraries/jquery/dist/jquery.min.js',
          'sources/libraries/jquery.easing/js/jquery.easing.min.js',
          'sources/libraries/lodash/dist/lodash.min.js',
          'sources/libraries/momentjs/min/moment.min.js',
          'sources/libraries/momentjs/locale/pt-br.js'
        ],
        dest: '.tmp/vendors.js'
      },
      compile:{
        src: [
          '.tmp/vendors.js',
          '.tmp/scripts.js'
        ],
        dest: 'public/assets/javascripts/minasdev.js'
      }
    },
    uglify: {
      scripts: {
        files: {
          '.tmp/scripts.js': ['.tmp/scripts.js']
        }
      }
    },
    stylus: {
      compile: {
        files: {
          'public/assets/stylesheets/minasdev.css': ['sources/stylus/minasdev.styl']
        }
      }
    },
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: '../dist/public/assets/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '../dist/public/assets/images/'
        }]
      }
    },
    copy: {
      development: {
        files: [
          {expand: true, cwd: 'sources/images/svgs/', src: ['**'], dest: 'public/assets/images/svgs/'},
          {expand: true, cwd: 'sources/images/background/', src: ['**'], dest: 'public/assets/images/'}
        ]
      },
      dist: {
        files: [
          {expand: true, src: ['public/**'], dest: '../dist/'},
          {expand: true, src: ['./package.json'], dest: '../dist/', filter: 'isFile'},
          {expand: true, src: ['./minasdev.js'], dest: '../dist/', filter: 'isFile'}
        ]
      },
    },
    clean: {
      old: {
        options: {
          force: true
        },
        src: [
          '.tmp/',
          '../dist/'
        ]
      },
      tmp: {
        options: {
          force: true
        },
        src: ['.tmp/']
      },
      dist: {
        options: {
          force: true
        },
        src: ['../dist/']
      }
    },
    watch: {
      application: {
        options: {
          livereload: true
        },
        files: 'sources/scripts/**/*.js',
        tasks: [
          'clean:tmp',
          'concat:vendors',
          'concat:scripts',
          'concat:compile'
        ]
      },
      style: {
        options: {
          livereload: true
        },
        files: 'sources/stylus/**/*.styl',
        tasks: ['stylus:compile']
      }
    },
    nodemon: {
      dev: {
        script: 'minasdev.js',
        options: {
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          },
          ignore: ['node_modules/**', 'sources/**', 'public/**'],
          cwd: __dirname
        }
      }
    },
    shell: {
        bower: {
            options: {
                stdout: true
            },
            command: 'bower install'
        }
    },
    concurrent: {
        target: {
            tasks: ['nodemon:dev', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    }

  });

  grunt.registerTask('default', [
    'clean:old',
    'shell:bower',
    'concat:vendors',
    'concat:scripts',
    'uglify:scripts',
    'concat:compile',
    'stylus:compile',
    'copy:development',
    'concurrent'
  ]);

  grunt.registerTask('build', [
    'clean:old',
    'shell:bower',
    'concat:vendors',
    'concat:scripts',
    'uglify:scripts',
    'concat:compile',
    'stylus:compile',
    'clean:dist',
    'copy:dist',
    'htmlmin:compile',
    'imagemin:dynamic'
  ]);

};
