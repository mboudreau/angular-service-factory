module.exports = function (grunt) {

	/**
	 * Load required Grunt tasks. These are installed based on the versions listed
	 * in `package.json` when you do `npm install` in this directory.
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-compress');

	/**
	 * Rename watch task to two separate tasks for build and release
	 */
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask('watch', 'delta');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask('watch', 'deltarelease');

	/**
	 * Load in our build configuration file.
	 */
	var userConfig = require('./build.config.js');
	var bower = grunt.file.readJSON("bower.json");

	var taskConfig = {
		pkg: {
			author: bower.author,
			name: bower.name,
			version: bower.version
		},

		clean: [
			'<%= build_dir %>',
			'<%= release_dir %>'
		],

		copy: {
			build: {
				src: [ '<%= app_files.js %>' ],
				dest: '<%= build_dir %>/',
				cwd: '.',
				expand: true
			},
			release: {

			}
		},

		concat: {

		},

		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			build: {
				files: [
					{
						src: [ '<%= app_files.js %>' ],
						cwd: '<%= build_dir %>/<%= pkg.name %>',
						dest: '<%= build_dir %>/<%= pkg.name %>',
						expand: true
					},
					{
						src: [ '<%= vendor_files.js %>' ],
						cwd: '<%= build_dir %>/<%= pkg.name %>',
						dest: '<%= build_dir %>/<%= pkg.name %>',
						expand: true
					}
				]
			}
		},

		uglify: {
			release: {
				options: {
					mangle: false,
					sourceMap: true
				},
				files: [
					{
						src: ['<%= release_dir %>/<%= pkg.name %>/**/*.js'],
						expand: true,
						ext: '.min.js',
						extDot: 'last'
					}
				]
			}
		},

		jshint: {
			options: {
				curly: true,
				immed: true,
				newcap: true,
				noarg: true,
				sub: true,
				boss: true,
				asi: true,
				eqnull: true,
				shadow: true,
				globals: {
					angular: true,
					_: true,
					app: true
				}
			},
			source: {
				src: [
					'<%= app_files.js %>'
				]
			},

			test: {
				options: {
					newcap: false
				},
				src: [ '<%= app_files.jsunit %>' ]
			},
			gruntfile: {
				src: [
					'Gruntfile.js'
				]
			}
		},

		karma: {
			options: {
				configFile: '<%= build_dir %>/karma-unit.js'
			},
			unit: {
				singleRun: true
			},
			continuous: {
				singleRun: false,
				background: true
			}
		},

		compress: {
			release: {
				options: {
					mode: 'gzip'
				},
				files: [
					// Each of the files in the src/ folder will be output to
					// the dist/ folder each with the extension .gz.js
					{
						src: ['<%= release_dir %>/<%= pkg.name %>/**/*.min.js'],
						expand: true,
						ext: '.js.gz',
						extDot: 'last'
					},
					{
						src: ['<%= release_dir %>/<%= pkg.name %>/**/*.css'],
						expand: true,
						ext: '.css.gz',
						extDot: 'last'
					}
				]
			}
		},

		karmaconfig: {
			unit: {
				dir: '<%= build_dir %>',
				src: [
					'<%= vendor_files.js %>',
					'<%= build_dir %>/<%= pkg.name %>/**/*.tpl.js',
					'<%= test_files.js %>'
				]
			}
		},

		delta: {
			options: {
				livereload: true
			},

			gruntfile: {
				files: 'Gruntfile.js',
				tasks: [ 'jshint:gruntfile' ],
				options: {
					livereload: false
				}
			},

			jssrc: {
				files: [
					'<%= app_files.js %>'
				],
				tasks: [ 'jshint:source', 'copy:build_app_js', 'ngAnnotate', 'karma:unit:run' ]
			},

			jsvendor: {
				files: [
					'<%= vendor_files.js %>'
				],
				tasks: [ 'copy:build_vendor_js', 'ngAnnotate' ]
			},

			assets: {
				files: [
					'src/assets/**/*'
				],
				tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
			},

			html: {
				files: [ '<%= app_files.html %>' ],
				tasks: [ 'index:build' ]
			},

			tpls: {
				files: [
					'<%= app_files.atpl %>',
					'<%= app_files.dtpl %>'
				],
				tasks: [ 'html2js' ]
			},

			less: {
				files: [ 'src/**/*.less', 'vendor/**/*.less' ],
				tasks: [ 'less:build' ]
			},

			jsunit: {
				files: [
					'<%= app_files.jsunit %>'
				],
				tasks: [ 'jshint:test', 'karma:unit:run' ],
				options: {
					livereload: false
				}
			}
		},

		deltarelease: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: [ 'jshint:gruntfile' ],
				options: {
					livereload: false
				}
			},

			jssrc: {
				files: [
					'<%= app_files.js %>'
				],
				tasks: [ 'jshint:source', 'copy:build_app_js', 'ngAnnotate', 'concat:release_js', 'uglify', 'karma:unit:run' ]
			},

			jsvendor: {
				files: [
					'<%= vendor_files.js %>'
				],
				tasks: [ 'copy:build_vendor_js', 'ngAnnotate', 'concat:release_js', 'uglify' ]
			},

			assets: {
				files: [
					'src/assets/**/*'
				],
				tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets', 'copy:release_assets' ]
			},

			html: {
				files: [ '<%= app_files.html %>' ],
				tasks: [ 'index:release' ]
			},

			tpls: {
				files: [
					'<%= app_files.atpl %>',
					'<%= app_files.dtpl %>'
				],
				tasks: [ 'html2js', 'concat:release_js', 'uglify' ]
			},

			less: {
				files: [ 'src/**/*.less', 'vendor/**/*.less' ],
				tasks: [ 'less:release', 'cssmin:release' ]
			},

			jsunit: {
				files: [
					'<%= app_files.jsunit %>'
				],
				tasks: [ 'jshint:test', 'karma:unit:run' ],
				options: {
					livereload: false
				}
			}
		},

		file_check: {
			vendors: {
				src: [
					'<%= vendor_files.js %>',
					'<%= vendor_files.css %>'
				],
				nonull: true // DO NOT REMOVE, this is needed to find all incorrect paths
			}
		}
	};

	grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

	grunt.registerTask('watch', [ 'build', 'karma:continuous', 'delta' ]); // commenting out karma for watch
	grunt.registerTask('watch:release', [ 'release', 'karma:continuous', 'deltarelease' ]);

	/**
	 * The default task is to build and release.
	 */
	grunt.registerTask('default', [ 'build' ]);

	grunt.registerTask('test', [ 'build' ]);

	/**
	 * The build task gets your app ready to run for development and testing.
	 */
	grunt.registerTask('build', [
		'file_check', 'jshint:source', 'clean', 'copy:build', 'ngAnnotate', 'karmaconfig', 'karma:unit'
	]);

	/*
	 * The release task gets your app ready for deployment
	 */
	grunt.registerTask('release', [
		'build', 'copy:release', 'concatenate:release', 'uglify:release', 'compress:release'
	]);

	function filterForJS(files) {
		return files.filter(function (file) {
			return file.match(/\.js(\.gz)?$/);
		});
	}

	grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
		var jsFiles = filterForJS(this.filesSrc);

		grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
			process: function (contents, path) {
				return grunt.template.process(contents, {
					data: {
						scripts: jsFiles
					}
				});
			}
		});
	});

	/**
	 * A quick file check to make sure all dependent files exists, if not throw error.
	 * This is mostly used to mention to the user that a new dependency might of been added, but not installed
	 * through `bower install`.
	 */
	grunt.registerMultiTask('file_check', 'Custom file check to catch dependency problems', function () {
// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
		});

		grunt.verbose.writeflags(options, 'Options');

		var missingFiles = [];

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			missingFiles = f.src.filter(function (filepath) {
				return !grunt.file.exists(filepath) && !/[!*?{}]/.test(filepath);
			});
		});

		if (missingFiles.length !== 0) {
			var message = 'The following files are missing: ' + missingFiles.join(',') + '\nDid you forget to do `bower install`?';
			grunt.fail.warn(message, 3);
			return false;
		}

		grunt.log.writeln('All files accounted for.');
		return true;
	});

	/**
	 * Utility Tasks to force other tasks to continue even if they fail, need to 'wrap' both around the tasks that you
	 * want forced or else it will force all of them.
	 */

	grunt.registerTask('useTheForce', 'turns the --force option ON',
		function () {
			if (!grunt.option('force')) {
				grunt.config.set('forceStatus', true);
				grunt.option('force', true);
			}
		});

	grunt.registerTask('disturbTheForce', 'turns the --force option Off',
		function () {
			if (grunt.config.get('forceStatus')) {
				grunt.option('force', false);
			}
		});
};
