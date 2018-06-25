module.exports = {
	plugins: [
		new webpack.ContextReplacementPlugin(
		  // The (\\|\/) piece accounts for path separators in *nix and Windows
		  /angular(\\|\/)core/,
		  root('./src'), // location of your src
		  { }
		)
	]
  }
  function root(__path) {
	return path.join(__dirname, __path);
  }