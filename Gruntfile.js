module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      clean: {
        prebuild: ['build', 'temp'],
        postbuild: ['temp']
      },
      browserify: {
          build: {
              src: "src/js/popup.js",
              dest: "temp/popup_bundle.js"
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

            { expand: true, cwd: 'temp/', src: ['popup_bundle.js'], dest: 'build/chrome/js' },
            { expand: true, cwd: 'temp/', src: ['popup_bundle.js'], dest: 'build/firefox/js'},

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

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['clean:prebuild', 'browserify','copy', 'clean:postbuild']);
}