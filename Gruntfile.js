module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat_in_order_jsdoc: {
            your_target: {
                options: {},
                files: {
                    'thefragebogen.js': ['build/*.js']
                }
            }
        },
        includereplace: {
            dist: {
                options: {
                    globals: {},
                },
                files: [{
                    src: '*.js',
                    dest: 'build/',
                    expand: true,
                    cwd: 'src/'
                }, ]
            }
        },
        jsbeautifier: {
            files: ['src/*.js', 'examples/*.js', 'Gruntfile.js', 'package.json'],
            options: {
                indentSize: 2,
                preserve_newlines: true
            }
        },
        qunit: {
            all: ['tests/qunit*.html']
        },
        revision: {
            options: {
                property: 'meta.revision',
                ref: 'HEAD',
                short: true
            }
        },
        run: {
            jsdoc: {
                exec: 'jsdoc -d=doc thefragebogen.js'
            },
            htmltidy: {
                exec: 'tidy -m -quiet -config tidy.config examples/*.html tests/*.html'
            },
            help: {
                exec: 'grunt --help'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>, <$= meta.revision %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'thefragebogen.min.js': ['thefragebogen.js'] //'<%= concat_in_order.dist.dest %>'
                }
            }
        }
    });

    grunt.loadTasks("third_party/concat_in_order_jsdoc/");

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-git-revision');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-run');

    //Task(s)
    grunt.registerTask('default', ['includereplace', 'revision', 'concat_in_order_jsdoc', 'uglify']);

    grunt.registerTask('doc', ['includereplace', 'revision', 'concat_in_order_jsdoc', 'uglify', 'run:jsdoc']);
    grunt.registerTask('format', ['jsbeautifier', 'run:htmltidy'])
    grunt.registerTask('help', ['run:help'])
    grunt.registerTask('test', ['default', 'qunit'])
};
