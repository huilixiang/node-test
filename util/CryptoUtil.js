/**
 * Created with JetBrains WebStorm.
 * User: godlike
 * Date: 13-6-5
 * Time: 下午3:25
 * To change this template use File | Settings | File Templates.
 */
var crypto = require('crypto');

exports.md5 = function(src) {
    var hasher=crypto.createHash("md5");
    hasher.update(src);
    return hasher.digest('hex');
}

exports.salt = "ifelseother389362gmailx2ds0";
