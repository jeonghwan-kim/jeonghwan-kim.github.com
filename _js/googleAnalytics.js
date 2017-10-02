const tag = '[ga]'

const googleAnalytics = {
  init(window, document) {
    console.log(tag, 'init()')

    if (!window) throw Error('window is required');
    if (!document) throw Error('document is required');

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-31588166-2', 'auto');
    ga('send', 'pageview');
  }
}

export default googleAnalytics


