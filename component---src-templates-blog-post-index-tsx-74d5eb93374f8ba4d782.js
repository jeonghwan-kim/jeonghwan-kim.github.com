(self.webpackChunkjeonghwan_kim_github_io=self.webpackChunkjeonghwan_kim_github_io||[]).push([[505],{8538:function(e,t,n){n(5743),e.exports=function(){"use strict";var e=1e3,t=6e4,n=36e5,i="millisecond",r="second",o="minute",a="hour",l="day",s="week",c="month",d="quarter",u="year",f="date",m="Invalid Date",h=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,p=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,g={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],n=e%100;return"["+e+(t[(n-20)%10]||t[n]||t[0])+"]"}},v=function(e,t,n){var i=String(e);return!i||i.length>=t?e:""+Array(t+1-i.length).join(n)+e},y={s:v,z:function(e){var t=-e.utcOffset(),n=Math.abs(t),i=Math.floor(n/60),r=n%60;return(t<=0?"+":"-")+v(i,2,"0")+":"+v(r,2,"0")},m:function e(t,n){if(t.date()<n.date())return-e(n,t);var i=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(i,c),o=n-r<0,a=t.clone().add(i+(o?-1:1),c);return+(-(i+(n-r)/(o?r-a:a-r))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return{M:c,y:u,w:s,d:l,D:f,h:a,m:o,s:r,ms:i,Q:d}[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}},w="en",b={};b[w]=g;var x=function(e){return e instanceof E},_=function e(t,n,i){var r;if(!t)return w;if("string"==typeof t){var o=t.toLowerCase();b[o]&&(r=o),n&&(b[o]=n,r=o);var a=t.split("-");if(!r&&a.length>1)return e(a[0])}else{var l=t.name;b[l]=t,r=l}return!i&&r&&(w=r),r||!i&&w},$=function(e,t){if(x(e))return e.clone();var n="object"==typeof t?t:{};return n.date=e,n.args=arguments,new E(n)},k=y;k.l=_,k.i=x,k.w=function(e,t){return $(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})};var E=function(){function g(e){this.$L=_(e.locale,null,!0),this.parse(e)}var v=g.prototype;return v.parse=function(e){this.$d=function(e){var t=e.date,n=e.utc;if(null===t)return new Date(NaN);if(k.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var i=t.match(h);if(i){var r=i[2]-1||0,o=(i[7]||"0").substring(0,3);return n?new Date(Date.UTC(i[1],r,i[3]||1,i[4]||0,i[5]||0,i[6]||0,o)):new Date(i[1],r,i[3]||1,i[4]||0,i[5]||0,i[6]||0,o)}}return new Date(t)}(e),this.$x=e.x||{},this.init()},v.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},v.$utils=function(){return k},v.isValid=function(){return!(this.$d.toString()===m)},v.isSame=function(e,t){var n=$(e);return this.startOf(t)<=n&&n<=this.endOf(t)},v.isAfter=function(e,t){return $(e)<this.startOf(t)},v.isBefore=function(e,t){return this.endOf(t)<$(e)},v.$g=function(e,t,n){return k.u(e)?this[t]:this.set(n,e)},v.unix=function(){return Math.floor(this.valueOf()/1e3)},v.valueOf=function(){return this.$d.getTime()},v.startOf=function(e,t){var n=this,i=!!k.u(t)||t,d=k.p(e),m=function(e,t){var r=k.w(n.$u?Date.UTC(n.$y,t,e):new Date(n.$y,t,e),n);return i?r:r.endOf(l)},h=function(e,t){return k.w(n.toDate()[e].apply(n.toDate("s"),(i?[0,0,0,0]:[23,59,59,999]).slice(t)),n)},p=this.$W,g=this.$M,v=this.$D,y="set"+(this.$u?"UTC":"");switch(d){case u:return i?m(1,0):m(31,11);case c:return i?m(1,g):m(0,g+1);case s:var w=this.$locale().weekStart||0,b=(p<w?p+7:p)-w;return m(i?v-b:v+(6-b),g);case l:case f:return h(y+"Hours",0);case a:return h(y+"Minutes",1);case o:return h(y+"Seconds",2);case r:return h(y+"Milliseconds",3);default:return this.clone()}},v.endOf=function(e){return this.startOf(e,!1)},v.$set=function(e,t){var n,s=k.p(e),d="set"+(this.$u?"UTC":""),m=(n={},n[l]=d+"Date",n[f]=d+"Date",n[c]=d+"Month",n[u]=d+"FullYear",n[a]=d+"Hours",n[o]=d+"Minutes",n[r]=d+"Seconds",n[i]=d+"Milliseconds",n)[s],h=s===l?this.$D+(t-this.$W):t;if(s===c||s===u){var p=this.clone().set(f,1);p.$d[m](h),p.init(),this.$d=p.set(f,Math.min(this.$D,p.daysInMonth())).$d}else m&&this.$d[m](h);return this.init(),this},v.set=function(e,t){return this.clone().$set(e,t)},v.get=function(e){return this[k.p(e)]()},v.add=function(i,d){var f,m=this;i=Number(i);var h=k.p(d),p=function(e){var t=$(m);return k.w(t.date(t.date()+Math.round(e*i)),m)};if(h===c)return this.set(c,this.$M+i);if(h===u)return this.set(u,this.$y+i);if(h===l)return p(1);if(h===s)return p(7);var g=(f={},f[o]=t,f[a]=n,f[r]=e,f)[h]||1,v=this.$d.getTime()+i*g;return k.w(v,this)},v.subtract=function(e,t){return this.add(-1*e,t)},v.format=function(e){var t=this,n=this.$locale();if(!this.isValid())return n.invalidDate||m;var i=e||"YYYY-MM-DDTHH:mm:ssZ",r=k.z(this),o=this.$H,a=this.$m,l=this.$M,s=n.weekdays,c=n.months,d=function(e,n,r,o){return e&&(e[n]||e(t,i))||r[n].slice(0,o)},u=function(e){return k.s(o%12||12,e,"0")},f=n.meridiem||function(e,t,n){var i=e<12?"AM":"PM";return n?i.toLowerCase():i},h={YY:String(this.$y).slice(-2),YYYY:this.$y,M:l+1,MM:k.s(l+1,2,"0"),MMM:d(n.monthsShort,l,c,3),MMMM:d(c,l),D:this.$D,DD:k.s(this.$D,2,"0"),d:String(this.$W),dd:d(n.weekdaysMin,this.$W,s,2),ddd:d(n.weekdaysShort,this.$W,s,3),dddd:s[this.$W],H:String(o),HH:k.s(o,2,"0"),h:u(1),hh:u(2),a:f(o,a,!0),A:f(o,a,!1),m:String(a),mm:k.s(a,2,"0"),s:String(this.$s),ss:k.s(this.$s,2,"0"),SSS:k.s(this.$ms,3,"0"),Z:r};return i.replace(p,(function(e,t){return t||h[e]||r.replace(":","")}))},v.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},v.diff=function(i,f,m){var h,p=k.p(f),g=$(i),v=(g.utcOffset()-this.utcOffset())*t,y=this-g,w=k.m(this,g);return w=(h={},h[u]=w/12,h[c]=w,h[d]=w/3,h[s]=(y-v)/6048e5,h[l]=(y-v)/864e5,h[a]=y/n,h[o]=y/t,h[r]=y/e,h)[p]||y,m?w:k.a(w)},v.daysInMonth=function(){return this.endOf(c).$D},v.$locale=function(){return b[this.$L]},v.locale=function(e,t){if(!e)return this.$L;var n=this.clone(),i=_(e,t,!0);return i&&(n.$L=i),n},v.clone=function(){return k.w(this.$d,this)},v.toDate=function(){return new Date(this.valueOf())},v.toJSON=function(){return this.isValid()?this.toISOString():null},v.toISOString=function(){return this.$d.toISOString()},v.toString=function(){return this.$d.toUTCString()},g}(),C=E.prototype;return $.prototype=C,[["$ms",i],["$s",r],["$m",o],["$H",a],["$W",l],["$M",c],["$y",u],["$D",f]].forEach((function(e){C[e[1]]=function(t){return this.$g(t,e[0],e[1])}})),$.extend=function(e,t){return e.$i||(e(t,E,$),e.$i=!0),$},$.locale=_,$.isDayjs=x,$.unix=function(e){return $(1e3*e)},$.en=b[w],$.Ls=b,$.p={},$}()},5837:function(e,t,n){var i=n(2109),r=n(7854);i({global:!0,forced:r.globalThis!==r},{globalThis:r})},5743:function(e,t,n){n(5837)},8409:function(e,t,n){"use strict";var i=n(6556),r=["eventCategory","eventAction","eventLabel","eventValue"],o=n(4836);t.I=function(e){var t=e.category,n=e.action,i=e.label,r=e.value,o=e.nonInteraction,a=void 0!==o&&o,l=e.transport,s=e.hitCallback,d=e.callbackTimeout,u=void 0===d?1e3:d;if("undefined"!=typeof window&&window.ga){var f={eventCategory:t,eventAction:n,eventLabel:i,eventValue:r,nonInteraction:a,transport:l};s&&"function"==typeof s&&(f.hitCallback=c(s,u)),window.ga("send","event",f)}};var a=o(n(434)),l=o(n(7294)),s=o(n(5697)),c=function(e,t){void 0===t&&(t=1e3);var n=!1,i=function(){n||(n=!0,e())};return setTimeout(i,t),i};function d(e){var t=e.eventCategory,n=e.eventAction,o=e.eventLabel,s=e.eventValue,c=i(e,r);return l.default.createElement("a",(0,a.default)({},c,{onClick:function(i){"function"==typeof e.onClick&&e.onClick(i);var r=!0;return(0!==i.button||i.altKey||i.ctrlKey||i.metaKey||i.shiftKey||i.defaultPrevented)&&(r=!1),e.target&&"_self"!==e.target.toLowerCase()&&(r=!1),window.ga?window.ga("send","event",{eventCategory:t||"Outbound Link",eventAction:n||"click",eventLabel:o||e.href,eventValue:s,transport:r?"beacon":"",hitCallback:function(){r&&(document.location=e.href)}}):r&&(document.location=e.href),!1}}))}d.propTypes={href:s.default.string,target:s.default.string,eventCategory:s.default.string,eventAction:s.default.string,eventLabel:s.default.string,eventValue:s.default.number,onClick:s.default.func}},4849:function(e,t,n){"use strict";n.d(t,{v:function(){return o}});var i=n(8538),r=n.n(i),o=function(e,t){return void 0===t&&(t="YYYY년 MM월 DD일"),r()(e).format(t)}},2070:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return ee}});var i,r,o=n(7294),a=n(6906),l=n(278),s=n(5994),c=n(4849),d=n(4736),u=n(1777),f={src:"https://utteranc.es/client.js",repo:"jeonghwan-kim/jeonghwan-kim.github.com","issue-term":"pathname",label:"Comment",theme:"github-light",crossOrigin:"anonymous",async:"true"},m=function(){function e(){}var t=e.prototype;return t.load=function(e,t){e.children.length>0&&(e.innerHTML="");var n=this.createScriptElement(Object.assign({},f,{theme:"github-"+t}));e.appendChild(n)},t.createScriptElement=function(e){var t=document.createElement("script");return Object.entries(e).forEach((function(e){var n=e[0],i=e[1];t.setAttribute(n,i)})),t},e}(),h=new m,p=function(){var e=(0,o.useRef)(null),t=h,n=function(n){void 0===n&&(n="light"),e.current&&t.load(e.current,n)};return(0,o.useEffect)((function(){return u.a.on(n),function(){u.a.off(n)}}),[]),o.createElement("div",{id:"utteranc-comments",ref:e})},g=n(1082),v=n(3494);!function(e){e.Primary="Primary",e.Secondary="Secondary"}(r||(r={}));var y=((i={})[r.Primary]=d.wL.Primary,i[r.Secondary]=d.wL.Secondary,i),w=v.default.button.withConfig({displayName:"style__Button",componentId:"sc-29k00d-0"})(["display:inline-block;padding:"," ",";border-radius:4px;background-color:",";text-decoration:none;color:",";border:solid 1px ",";transition:all 0.1s ease-in-out;&:focus,&:hover{background-color:",";color:",";cursor:pointer;}"],(0,d.d6)(),(0,d.d6)(2),d.wL.Background1,(function(e){return y[e.type]}),(function(e){return y[e.type]}),(function(e){return y[e.type]}),d.wL.Background1),b=(0,v.default)(w).withConfig({displayName:"style__ButtonLink",componentId:"sc-29k00d-1"})(["padding:0;a{display:inline-block;padding:"," ",";text-decoration:none;color:inherit;}"],(0,d.d6)(),(0,d.d6)(2)),x=function(e){var t=e.type,n=e.link,i=e.to,r=e.children,a=e.onClick;return n?o.createElement(b,{type:t},o.createElement(g.Link,{to:i,onClick:function(){return a}},r)):o.createElement(w,{type:t,onClick:function(){return a()}},r)},_=n(9051),$=n.p+"static/icon-video-2-6bc9f1ce0df6096292af69fbf5e55ab9.png",k=v.default.main.withConfig({displayName:"style__Main",componentId:"sc-m5hfiz-0"})(["display:flex;align-items:flex-start;margin-top:",";@media (max-width:","){margin-top:",";}@media (max-width:","){margin-top:",";}"],(0,d.d6)(10),d.BM.Tablet,(0,d.d6)(5),d.BM.Mobile,(0,d.d6)(2)),E=v.default.aside.withConfig({displayName:"style__Aside",componentId:"sc-m5hfiz-1"})(["order:1;width:250px;position:sticky;max-height:100vh;overflow-y:scroll;top:",";margin-left:",";padding-bottom:",";@media (max-width:calc("," - 1px)){display:none;}"],(0,d.d6)(),(0,d.d6)(4),(0,d.d6)(),d.BM.Desktop),C=v.default.article.withConfig({displayName:"style__Article",componentId:"sc-m5hfiz-2"})(["order:0;flex:1 0 0%;min-width:0%;"]),S=v.default.header.withConfig({displayName:"style__PostHeader",componentId:"sc-m5hfiz-3"})(["margin-bottom:",";"],(0,d.d6)(7)),M=v.default.h1.withConfig({displayName:"style__PostTitle",componentId:"sc-m5hfiz-4"})(["margin-top:0;margin-bottom:",";color:",";font-size:42px;"],(0,d.d6)(),d.wL.Foreground1),N=v.default.time.withConfig({displayName:"style__PostTime",componentId:"sc-m5hfiz-5"})(["color:",";"],d.wL.Foreground3),L=v.default.div.withConfig({displayName:"style__PostContent",componentId:"sc-m5hfiz-6"})(["font-size:18px;line-height:1.8em;font-family:",";word-break:break-word;h1{font-size:200%;margin-top:1.5em;}h2{font-size:160%;margin-top:1.5em;}h3{font-size:120%;margin-top:1.5em;}h4{font-size:110%;margin-top:1.5em;}h5{font-size:100%;margin-top:1.5em;}h1,h2,h3,h4,h5,h6{color:",";font-family:",";line-height:1em;}img{border-radius:",";display:block;margin:"," * 2 auto;max-width:100%;}blockquote{color:",';position:relative;&::before{content:"“";position:absolute;left:-',";font-size:40px;color:",";}a{color:",";}}figcaption{font-size:14px;color:",';text-align:center;}code:not([class^="language-"]){font-size:0.8em;background-color:',";border-radius:6px;padding:2px 6px;word-break:break-all;}hr{border:none;height:1px;background-color:",";margin:"," 0;}.gatsby-highlight{pre{border-radius:"," / 2;overflow:auto;word-wrap:normal;white-space:pre;}}"],d.F3.Article,d.wL.Foreground2,d.F3.Base,(0,d.d6)(.5),(0,d.d6)(),d.wL.Foreground3,(0,d.d6)(3),d.wL.Foreground3,d.wL.Foreground3,d.wL.Foreground3,d.wL.Background2,d.wL.Foreground4,(0,d.d6)(4),(0,d.d6)()),I=v.default.div.withConfig({displayName:"style__PostMeta",componentId:"sc-m5hfiz-7"})(["margin-top:",";"],(0,d.d6)(4)),O=(v.default.ul.withConfig({displayName:"style__ShareList",componentId:"sc-m5hfiz-8"})(["list-style:none;padding-left:0;"]),v.default.li.withConfig({displayName:"style__ShareItem",componentId:"sc-m5hfiz-9"})(["display:inline-block;margin-right:",";&:last-child{margin-right:0;}"],(0,d.d6)()),v.default.ul.withConfig({displayName:"style__TagList",componentId:"sc-m5hfiz-10"})(["list-style:none;padding-left:0;"])),D=v.default.li.withConfig({displayName:"style__TagItem",componentId:"sc-m5hfiz-11"})(["display:inline-block;margin-right:",";&:last-child{margin-right:0;}"],(0,d.d6)()),z=v.default.div.withConfig({displayName:"style__Toc",componentId:"sc-m5hfiz-12"})(["border-left:",";ul{padding-left:",";list-style:none;margin:0;li{margin-bottom:4px;p{margin:0;}a{text-decoration:none;color:",";font-size:14px;&:hover,&:focus{color:",";}&.active{color:",";font-weight:bold;}}}}"],(0,d.OC)(2),(0,d.d6)(2),d.wL.Foreground3,d.wL.Foreground1,d.wL.Foreground1),T=v.default.div.withConfig({displayName:"style__PostVideo",componentId:"sc-m5hfiz-13"})(["a{display:block;position:relative;overflow:hidden;img{width:100%;transition:all 0.3s ease;}&:hover{img{transform:scale(1.2);}}.post-video-overlay{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;flex-direction:column;.video-icon-wrapper{flex:1;display:flex;align-items:center;justify-content:center;.video-icon{background:url(",") no-repeat;background-position:center center;background-size:50px 50px;opacity:0.7;width:100px;height:100px;border-radius:50%;background-color:rgba(0,0,0,0.3);}}.post-video-title{background:rgba(0,0,0,0.3);color:white;padding:8px;text-align:center;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:14px;}}}"],$),A=v.default.div.withConfig({displayName:"style__SeriesNav",componentId:"sc-m5hfiz-14"})(["padding:"," ",";border-left:",";"],(0,d.d6)(3),(0,d.d6)(2),(0,d.OC)(2)),P=v.default.div.withConfig({displayName:"style__SeriesNavTitle",componentId:"sc-m5hfiz-15"})(["font-weight:bold;margin-bottom:",';&::before{content:"연재물";display:block;font-size:14px;color:',";font-weight:normal;}.series-order{font-weight:normal;.active{font-weight:bold;}}"],(0,d.d6)(),d.wL.Foreground3),F=v.default.div.withConfig({displayName:"style__SeriesNavControls",componentId:"sc-m5hfiz-16"})(["display:flex;"]),Y=v.default.span.withConfig({displayName:"style__SeriesNavPrev",componentId:"sc-m5hfiz-17"})(["display:inline-block;flex:1 0 50%;text-align:left;"]),j=(0,v.default)(Y).withConfig({displayName:"style__SeriesNavNext",componentId:"sc-m5hfiz-18"})(["text-align:right;"]),H=v.default.div.withConfig({displayName:"style__SeriesNavigator",componentId:"sc-m5hfiz-19"})(["padding:"," "," ",";border-top:",";border-bottom:",";.flex{flex-flow:row;}.controls{flex:0 0 100px;text-align:right;a{text-decoration:none;}}.series-title{margin-top:",';&::before{content:"이 연재물 더보기";display:block;font-size:14px;color:',";font-weight:normal;}}.post-list{line-height:1.5em;a{display:inline-block;width:100%;text-decoration:none;&:hover,&:focus{text-decoration:underline;}}li{list-style:circle;&.active{list-style:unset;font-weight:bold;}}}"],(0,d.d6)(3),(0,d.d6)(2),(0,d.d6)(2),(0,d.OC)(2),(0,d.OC)(2),(0,d.d6)(),d.wL.Foreground3),B=v.default.div.withConfig({displayName:"style__SiblingNav",componentId:"sc-m5hfiz-20"})(["display:flex;justify-content:space-between;"]),W=v.default.div.withConfig({displayName:"style__SiblingNavItem",componentId:"sc-m5hfiz-21"})(["max-width:33.3333%;@media (max-width:","){max-width:48%;}.label{color:",";}a{text-decoration:none;color:",";i{}h3{margin-top:",";margin-bottom:",";}}"],d.BM.Tablet,d.wL.Foreground3,d.wL.Primary,(0,d.d6)(),(0,d.d6)()),V=function(e){var t=e.tags;return o.createElement(O,null,t.map((function(e){return o.createElement(D,{key:e},o.createElement(x,{type:r.Secondary,link:!0,to:_.y.Posts+"?"+_.S.Tag+"="+encodeURIComponent(e)},"#",e))})))},R=function(){function e(e,t,n){var i=this;this.targets=Array.from(e.querySelectorAll("a")),this.refs=t,this.sensitivity=n||-10,window.addEventListener("scroll",(function(){return i.onScroll()}))}var t=e.prototype;return t.onScroll=function(){var e=this;this.isOnTopOfDoc(this.refs[0])||this.deactiveateTarget(),this.refs.forEach((function(t){if(e.isOnTopOfDoc(t)){e.deactiveateTarget();var n=e.findTarget(t.id);n&&e.activate(n)}}))},t.isOnTopOfDoc=function(e){return document.documentElement.scrollTop-e.offsetTop>=this.sensitivity},t.deactiveateTarget=function(){var e=this;this.targets.forEach((function(t){return e.deactivate(t)}))},t.findTarget=function(e){return this.targets.filter((function(t){return decodeURIComponent(t.attributes.href.value.replace(/^#/,""))===e}))[0]},t.activate=function(e){e.classList.add("active")},t.deactivate=function(e){e.classList.remove("active")},e}(),Z=function(e){var t=e.tableOfContents;return(0,o.useEffect)((function(){var e=document.querySelector("#post-content"),t=Array.from(e.querySelectorAll("h1,h2,h3,h4,h5,h6")).filter((function(e){return e.id})),n=document.querySelector("#post-toc");new R(n,t)}),[]),o.createElement(z,{id:"post-toc",dangerouslySetInnerHTML:{__html:t}})},U=n(8409),q=function(e){var t=e.video;return o.createElement(T,null,o.createElement("a",{id:"post-video",href:t.url,target:"_blank",title:'"'+t.title+'" 영상 보기',onClick:function(e){(0,U.I)({category:"포스트/관련영상",action:"click",label:t.title})}},o.createElement("img",{src:t.thumb}),o.createElement("div",{className:"post-video-overlay"},o.createElement("div",{className:"video-icon-wrapper"},o.createElement("div",{className:"video-icon"})),o.createElement("div",{className:"post-video-title"},t.title?t.title:"영상 더보기"," »"))))},J=function(e){var t=e.title,n=e.datetime;return o.createElement(S,null,o.createElement(M,{itemProp:"name headline"},t),o.createElement(N,{itemProp:"datePublished"},n))},K=function(e){var t,n,i=e.series,a=e.posts,l=e.nodeId,s=e.lite,c=e.className,d=a.findIndex((function(e){return e.id===l})),u=0===d?null:a[d-1],f=d===a.length?null:a[d+1];return s?o.createElement(A,{className:""+(c||"")},o.createElement(P,null,i,o.createElement("span",{className:"series-order"},"(",o.createElement("span",{className:"active"},d+1),"/",a.length,")")),o.createElement(F,null,u&&o.createElement(Y,null,o.createElement(x,{link:!0,type:r.Secondary,to:null===(t=u.frontmatter)||void 0===t?void 0:t.slug},"« 이전")),f&&o.createElement(j,null,o.createElement(x,{link:!0,type:r.Secondary,to:null===(n=f.frontmatter)||void 0===n?void 0:n.slug},"다음 »")))):o.createElement(H,{className:""+(c||"")},o.createElement("h3",{className:"series-title"},i),o.createElement("div",{className:"post-list"},o.createElement("ul",null,a.map((function(e){var t,n,i=e.id===l;return o.createElement("li",{className:i?"active":"",key:null===(t=e.frontmatter)||void 0===t?void 0:t.slug},i?o.createElement("div",{className:"active"},e.frontmatter.title):o.createElement(g.Link,{to:null===(n=e.frontmatter)||void 0===n?void 0:n.slug},e.frontmatter.title))})))))},Q=function(e){var t={textAlign:e.align};return"left"===e.align?t.marginLeft=16:t.marginRight=16,o.createElement(W,null,o.createElement("div",{className:"label",style:t},e.label),o.createElement(g.Link,{to:e.url},o.createElement("div",{className:"flex"},"left"===e.align&&o.createElement("i",{style:{marginRight:8}},e.icon),o.createElement("h3",{style:{textAlign:e.align}},e.text),"right"===e.align&&o.createElement("i",{style:{marginLeft:8}},e.icon))))},G=function(e){return o.createElement(B,null,e.previous&&o.createElement(Q,{label:"이전글",align:"left",icon:"«",text:e.previous.frontmatter.title,url:e.previous.frontmatter.slug}),e.next&&o.createElement(Q,{label:"다음글",align:"right",icon:"»",text:""+e.next.frontmatter.title,url:e.next.frontmatter.slug}))},X=n(3818),ee=function(e){var t,n,i,r=e.data,u=e.pageContext,f=r.site,m=r.markdownRemark,h=r.video,g=m.frontmatter.series,v=u.previous,y=u.next,w=m.tableOfContents||g||h;return o.createElement(a.oC,null,o.createElement(s.Z,{title:m.frontmatter.title,description:m.excerpt,date:m.frontmatter.date,url:f.siteMetadata.url+m.frontmatter.slug,image:null===(t=m.frontmatter.featuredImage)||void 0===t||null===(n=t.childImageSharp)||void 0===n||null===(i=n.fixed)||void 0===i?void 0:i.src}),o.createElement(X.Z,null),o.createElement(d.W2,{small:!w},o.createElement("div",{itemScope:!0,itemType:"http://schema.org/BlogPosting"},o.createElement(l.Z,null,o.createElement(k,null,w&&o.createElement(E,null,m.tableOfContents&&o.createElement(Z,{tableOfContents:m.tableOfContents}),g&&o.createElement(K,{lite:!0,series:g,nodeId:m.id,posts:r.allMarkdownRemark.nodes}),h&&o.createElement(q,{video:h})),o.createElement(C,null,o.createElement(J,{title:m.frontmatter.title,datetime:(0,c.v)(m.frontmatter.date)}),o.createElement(L,{id:"post-content",itemProp:"articleBody",dangerouslySetInnerHTML:{__html:m.html}}),o.createElement(I,null,(m.frontmatter.tags||[]).length>0&&o.createElement(V,{tags:m.frontmatter.tags}))))),o.createElement(l.Z,null,o.createElement(d.W2,{small:!0},o.createElement("footer",null,o.createElement(G,{previous:v,next:y}),g&&o.createElement(K,{className:"mb-4",series:g,nodeId:m.id,posts:r.allMarkdownRemark.nodes}),o.createElement(p,null)))))))}},434:function(e){function t(){return e.exports=t=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},e.exports.__esModule=!0,e.exports.default=e.exports,t.apply(this,arguments)}e.exports=t,e.exports.__esModule=!0,e.exports.default=e.exports},6556:function(e){e.exports=function(e,t){if(null==e)return{};var n,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)n=o[i],t.indexOf(n)>=0||(r[n]=e[n]);return r},e.exports.__esModule=!0,e.exports.default=e.exports}}]);
//# sourceMappingURL=component---src-templates-blog-post-index-tsx-74d5eb93374f8ba4d782.js.map