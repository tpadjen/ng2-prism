var gulp = require('gulp');
var jspm = require("jspm");
var shell = require('gulp-shell');
var runSequence = require('run-sequence');

gulp.task('default', function() {
  runSequence('bundle', 'serve');
});

gulp.task('lite-server', shell.task('npm run lite'));

gulp.task('serve', ['watch', 'lite-server']);

gulp.task('bundle', function(done) { bundle(done); });

function bundle(done) {
  console.log("\n--- Compiling & bundling typescript ---")

  jspm.bundleSFX("app", "app/main.js", {
    sourceMaps: true
  })
    .then(function() {
      console.log('---            Complete             ---\n');
      if (done) done();
    })
    .catch(function(err) {
      console.log(err);
      if (done) done();
    });
}

gulp.task('watch', function() {
  console.log("\nWatching typescript for changes");
  console.log("-------------------------------");

  gulp.watch('app/**/*.{html,css,ts}', function() { bundle(); });
});
