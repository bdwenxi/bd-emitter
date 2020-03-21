/**
 * @file build util
 * @author bdwenxi(bdwenxi@baidu.com)
 */

const path = require('path');

class Utils {
    pathResolve(subPath) {
        if (!subPath) {
            return path.resolve(__dirname, '..', '..');
        }

        return path.resolve(__dirname, '..', '..', subPath);
    }
}

const utils = new Utils();

module.exports = utils;
