---
id: 970
title: morgan-helper
date: 2016-02-01T08:29:51+00:00
category: dev
author: Chris
layout: post
guid: http://whatilearn.com/?p=970
permalink: /morgan-helper/
tags:
  - expressjs
summary: Express.JS에서 로깅 기능을 하는 morgan 사용법에 대해 알아본다.
---
Morgan으로 로깅하는데 POST Body도 함께 나오도록 했다.

```javascript
var morgan = require('morgan');

/**
 * morgan wrapper
 * @returns {morgan}
 */
module.exports = function setLogger() {
  // http://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/x329.html
  var red = '\x1B[31m',
      green = '\x1B[32m',
      yellow = '\x1B[33m',
      cyan = '\x1B[36m',
      white = '\x1B[37m',
      endColor = '\033[0m';

  // Redefind method token
  morgan.token('method', function (req, res) {
    var color;

    if (req.method === 'GET')    color = green;
    else if (req.method === 'POST')   color = cyan;
    else if (req.method === 'PUT')    color = yellow;
    else if (req.method === 'DELETE') color = red;
    else                              color = white;

    return color + req.method + endColor;
  });

  // Redefine status token
  morgan.token('status', function (req, res) {
    var color;

    if (res.statusCode < 300)  color = green;
    else if (res.statusCode < 400)  color = cyan;
    else if (res.statusCode < 500)  color = yellow;
    else if (res.statusCode < 600)  color = red;
    else color = white;

    return color + res.statusCode + endColor;
  });

  // Create a token for request body
  morgan.token('body', function (req, res) {
    return white + 'body: ' + JSON.stringify(req.body) + endColor;
  });

  return morgan(':method :url :status :response-time ms :body');
};
```
