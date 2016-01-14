var httpreq = require ('httpreq');
var fs = require ('fs');

var config = {};


/**
 * Communicate with API
 *
 * @callback callback
 * @param {object} options
 * @param {string} options.method=GET - HTTP method
 * @param {string} options.path=/ - Request path, i.e. /index/searcher
 * @param {object} options.parameters - Request query parameters
 * @param {object} options.json - POST JSON data
 * @param {object} options.files - Upload files paths
 * @param {number} options.timeout=5000 - Override request timeout in ms
 * @param {function} callback - Callback function
 * @returns {void}
 */

function talk (options, callback) {
  options.url = config.endpoint + options.path;
  options.method = options.method || 'GET';
  options.timeout = config.timeout;
  options.headers = options.headers || {};
  options.headers ['User-Agent'] = 'pastecapi node/' + process.versions.node;

  if (typeof data === 'function') {
    callback = data;
    data = null;
  }

  httpreq.doRequest (options, function (err, res) {
    var data = res && res.body || '';
    var error = null;

    if (err) {
      error = new Error ('request failed');
      error.error = err;
      callback (error);
      return;
    }

    try {
      data = JSON.parse (data);
    } catch (e) {
      error = new Error ('request failed');
      error.error = e;
      callback (error);
      return;
    }

    callback (null, data);
  });
}


function ping (callback) {
  var options = {
    method: 'POST',
    path: '/',
    json: {
      type: 'PING'
    }
  };

  talk (options, callback);
}

function loadIndex (indexPath, callback) {
  var options = {
    method: 'POST',
    path: '/index/io',
    json: {
      type: 'LOAD',
      index_path: indexPath
    }
  };

  talk (options, callback);
}

function writeIndex (indexPath, callback) {
  var options = {
    method: 'POST',
    path: '/index/io',
    json: {
      type: 'WRITE',
      index_path: indexPath
    }
  };

  talk (options, callback);
}

function clearIndex (callback) {
  var options = {
    method: 'POST',
    path: '/index/io',
    json: {
      type: 'CLEAR'
    }
  };

  talk (options, callback);
}

function searchIndex (image, callback) {
  var options = {
    method: 'POST',
    path: '/index/searcher',
    binary: true
  };

  // Binary pass through
  if (image instanceof Buffer) {
    options.body = image;
    talk (options, callback);
    return;
  }

  // Read file to buffer
  fs.readFile (image, function (err, data) {
    if (err) {
      callback (err);
      return;
    }

    options.body = data;
    options.headers = {
      'Content-Length': data.length,
      'Content-Type': 'image/jpeg'
    };

    talk (options, callback);
  });
}

function deleteImage (imageId, callback) {
  var options = {
    method: 'DELETE',
    path: '/index/images/' + imageId
  };

  talk (options, callback);
}

function addImage (image, imageId, callback) {
  var options = {
    method: 'PUT',
    path: '/index/images/' + imageId,
    binary: true
  };

  // Binary pass through
  if (image instanceof Buffer) {
    options.body = image;
    talk (options, callback);
    return;
  }

  // Read file to buffer
  fs.readFile (image, function (err, data) {
    if (err) {
      callback (err);
      return;
    }

    options.body = data;
    options.headers = {
      'Content-Length': data.length,
      'Content-Type': 'image/jpeg'
    };
    talk (options, callback);
  });
}


/**
 * Module setup
 *
 * @param {string} endpoint - REST API base URL
 * @param {integer} timeout - Request wait timeout in ms
 * @returns {object} - Module methods
 */

module.exports = function (endpoint, timeout) {
  config.endpoint = endpoint || 'http://localhost:4121';
  config.timeout = timeout || 5000;

  return {
    ping,
    loadIndex,
    writeIndex,
    clearIndex,
    searchIndex,
    addImage,
    deleteImage
  };
};
