/*
Name:           pastecapi - test.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-pastecapi
Feedback:       https://github.com/fvdm/nodejs-pastecapi/issues
License:        Unlicense (Public Domain, see LICENSE file)
                (https://github.com/fvdm/nodejs-pastecapi/raw/develop/LICENSE)
*/


const dotest = require ('dotest');
const app = require ('./');
const path = require ('path');
const dir = path.dirname (module.filename);

const pastec = app (
  process.env.PASTEC_ENDPOINT || 'http://localhost:4212',
  process.env.PASTEC_AUTHKEY || null,
  process.env.PASTEC_TIMEOUT || 5000
);


// Tests
dotest.add ('Module', function () {
  dotest.test ()
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

dotest.add ('Method ping', function () {
  pastec.ping (function (err, data) {
    // no api = no tests
    if (err && err.error.code === 'ECONNREFUSED') {
      dotest.log ('fail', 'No API access');
      process.exit();
    }

    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'PONG')
      .done ();
  });
});

dotest.add ('Method writeIndex', function () {
  pastec.writeIndex ('./sampleIndex.dat', function (err, data) {
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'INDEX_WRITTEN')
      .done ();
  });
});

dotest.add ('Method clearIndex', function () {
  pastec.clearIndex (function (err, data) {
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'INDEX_CLEARED')
      .done ();
  });
});

dotest.add ('Method loadIndex', function () {
  pastec.loadIndex ('./sampleIndex.dat', function (err, data) {
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'INDEX_LOADED')
      .done ();
  });
});

dotest.add ('Method addImage', function () {
  pastec.addImage (path.join (dir, 'imageSample.jpg'), 999999999999999, function (err, data) {
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'IMAGE_ADDED')
      .done ();
  });
});

dotest.add ('Method searchIndex', function () {
  pastec.searchIndex (path.join (dir, 'imageSample.jpg'), function (err, data) {
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'SEARCH_RESULTS')
      .done ();
  });
});

dotest.add ('Method deleteImage', function () {
  pastec.deleteImage (999999999999999, function (err, data) {
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.type', data && data.type, 'IMAGE_REMOVED')
      .done ();
  });
});


// Start the tests
dotest.run ();
