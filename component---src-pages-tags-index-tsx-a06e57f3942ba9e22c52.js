"use strict";(self.webpackChunkgatsby_starter_default=self.webpackChunkgatsby_starter_default||[]).push([[582],{2327:function(e,t,a){a.r(t),a.d(t,{default:function(){return y}});var n=a(1597),l=a(7294),r=a(5728),o=a(5004),i=a(870),s=a(9213),c=a(2521),d=a(9),u=a(1524),m=d.default.div.withConfig({displayName:"style__TagItem",componentId:"sc-16zse1n-0"})([""]),f=d.default.h2.withConfig({displayName:"style__TagName",componentId:"sc-16zse1n-1"})(["a{text-decoration:none;color:",";font-family:",";}"],u.wL.Primary,u.F3.Fixed),g=d.default.ul.withConfig({displayName:"style__TagPostList",componentId:"sc-16zse1n-2"})(["padding-left:20px;list-style:none;"]),p=d.default.li.withConfig({displayName:"style__TagPostItem",componentId:"sc-16zse1n-3"})(["margin-bottom:",";a{text-decoration:none;color:",";&:hover,&:focus{text-decoration:underline;}}"],(0,u.d6)(),u.wL.Black),y=function(e){var t=e.data,a={};t.allMarkdownRemark.nodes.forEach((function(e){var t=e.frontmatter.tags;t&&t.length>0&&t.forEach((function(t){var n=e.frontmatter,l=n.slug,r=n.date,o=n.title;a[t]||(a[t]=[]),a[t].push({link:l,date:r,title:o})}))}));var d=[];for(var y in a)d.push({tag:y,node:a[y]});return d.sort((function(e,t){return e.tag.toLowerCase()>t.tag.toLowerCase()?1:-1})),l.createElement(i.oC,null,l.createElement(c.Z,{title:"태그",url:t.site.siteMetadata.url+"/tags",description:"태그 목록입니다"}),l.createElement(u.W2,{small:!0},l.createElement(s.Z,{title:l.createElement(l.Fragment,null,l.createElement(r.Z,{type:o.T.Tag,size:4}),"태그")},d.map((function(e){return l.createElement(m,{key:e.tag},l.createElement(f,{id:e.tag},l.createElement(n.Link,{to:"#"+e.tag,className:"tag-title-link"},"#",e.tag)),l.createElement(g,null,e.node.sort((function(e,t){return e.date>t.date?-1:1})).map((function(e){return l.createElement(p,{key:e.link},l.createElement(n.Link,{to:e.link},e.title))}))))})))))}}}]);
//# sourceMappingURL=component---src-pages-tags-index-tsx-a06e57f3942ba9e22c52.js.map