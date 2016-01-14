/*
Name:         pastecapi
Description:  Lightweight module for Pastec image recognition API
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.com/fvdm/nodejs-pastecapi
Feedback:     https://github.com/fvdm/nodejs-pastecapi/issues
License:      Unlicense (Public Domain, see LICENSE file)
*/

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

  httpreq.doRequest (options, function (err, res) {
    var data = res && res.body || {};
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


/**
 * Test API access
 *
 * @callback callback
 * @param {function} callback - Process result
 * @returns {void}
 */

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


/**
 * Load index from file on server
 *
 * @param {string} indexPath - Path to .dat file on server
 * @param {function} callback - Process result
 * @returns {void}
 */

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


/**
 * Write index to file on server
 *
 * @callback callback
 * @param {string} indexPath - Path of .dat file on server
 * @param {function} callback - Process result
 * @returns {void}
 */

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


/**
 * Clear index on server
 *
 * @callback callback
 * @param {function} callback - Process result
 * @returns {void}
 */

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


/**
 * Match image against index
 *
 * @callback callback
 * @param {string} image - Buffer or local path to image
 * @param {function} callback - Process result
 * @returns {void}
 */

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


/**
 * Remove image signature from index
 *
 * @callback callback
 * @param {number} imageId - Index ID of image signature
 * @param {function} callback - Process result
 * @returns {void}
 */

function deleteImage (imageId, callback) {
  var options = {
    method: 'DELETE',
    path: '/index/images/' + imageId
  };

  talk (options, callback);
}


/**
 * Add image signature to index
 *
 * @callback callback
 * @param {string} image - Buffer or local path to image
 * @param {number} imageId - Index ID for image
 * @param {function} callback - Process result
 * @returns {void}
 */

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
