"use strict";(self.webpackChunkgatsby_starter_default=self.webpackChunkgatsby_starter_default||[]).push([[28],{9716:function(e,t,n){n.d(t,{Z:function(){return u}});var a=n(1597),r=n(7294),i=n(9),l=n(1524),o=i.default.ul.withConfig({displayName:"style__PostList",componentId:"sc-1msf5pd-0"})(["list-style:none;padding:0;"]),d=i.default.li.withConfig({displayName:"style__PostItem",componentId:"sc-1msf5pd-1"})(["a{text-decoration:none;}margin:"," 0;text-decoration:none;display:block;"],(0,l.d6)(7)),s=i.default.h2.withConfig({displayName:"style__PostTitle",componentId:"sc-1msf5pd-2"})(["color:",";margin-bottom:",";"],l.wL.Primary,(0,l.d6)()),c=i.default.div.withConfig({displayName:"style__PostMeta",componentId:"sc-1msf5pd-3"})(["color:",";"],l.wL.Gray),m=i.default.p.withConfig({displayName:"style__PostSummary",componentId:"sc-1msf5pd-4"})(["color:",";line-height:1.5em;@media (max-width:calc("," - 1px)){display:none;}"],l.wL.Black,l.BM.Tablet),u=function(e){var t=e.posts;return r.createElement(o,{id:"post-list"},t.map((function(e){var t=e.title,n=e.slug,i=e.meta,l=e.excerpt;return r.createElement(d,{key:n},r.createElement(a.Link,{to:n},r.createElement(s,{className:"post-item-title"},t),i&&r.createElement(c,null,i),l&&r.createElement(m,{dangerouslySetInnerHTML:{__html:l}})))})))}},404:function(e,t,n){n.r(t),n.d(t,{default:function(){return w}});var a=n(7294),r=n(1597),i=n(552),l=n(5004),o=n(870),d=n(9716),s=n(9213),c=n(2521),m=n(9),u=n(9746),p=n(1524),f=m.default.ul.withConfig({displayName:"style__CategoryList",componentId:"sc-5gun5j-0"})(["list-style:none;padding-left:0;margin:0;"]),g=m.default.li.withConfig({displayName:"style__CategoryListItem",componentId:"sc-5gun5j-1"})(["a,label{padding:"," ",";display:flex;align-items:center;}label{color:",';font-weight:200;}a{text-decoration:none;&::before{content:"";border-radius:50%;display:inline-block;margin-left:',";margin-right:",";position:absolute;border:solid 0 ",";transition:border-width linear 0.1s;}&.active{&::before{border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:4px;border-bottom-right-radius:4px;height:",";margin-left:",";margin-right:",";width:",";background-color:",";}}&:not(.active):hover{&::before{border-width:4px;transition:border-width linear 0.1s;}}&:hover{background-color:",";color:",";cursor:pointer;}}"],(0,p.d6)(2),(0,p.d6)(4),p.wL.Gray,(0,p.d6)(-3),(0,p.d6)(3),p.wL.Primary,(0,p.d6)(),(0,p.d6)(-4),(0,p.d6)(),(0,p.d6)(3),p.wL.Primary,(0,u.$n)(.4,p.wL.Primary),p.wL.Primary),y=m.default.div.withConfig({displayName:"style__Wrapper",componentId:"sc-5gun5j-2"})(["@media (min-width:","){padding-left:",";}"],p.BM.Tablet,(0,p.d6)(4)),h={series:"연재물",dev:"개발",think:"생각"},b=function(e){var t=e.posts,n=new URLSearchParams(window.location.search).get("key"),m=n?t.filter((function(e){return e.frontmatter.category===n})):t,u=a.createElement(f,null,a.createElement(g,null,a.createElement("label",null,"글분류")),a.createElement(g,null,a.createElement(r.Link,{to:"/category",className:n?"":"active"},"모든글")),Object.keys(h).map((function(e){return a.createElement(g,{key:e},a.createElement(r.Link,{to:"/category?key="+e,className:e===n?"active":""},h[e]))})));return a.createElement(o.lK,{aside:u},a.createElement(c.Z,{title:"분류: "+(h[n]||"모든글")}),a.createElement(y,null,a.createElement(s.Z,{title:a.createElement(a.Fragment,null,a.createElement(l.J,{type:l.T.Article,size:4}),h[n]||"모든글")},a.createElement(d.Z,{posts:m.map((function(e){return{slug:e.fields.slug,title:e.frontmatter.title,meta:a.createElement("time",{dateTime:e.fields.date},(0,i.v)(e.fields.date)),excerpt:e.excerpt}}))}))))},w=function(e){return a.createElement(b,{posts:e.data.allMarkdownRemark.edges.map((function(e){return e.node}))})}}}]);
//# sourceMappingURL=component---src-pages-category-index-tsx-433149d11eb3de0f7c1d.js.map