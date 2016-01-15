/*
Name:           pastecapi - test.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-pastecapi
Feedback:       https://github.com/fvdm/nodejs-pastecapi/issues
License:        Unlicense (Public Domain, see LICENSE file)
                (https://github.com/fvdm/nodejs-pastecapi/raw/develop/LICENSE)
*/

'use strict';
var path = require ('path');
var dir = path.dirname (module.filename);

var pkg = require (path.join (dir, 'package.json'));
var app = require (dir) (
  process.env.PASTEC_ENDPOINT || 'http://localhost:4212',
  process.env.PASTEC_TIMEOUT || 5000
);

var colors = process.env.PASTEC_COLORS || 'dark';
var errors = 0;
var warnings = 0;
var queue = [];
var next = 0;


// Color string
function log (type, str) {
  var c = colors === 'bright' ? 9 : 3;

  if (!str) {
    str = type;
    type = 'plain';
  }

  switch (type) {
    case 'error': console.log (`\u001b[1m\u001b[${c}1mERR\u001b[0m  - ${str}\n`); break;
    case 'fail': console.log (`\u001b[${c}1mFAIL\u001b[0m - ${str}`); break;
    case 'good': console.log (`\u001b[${c}2mgood\u001b[0m - ${str}`); break;
    case 'warn': console.log (`\u001b[${c}3mwarn\u001b[0m - ${str}`); break;
    case 'info': console.log (`\u001b[${c}6minfo\u001b[0m - ${str}`); break;
    case 'note': console.log (`\u001b[1m${str}\u001b[0m`); break;
    case 'plain': default: console.log (str); break;
  }
}

// handle exits
process.on ('exit', function () {
  console.log ();
  log ('info', errors + ' errors');
  log ('info', warnings + ' warnings');

  if (errors) {
    log ('note', '\nTest FAILED');
    process.exit (1);
  } else {
    log ('note', '\nTest DONE');
    process.exit (0);
  }
});

// prevent errors from killing the process
process.on ('uncaughtException', function (err) {
  console.log (err);
  console.log ();
  console.log (err.stack);
  console.log ();
  errors++;
});

// Queue to prevent flooding
function doNext () {
  next++;
  if (queue [next]) {
    queue [next] ();
  }
}

// doTest( passErr, 'methods', [
//   ['fail', 'feeds', typeof feeds, 'object'],
//   ['warn', 'music', music instanceof Object, true],
//   ['info', 'tracks', music.length]
// ])
function doTest (err, label, tests) {
  var testErrors = [];
  var testWarnings = [];
  var test;
  var i;

  if (err instanceof Error) {
    log ('error', label);
    console.dir (err, { depth: null, colors: true });
    console.log ();
    console.log (err.stack);
    console.log ();
    errors++;
  } else {
    for (i = 0; i < tests.length; i++) {
      test = {
        level: tests [i] [0],
        label: tests [i] [1],
        result: tests [i] [2],
        expect: tests [i] [3]
      };

      switch (test.level) {
        case 'fail':
          if (test.result !== test.expect) {
            testErrors.push (test);
            errors++;
          }
          break;

        case 'warn':
          if (test.result !== test.expect) {
            testWarnings.push (test);
            warnings++;
          }
          break;

        case 'info':
        default:
          log ('info', test.label + ' - ' + test.result);
          break;
      }
    }

    if (!testErrors.length && !testWarnings.length) {
      log ('good', label);
    } else if (testErrors.length) {
      log ('fail', label);
    } else if (testWarnings.length) {
      log ('warn', label);
    }

    if (testErrors.length) {
      testErrors.forEach (function (testpart) {
        log ('fail', ' └ ' + testpart.label + ': \'' + testpart.result + '\' is not \'' + testpart.expect + '\'');
      });
    }

    if (testWarnings.length) {
      testWarnings.forEach (function (testpart) {
        log ('warn', ' └ ' + testpart.label + ': \'' + testpart.result + '\' is not \'' + testpart.expect + '\'');
      });
    }
  }

  doNext ();
}


// Tests
queue.push (function () {
  app.ping (function (err, data) {
    // no api = no tests
    if (err) {
      queue = [];
    }

    doTest (err, 'ping', [
      ['fail', 'typeof data', data instanceof Object, true],
      ['warn', 'data.type', data && data.type, 'PONG']
    ]);
  });
});

queue.push (function () {
  app.writeIndex ('./sampleIndex.dat', function (err, data) {
    doTest (err, 'writeIndex', [
      ['fail', 'typeof data', data instanceof Object, true],
      ['warn', 'data.type', data && data.type, 'INDEX_WRITTEN']
    ]);
  });
});

queue.push (function () {
  app.clearIndex (function (err, data) {
    doTest (err, 'clearIndex', [
      ['fail', 'typeof data', data instanceof Object, true],
      ['warn', 'data.type', data && data.type, 'INDEX_CLEARED']
    ]);
  });
});

queue.push (function () {
  app.loadIndex ('./sampleIndex.dat', function (err, data) {
    doTest (err, 'loadIndex', [
      ['fail', 'typeof data', data instanceof Object, true],
      ['warn', 'data.type', data && data.type, 'INDEX_LOADED']
    ]);
  });
});

queue.push (function () {
  app.addImage (path.join (dir, 'imageSample.jpg'), 999999999999999, function (err, data) {
    doTest (err, 'addImage', [
      ['fail', 'typeof data', data instanceof Object, true],
      ['warn', 'data.type', data && data.type, 'IMAGE_ADDED']
    ]);
  });
});

queue.push (function () {
  app.searchIndex (path.join (dir, 'imageSample.jpg'), function (err, data) {
    doTest (err, 'searchIndex', [
      ['fail', 'typeof data', data instanceof Object, true],
      ['warn', 'data.type', data && data.type, 'SEARCH_RESULTS']
    ]);
  });
});

queue.push (function () {
  app.deleteImage (999999999999999, function (err, data) {
    doTest (err, 'deleteImage', [
      ['fail', 'typeof data', data instanceof Object, true],
      ['warn', 'data.type', data && data.type, 'IMAGE_REMOVED']
    ]);
  });
});


// Start the tests
log ('note', 'Running tests...\n');
log ('note', 'Node.js:  ' + process.versions.node);
log ('note', 'Module:   ' + pkg.version);
console.log ();

queue [0] ();
