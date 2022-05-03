const ignored = ['**/uni_modules/**/*.md', '**/uni_modules/**/package.json', '**/uni_modules/*/uniCloud/**/*']
const TransformPages = require('uni-read-pages')
const tfPages = new TransformPages()
module.exports = {
	configureWebpack() {
		return {
			watchOptions: {
				ignored
			},
			devServer: {
				watchOptions: {
					ignored
				}
			},
			plugins: [
				new tfPages.webpack.DefinePlugin({
					ROUTES: JSON.stringify(tfPages.routes)
				})
			]
		}
	}
}
