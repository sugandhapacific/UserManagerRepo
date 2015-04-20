module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {   
    dist: {
        src: [
		'UserManager/Scripts/mainSections.js',
		'UserManager/Scripts/userElements.js',
            'UserManager/Scripts/ajaxWrapper.js',
	    'UserManager/Scripts/mainJS.js'
        ],
        dest: 'UserManager/Scripts/build/production.js',
    }
},
	
uglify: {
    build: {
        src: 'UserManager/Scripts/build/production.js',
        dest: 'UserManager/Scripts/build/production.min.js'
    }
},

watch: {
    scripts: {
        files: ['UserManager/Scripts/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
            spawn: false,
        },
css: {
    files: ['UserManager/Style/*.scss'],
    tasks: ['sass'],
    options: {
        spawn: false,
    }
}
    } 
},
sass: {
    dist: {
        options: {
            style: 'compressed'
        },
        files: {
            'UserManager/Style/build/global.css': 'UserManager/Style/style.scss'
        }
    } 
}

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-sass');



    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

grunt.registerTask('default', ['concat', 'uglify','sass']);
};