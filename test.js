/*
Name:           pastecapi - test.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-pastecapi
Feedback:       https://github.com/fvdm/nodejs-pastecapi/issues
License:        Unlicense (Public Domain, see LICENSE file)
                (https://github.com/fvdm/nodejs-pastecapi/raw/develop/LICENSE)
*/


const fs = require ('fs');
const dotest = require ('dotest');
const app = require ('./');
const path = require ('path');
const dir = path.dirname (module.filename);

const endpoint = process.env.PASTEC_ENDPOINT || 'http://localhost:4212';
const indexid = process.env.PASTEC_INDEXID || null;
const authkey = process.env.PASTEC_AUTHKEY || null;
const timeout = process.env.PASTEC_TIMEOUT || 5000;

const pastec = app ({
  endpoint,
  indexid,
  authkey,
  timeout
});


// Tests
dotest.add ('Module', function (test) {
  test ()
    .isFunction ('fail', 'exports', app)
    .isObject ('fail', 'module', pastec)
    .isFunction ('fail', '.ping', pastec && pastec.ping)
    .isFunction ('fail', '.writeIndex', pastec && pastec.writeIndex)
    .isFunction ('fail', '.clearIndex', pastec && pastec.clearIndex)
    .isFunction ('fail', '.loadIndex', pastec && pastec.loadIndex)
    .isFunction ('fail', '.searchIndex', pastec && pastec.searchIndex)
    .isFunction ('fail', '.addImage', pastec && pastec.addImage)
    .isFunction ('fail', '.deleteImage', pastec && pastec.deleteImage)
    .done ();
});

dotest.add ('Method ping', function (test) {
  pastec.ping (function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'PONG')
      .done ();
  });
});

dotest.add ('Method writeIndex', function (test) {
  pastec.writeIndex ('./sampleIndex.dat', function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'INDEX_WRITTEN')
      .done ();
  });
});

dotest.add ('Method clearIndex', function (test) {
  pastec.clearIndex (function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'INDEX_CLEARED')
      .done ();
  });
});

dotest.add ('Method loadIndex', function (test) {
  pastec.loadIndex ('./sampleIndex.dat', function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'INDEX_LOADED')
      .done ();
  });
});

dotest.add ('Method addImage - filename', function (test) {
  pastec.addImage (path.join (dir, 'imageSample.jpg'), 999999999999999, function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'IMAGE_ADDED')
      .done ();
  });
});

dotest.add ('Method addImage - buffer', function (test) {
  fs.readFile (path.join (dir, 'imageSample.jpg'), function (errFile, file) {
    test (errFile);

    pastec.addImage (file, 999999999999999, function (err, data) {
      test (err)
        .isObject ('fail', 'data', data)
        .isExactly ('warn', 'data.type', data && data.type, 'IMAGE_ADDED')
        .done ();
    });
  });
});

dotest.add ('Method addImage - error', function (test) {
  pastec.addImage ('', 999999999999999, function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .info (err.message)
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});

dotest.add ('Method searchIndex - filename', function (test) {
  pastec.searchIndex (path.join (dir, 'imageSample.jpg'), function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'SEARCH_RESULTS')
      .done ();
  });
});


dotest.add ('Method searchIndex - buffer', function (test) {
  fs.readFile (path.join (dir, 'imageSample.jpg'), function (errFile, file) {
    test (errFile);

    pastec.searchIndex (file, function (err, data) {
      test (err)
        .isObject ('fail', 'data', data)
        .isExactly ('warn', 'data.type', data && data.type, 'SEARCH_RESULTS')
        .done ();
    });
  });
});

dotest.add ('Method searchIndex - error', function (test) {
  pastec.searchIndex ('', function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .info (err.message)
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});

dotest.add ('Method deleteImage', function (test) {
  pastec.deleteImage (999999999999999, function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'IMAGE_REMOVED')
      .done ();
  });
});

dotest.add ('Error: invalid authkey', function (test) {
  const tmp = app (endpoint, timeout);

  tmp.writeIndex ('./sampleIndex.dat', function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'invalid authkey')
      .isExactly ('warn', 'err.error', err && err.error, 'AUTHENTIFICATION_ERROR')
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});

dotest.add ('Error: request failed', function (test) {
  const tmp = app (endpoint, authkey, 1);

  tmp.writeIndex ('./sampleIndex.dat', function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'request failed')
      .isError ('fail', 'err.error', err && err.error)
      .isExactly ('fail', 'err.error.code', err && err.error && err.error.code, 'TIMEOUT')
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});

dotest.add ('Setup arguments', function (test) {
  const tmp = app ('example.lan', 123);

  test ()
    .isExactly ('fail', 'config.endpoint', tmp.config.endpoint, 'example.lan')
    .isNull ('fail', 'config.authkey', tmp.config.authkey)
    .isExactly ('fail', 'config.timeout', tmp.config.timeout, 123)
    .done ();
});


// Start the tests
dotest.run ();
