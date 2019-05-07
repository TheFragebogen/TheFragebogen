module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat_in_order: {
            your_target: {
                options: {
                    banner: '/*!\n<%= pkg.name %>\nVersion: <%= pkg.version %>\n<%= pkg.homepage %>\nGIT: <%= pkg.repository %>/commit/<%= meta.revision %>\nLicense: <%= pkg.license %>\n<%= grunt.template.today("UTC:dddd, mmmm dS, yyyy, h:MM:ss TT Z", true) %>\n*/\n',
                    extractRequired: function(filepath, filecontent) {
                        var augments = this.getMatches(/@augments[\s]+([^\s]+)/g, filecontent);
                        var requires = this.getMatches(/@requires[\s]+([^\s]+)/g, filecontent);
                        return augments.concat(requires);
                    },
                    extractDeclared: function(filepath, filecontent) {
                        return this.getMatches(/@class[\s]+([^\s]+)/g, filecontent);
                    },
                    exportConcatenationOrder: 'concatOrder'
                },
                files: {
                    'thefragebogen.js': ['build/*.js']
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/*.js'],
                options: {
                    destination: 'doc'
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
            files: ['src/*.js', 'examples/*', 'examples_feasibility/*/src/*.js', 'examples_feasibility/*/*.html', 'tests/*', 'Gruntfile.js', 'package.json'],
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
        jshint: {
            all: ['src/*.js', 'examples/*.js', 'examples-feasibility/*/src/*.js', 'Gruntfile.js', 'package.json'],
            options: {
                esversion: 6
            }
        },
        qunit: {
            all: ['tests/qunit*.html'],
            options: {
                puppeteer: {
                    headless: true,
                    //Disable Chrome's security features to be executed on (older) Linux; needed for TravisCI
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            }
        },
        revision: {
            options: {
                property: 'meta.revision',
                ref: 'HEAD',
                short: false
            }
        },
        run: {
            jsdoc: {
                exec: 'jsdoc --private -d doc thefragebogen.js'
            },
            help: {
                exec: 'grunt --help'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            dist: {
                files: {
                    'dist/thefragebogen.es5.js': 'thefragebogen.js'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*!\n<%= pkg.name %>\nVersion: <%= pkg.version %>\n<%= pkg.homepage %>\nGIT: <%= pkg.repository %>/commit/<%= meta.revision %>\nLicense: <%= pkg.license %>\n<%= grunt.template.today("UTC:dddd, mmmm dS, yyyy, h:MM:ss TT Z", true) %>\n*/\n',
            },
            dist: {
                files: {
                    'dist/thefragebogen.es5-min.js': ['dist/thefragebogen.es5.js'] //'<%= concat_in_order.dist.dest %>'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-concat-in-order');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-git-revision');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-run');
    require("load-grunt-tasks")(grunt);
    //Task(s)
    grunt.registerTask('default', ['includereplace', 'revision', 'concat_in_order']);

    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('dist', ['default', 'babel', 'uglify', 'doc']);
    grunt.registerTask('format', ['jsbeautifier']);
    grunt.registerTask('help', ['run:help']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['default', 'qunit']);
};
