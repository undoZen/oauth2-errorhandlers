'use strict';
module.exports = function (os) {
  var result = [];

  result.push(function(req, res, next) {
    var err;
    err = new Error('Resource not found.');
    err.code = 'invalid_request';
    err.status = 404;
    return next(err);
  });

  result.push(function(err, req, res, next) {
    if (err.message === 'Unauthorized') {
      err.message = req.url === '/token' ? 'auth failed' : 'access token is required';
      err.code = 'access_denied';
      err.status = 403;
    } else if ((err.status != null) && err.status >= 500) {
      console.error(err.stack);
    }
    return next(err);
  });

  if (os && 'function' === typeof os.errorHandler) {
    result.push(os.errorHandler());
  }

  return result;
}
