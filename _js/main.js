"use strict";

import googleAnalytics from './googleAnalytics';

const tag = '[app]'

const onload = () => {
  console.log(tag, 'DOMContentLoaded')
  googleAnalytics.init(window, document)
};

document.addEventListener('DOMContentLoaded', onload);

