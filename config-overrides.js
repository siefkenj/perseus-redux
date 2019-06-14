module.exports = function override(config, env) {
    // prevent chunking for all files
    Object.assign(config.optimization, {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false
            }
        }
    });

    // prevent hashes for the JS files
    Object.assign(config.output, { filename: "static/js/[name].js" });

    // prevent hashes for the CSS files
    // search for the "MiniCssExtractPlugin" so we can remove the hashing in the filename
    for (const plugin of config.plugins) {
        if (!plugin || !plugin.constructor) {
            // do nothing if the plugin is null
            continue;
        }
        if (plugin.constructor.name === "MiniCssExtractPlugin") {
            Object.assign(plugin.options, {
                filename: "static/css/[name].css"
            });
        }
    }

    // minimize only the .min.js files
    for (const plugin of config.optimization.minimizer) {
        if (!plugin || !plugin.constructor) {
            // do nothing if the plugin is null
            continue;
        }
        if (plugin.constructor.name === "TerserPlugin") {
            Object.assign(plugin.options, { include: /\.min\.js$/ });
        }
        if (plugin.constructor.name === "OptimizeCssAssetsWebpackPlugin") {
            Object.assign(plugin.options, { assetNameRegExp: /\.min\.css$/ });
        }
    }

    // add multiple entries for production builds
    if (env === "production") {
        // Normally, just `index.js` is compiled. We also want to compile
        // `perseus-redux.js` which is the standalone library
        const indexPath = config.entry[0];
        const libraryPath = indexPath.replace(/index\.js$/, "perseus-redux.js");
        Object.assign(config, {
            entry: {
                "perseus-redux": libraryPath,
                "perseus-redux.min": libraryPath,
                "main": indexPath
            }
        });
    }

    return config;
};
