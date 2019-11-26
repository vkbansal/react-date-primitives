const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const compiler = webpack({

});

const devServer = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'public'),
});

const PORT = process.env.PORT | 3000;

devServer.listen(PORT, 'localhost', function(e) {
    if (e) {
        console.log(e);
    } else {
        console.log('DevServer Started');
    }
});
