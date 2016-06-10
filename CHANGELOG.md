### 1.2.0 (2016-6-10)

##### Chores

* **jsdoc:** Describe authkey setting ([2bd3250b](https://github.com/fvdm/nodejs-pastecapi/commit/2bd3250b297a5d8952376b21a5c17e12eb824a83))
* **package:** Update dependency versions ([721c7548](https://github.com/fvdm/nodejs-pastecapi/commit/721c7548a6fc76c288a3707830eeb57ee2fba026))

##### Documentation Changes

* **badges:**
  * Add coverage status ([4ea5f0de](https://github.com/fvdm/nodejs-pastecapi/commit/4ea5f0de33b4915aad64028eea5348bdc12a3154))
  * Deeplink Gemnasium to dependencies tab ([1cf59c05](https://github.com/fvdm/nodejs-pastecapi/commit/1cf59c05efa1ee82cf28c84628eb643a0d57716b))
  * Add npm version for changelog ([dfa280a2](https://github.com/fvdm/nodejs-pastecapi/commit/dfa280a230934ea6a6fbc7405711bb4e8ebd0117))

##### New Features

* **http:** Add authkey support ([cdcde5d2](https://github.com/fvdm/nodejs-pastecapi/commit/cdcde5d273ad28fb71bf4e8befbff97d88f31bd0))

##### Bug Fixes

* **style:** Consistent returns ([219316f7](https://github.com/fvdm/nodejs-pastecapi/commit/219316f79cb5fd7580acfbd0a402a15f4088a42a))
* **main:** Cleaner, consistent returns ([e25e38e8](https://github.com/fvdm/nodejs-pastecapi/commit/e25e38e80d41d0748e3364ea125b51a415678a67))
* **errors:** Catch invalid authkey error ([bf506260](https://github.com/fvdm/nodejs-pastecapi/commit/bf506260c4e5c4f335e0e7efeec5086ccc2927aa))

##### Other Changes

* **undefined:**
  * dependencies badge ([46819656](https://github.com/fvdm/nodejs-pastecapi/commit/46819656131dc7937f4776c4d93a32b20b6c509a))
  * cleaner author line ([54a167d8](https://github.com/fvdm/nodejs-pastecapi/commit/54a167d8bd9530cda8a72bb60424239be42b7d78))
  * updated versions ([55261afa](https://github.com/fvdm/nodejs-pastecapi/commit/55261afa45761be145de9fa884a0e43678bc4f00))
  * always run both test commands ([83170080](https://github.com/fvdm/nodejs-pastecapi/commit/83170080691af86e359131c9e25abf72868f9aed))

##### Refactors

* **cleanup:**
  * Moved processResponse errors to function ([7b9e66ed](https://github.com/fvdm/nodejs-pastecapi/commit/7b9e66edb0bac14003ccbb80db1f55ae7cde591a))
  * Moved talk() response to function ([94e210af](https://github.com/fvdm/nodejs-pastecapi/commit/94e210af3998fd96708449288a378b6969a1f296))

##### Tests

* **fix:**
  * Fixed missing fs module ([0c9f6500](https://github.com/fvdm/nodejs-pastecapi/commit/0c9f650088d09bf69ad1a5b59cf27b01e3d87d6f))
  * Fixed bad ref to errFile ([d6126feb](https://github.com/fvdm/nodejs-pastecapi/commit/d6126feb693d0f184a8129ca58db090e6dc6822e))
  * err.error is an Error instance ([054075db](https://github.com/fvdm/nodejs-pastecapi/commit/054075db4b6d1d1da8da82f44757c888db8bf2a0))
  * Set only two args without authkey ([d4d66631](https://github.com/fvdm/nodejs-pastecapi/commit/d4d6663144f8257f41c5054faae06570d41d164f))
  * All tests should run ([b0b53446](https://github.com/fvdm/nodejs-pastecapi/commit/b0b534469c41bd3bb20dd4a6bbafbd33c36188ff))
  * Fixed incomplete invalid authkey check ([15865eb8](https://github.com/fvdm/nodejs-pastecapi/commit/15865eb88d6bcb82cf552257c6e79cddade18bf2))
* **tests:**
  * Add method searchIndex buffer and error ([44bc5a38](https://github.com/fvdm/nodejs-pastecapi/commit/44bc5a389bd1046bb5f5c7b368a22e7c44445396))
  * Add method addImage - error ([1626192c](https://github.com/fvdm/nodejs-pastecapi/commit/1626192c9028dd79ef83f71228636bcea2cbbbf8))
  * Add method addImage buffer test ([07ee8aec](https://github.com/fvdm/nodejs-pastecapi/commit/07ee8aec999120090cc626e44253eb2915f73a31))
  * Add error request failed for timeout ([f46db0b7](https://github.com/fvdm/nodejs-pastecapi/commit/f46db0b76e995bf7f5482918cc51e54fbacd2c78))
  * Add invalid authkey error test ([60f83acb](https://github.com/fvdm/nodejs-pastecapi/commit/60f83acb0ecdf67267408d81e700c8a94d5b4607))
* **cleanup:** Use doTest test() alias ([ed49936e](https://github.com/fvdm/nodejs-pastecapi/commit/ed49936e8a8432c8d51d798cacef17a15987ad0d))
* **package:** Add coverage deps, test runner ([e04032b2](https://github.com/fvdm/nodejs-pastecapi/commit/e04032b257f2ad8377b12c5b59197929bfff78d6))
* **runner:** Add test.sh runner ([fedcc55b](https://github.com/fvdm/nodejs-pastecapi/commit/fedcc55b6fa1272f21411bf5a0c5bb775bae82ae))
* **script:** Add PASTEC_AUTHKEY env var ([0b3b2b12](https://github.com/fvdm/nodejs-pastecapi/commit/0b3b2b12a9a1741e3bdeb073ceb167ed72931532))
* **undefined:** add node v6 to Travis config ([673b41dc](https://github.com/fvdm/nodejs-pastecapi/commit/673b41dcde6e3077a9a433989df750f08beeea76))

