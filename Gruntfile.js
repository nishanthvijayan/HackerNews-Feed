module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      browserify: {
          build: {
              src: "src/js/popup.js",
              dest: "src/js/popup_bundle.js"
          }
      },
      copy: {
        main: {
          files: [
            { expand: true, cwd: 'src/img', src: ['*'], dest: 'build/chrome/img/', filter: 'isFile' },
            { expand: true, cwd: 'src/img', src: ['*'], dest: 'build/firefox/img/', filter: 'isFile' },

            { expand: true, cwd: 'src/', src: ['manifest.json'], dest: 'build/chrome/' },
            { expand: true, cwd: 'src/', src: ['manifest.json'], dest: 'build/firefox/'},

            { expand: true, cwd: 'src/', src: ['popup.html'], dest: 'build/chrome/' },
            { expand: true, cwd: 'src/', src: ['popup.html'], dest: 'build/firefox/'},

            { expand: true, cwd: 'src/js', src: ['popup_bundle.js'], dest: 'build/chrome/js' },
            { expand: true, cwd: 'src/js', src: ['popup_bundle.js'], dest: 'build/firefox/js'},

            { expand: true, cwd: 'src/css', src: ['chrome_style.css'], dest: 'build/chrome/css',
              rename: (dest, src) => { return dest + "/style.css" }
            },
            { expand: true, cwd: 'src/css', src: ['firefox_style.css'], dest: 'build/firefox/css',
              rename: (dest, src) => { return dest + "/style.css" }
            },
          ],
        },
      },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify','copy']);
}