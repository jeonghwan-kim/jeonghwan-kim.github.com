/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _googleAnalytics = __webpack_require__(1);

var _googleAnalytics2 = _interopRequireDefault(_googleAnalytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tag = '[app]';

var onload = function onload() {
  console.log(tag, 'DOMContentLoaded');
  _googleAnalytics2.default.init(window, document);

  var post = document.querySelector('#post');
  var postList = document.querySelector('#post-list');
  if (post || postList) {
    var el = post || postList;
    el.addEventListener('click', function (evt) {
      _googleAnalytics2.default.sendEvent({
        category: 'Tag',
        action: 'Click in ' + (post ? 'post' : 'post list'),
        label: evt.target.dataset.tagName
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', onload);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var tag = '[ga]';

var googleAnalytics = {
  init: function init(window, document) {
    console.log(tag, 'init()');

    if (!window) throw Error('window is required');
    if (!document) throw Error('document is required');

    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-31588166-2', 'auto');
    ga('send', 'pageview');
  },
  sendEvent: function sendEvent(_ref) {
    var category = _ref.category,
        action = _ref.action,
        label = _ref.label,
        value = _ref.value;

    if (!category || !action) return;
    if (typeof ga !== 'function') return;

    ga('send', 'event', category, action, label, value);
    console.log(tag, 'ga(\'send\', \'event\', \'' + category + '\', \'' + action + '\', \'' + label + '\', \'' + value + '\')');
  }
};

exports.default = googleAnalytics;

/***/ })
/******/ ]);