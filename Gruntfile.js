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
        githooks: {
            all: {
                'pre-commit': 'precommit'
            }
        },
        jsbeautifier: {
            files: ['src/*.js', 'examples/*', 'tests', 'Gruntfile.js', 'package.json'],
            options: {
                js: {
                    indent_size: 4,
                    preserve_newlines: true,
                    wrap_line_length: 0,
                    end_with_newline: true
                },
                css: {
                    indent_size: 4,
                    preserve_newlines: false,
                    max_preserve_newlines: 2,
                    end_with_newline: true
                },
                html: {
                    indent_size: 4,
                    preserve_newlines: true,
                    max_preserve_newlines: 2,
                    end_with_newline: true,
                    indent_inner_html: true,
                    indent_scripts: "keep",
                    extra_liners: ["head", "body", "/html", "script", "style"]
                }
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
            help: {
                exec: 'grunt --help'
            }
        },
        uglify: {
            options: {
                banner: '/*!\n<%= pkg.name %>\n<%= pkg.homepage %>\n<%= pkg.repository %>: <%= meta.revision %>\n<%= pkg.license %>\n<%= grunt.template.today() %>\n*/\n'
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
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-git-revision');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-run');

    //Task(s)
    grunt.registerTask('default', ['includereplace', 'revision', 'concat_in_order_jsdoc', 'uglify']);

    grunt.registerTask('doc', ['includereplace', 'revision', 'concat_in_order_jsdoc', 'uglify', 'run:jsdoc']);
    grunt.registerTask('format', ['jsbeautifier'])
    grunt.registerTask('help', ['run:help'])
    grunt.registerTask('precommit', ['format', 'default', 'test'])
    grunt.registerTask('test', ['default', 'qunit'])
};
