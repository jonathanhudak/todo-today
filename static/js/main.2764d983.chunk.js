(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{116:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(42),c=n.n(o),i=n(17),u=n(5),l=n(1),s=n(9),d=n.n(s),f=n(24),v=n(7),b=n(2),h=n(6),m=n.n(h),g=n(4),y=n.n(g),p=n(25),O=n.n(p);var j=n(52).Dropbox,E="dbdbtoken";function w(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"dbdb.json";return new File([JSON.stringify(e,null,2)],t,{type:"text/json",lastModified:(new Date).getTime()})}var k=function(e){var t,n=e.databaseFileName,a=void 0===n?"dbdb":n,r=e.databaseDirectoryPath,o=void 0===r?"/":r,c=e.authRedirect,i=void 0===c?window.location.origin:c,u=e.clientId,s=e.fetchMethod,d=void 0===s?O.a:s,f=e.tokenKey,v=void 0===f?E:f,b="".concat(a,".json"),h="".concat(o).concat(b);function m(){return t}function g(){return function(e){var t=Object.create(null);return"string"!==typeof e?t:(e=e.trim().replace(/^(\?|#|&)/,""))?(e.split("&").forEach(function(e){var n=e.replace(/\+/g," ").split("="),a=n.shift(),r=n.length>0?n.join("="):void 0;a=decodeURIComponent(a),r=void 0===r?null:decodeURIComponent(r),void 0===t[a]?t[a]=r:Array.isArray(t[a])?t[a].push(r):t[a]=[t[a],r]}),t):t}(window.location.hash).access_token}return{authUrl:new j({clientId:u,fetch:O.a}).getAuthenticationUrl(i),createClient:function(){var e=sessionStorage.getItem(v),n=e||g();if(!e&&n&&sessionStorage.setItem(v,n),n)return t=new j({accessToken:n,fetch:d}),m()},getClient:m,logOutDropbox:function(){t=void 0,window.sessionStorage.removeItem(v)},readDatabase:function(){return new Promise(function(e,n){t||e(),t.filesSearch({path:"",query:b}).then(function(n){var a=n.matches;if(a&&a.length){var r=Object(l.a)(a,1)[0];t.filesDownload({path:r.metadata.path_display}).then(function(t){var n=new FileReader;n.onload=function(){e(JSON.parse(this.result))},n.readAsText(t.fileBlob)})}else console.warn("no db found"),e()})})},saveDatabase:function(e){var n=e.data,a=e.databaseName;!function(e){var t=e.client,n=e.path,a=e.file;t&&t.filesUpload({path:n,contents:a,mode:"overwrite"})}({client:t,file:w(n,a),path:h})}}},x=Object(a.createContext)(),D=function(e,t){return Object(b.a)({},e,t)},T=Object(a.createContext)(),S=k({clientId:"uaqu46389soi02n",authRedirect:"/todo-today"});function C(e){var t=e.children;return r.a.createElement(T.Provider,{value:S},t)}function F(e){var t=e.children,n=e.currentDay,o=Object(a.useState)({}),c=Object(l.a)(o,2),i=c[0],u=c[1],s=Object(a.useContext)(T).readDatabase,d=Object(a.useState)(!1),f=Object(l.a)(d,2),v=f[0],b=f[1],h=Object(a.useReducer)(D,{currentDay:n||y()()}),m=Object(l.a)(h,2),g=m[0],p=m[1];Object(a.useEffect)(function(){v||s().then(function(e){u(e),b(!0)})});var O={state:g,setState:p,database:i};return r.a.createElement(x.Provider,{value:O},t)}function L(e){var t=e.children,n=Object(i.a)(e,["children"]);return r.a.createElement(C,null,r.a.createElement(F,n,t))}function I(){var e=Object(a.useContext)(T),t=e.getClient,n=e.createClient,r=e.logOutDropbox,o=Object(a.useState)(null),c=Object(l.a)(o,2),i=c[0],u=c[1],s=Object(a.useState)(t()||n()),d=Object(l.a)(s,2),f=d[0],v=d[1];return Object(a.useEffect)(function(){f&&f.usersGetCurrentAccount().then(u),window.history.pushState({},document.title,"/todo-today")},[f]),Object(b.a)({},e,{client:f,logout:function(){u(null),v(null),r()},user:i})}var A=n(43),N=n.n(A),R=n(44),P=n.n(R);var M=[],U="todos",W="history",J="everyDay",_=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Y=Object.freeze(_.reduce(function(e,t,n){return Object(b.a)({},e,Object(v.a)({},t,n))},{})),B=function(e){return Y[e]},q=_.map(B);var H=function(){var e=Object(f.a)(d.a.mark(function e(){var t,n,a,r,o,c;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=I(),n=t.readDatabase,e.prev=1,e.next=4,n();case 4:return a=e.sent,r=a&&a.history,e.next=8,m.a.getItem(W);case 8:if(o=e.sent,c=r||o){e.next=14;break}return e.next=13,m.a.setItem(W,{});case 13:return e.abrupt("return",{});case 14:return e.abrupt("return",c);case 17:e.prev=17,e.t0=e.catch(1);case 19:case"end":return e.stop()}},e,this,[[1,17]])}));return function(){return e.apply(this,arguments)}}();function V(e){var t=y()(e),n=t.year(),a=t.month(),r=t.date();return"".concat(a,"-").concat(r,"-").concat(n)}function z(){return Object(a.useContext)(x)}var G=function(){var e=Object(f.a)(d.a.mark(function e(){var t,n,a,r,o,c;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=I(),n=t.readDatabase,e.prev=1,e.next=4,n();case 4:return a=e.sent,r=a&&a.todos,e.next=8,m.a.getItem(U);case 8:if(o=e.sent,c=r||o){e.next=13;break}return e.next=13,m.a.setItem(U,M);case 13:return e.abrupt("return",c||M);case 16:e.prev=16,e.t0=e.catch(1);case 18:case"end":return e.stop()}},e,this,[[1,16]])}));return function(){return e.apply(this,arguments)}}();function K(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object(a.useState)(e),n=Object(l.a)(t,2),r=n[0],o=n[1],c=function(e){return r.includes(e)};return{filters:e,currentFilters:r,isFilterActive:c,toggleFilter:function(e){return c(e)?function(e){return o(r.filter(function(t){return t!==e}))}(e):function(e){return o([].concat(Object(u.a)(r),[e]))}(e)},setFilters:function(e){return o(Object.keys(e))}}}var $=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}).day;return Object(v.a)({},"Day",function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:y()().day();return function(t){return t.days.includes(e)}}(e))};var Q=n(26),X={allDaysLabel:"All days of the week"};function Z(e){var t=e.defaultSelectedDays,n=e.onSetSelectedDays,o=Object(a.useState)(t),c=Object(l.a)(o,2),i=c[0],s=c[1],d=function(e){return i.includes(B(e))},f=q.every(function(e){return i.includes(e)});function v(e){s(e),n(e)}function b(e){var t=e.target,n=Y[t.value];v(d(t.value)?i.filter(function(e){return e!==n}):[].concat(Object(u.a)(i),[n]))}return r.a.createElement("fieldset",null,r.a.createElement("legend",null,"Day"),r.a.createElement("label",null,r.a.createElement("input",{type:"checkbox",value:J,checked:f,onChange:function(){return v(f?[]:q)}}),X.allDaysLabel),"\xa0\u2014\xa0",_.map(function(e){return r.a.createElement("label",{key:e},r.a.createElement("input",{type:"checkbox",value:e,checked:d(e),onChange:b}),e)}))}var ee={editLabel:"Edit",saveLabel:"Save",todoTextPlaceholder:"Climb Mt Rainier"};function te(e){var t=e.cancel,n=e.todo,o=e.save,c=e.defaultValue,i=void 0===c?"":c,u=Object(a.useState)(i),s=Object(l.a)(u,2),d=s[0],f=s[1],v=Object(a.useState)(n?n.days:q),b=Object(l.a)(v,2),h=b[0],m=b[1];return r.a.createElement("form",{onSubmit:function(e){e.preventDefault(),d&&(o({text:d,days:h}),f(""))}},r.a.createElement("label",null,"Todo\xa0",r.a.createElement("input",{autoFocus:!0,type:"text",className:"input",placeholder:ee.todoTextPlaceholder,value:d,onChange:function(e){return f(e.target.value)}})),!!d&&r.a.createElement(Z,{defaultSelectedDays:h,onSetSelectedDays:m}),r.a.createElement("button",{type:"submit"},ee.saveLabel),!!i&&r.a.createElement("button",{onClick:t},"Cancel"))}var ne={editLabel:"Edit",deleteLabel:"Remove"},ae=function(e){var t=e.text;return"".concat(ne.deleteLabel," ").concat(t)},re=function(e){var t=e.text;return"".concat("Mark"," ").concat(t," ").concat("as completed")},oe=function(e){var t=e.text;return"Edit ".concat(t)};function ce(e){var t=e.isCompleted,n=e.todo,o=e.toggleTodo,c=e.removeTodo,i=e.updateTodo,u=Object(a.useState)(!1),s=Object(l.a)(u,2),d=s[0],f=s[1],v=function(){return f(!1)};return d?r.a.createElement(te,{todo:n,save:function(e){i(Object(b.a)({},n,e)),v()},defaultValue:n.text,cancel:v}):r.a.createElement("div",{style:{textDecoration:t?"line-through":""}},r.a.createElement("input",{"aria-label":re(n),type:"checkbox",checked:t,onChange:o}),n.text,r.a.createElement("div",null,r.a.createElement("button",{"aria-label":oe(n),onClick:function(){return f(!0)}},ne.editLabel),r.a.createElement("button",{"aria-label":ae(n),onClick:function(){return c(n)}},ne.deleteLabel)))}function ie(){var e=z().state.currentDay,t=function(){arguments.length>0&&void 0!==arguments[0]?arguments[0]:y()();var e=z(),t=e.state,n=e.setState,a=t.currentDay,r=function(e){return n({currentDay:e})};return{goToNextDay:function(){return r(a.add(1,"day"))},goToPreviousDay:function(){return r(a.subtract(1,"day"))},goToToday:function(){return r(y()())}}}(),n=t.goToNextDay,a=t.goToPreviousDay,o=t.goToToday;return r.a.createElement("div",null,r.a.createElement("button",{onClick:a},"Prev"),r.a.createElement("button",{onClick:o},"Today"),e.format("dddd, MMMM Do YYYY"),r.a.createElement("button",{onClick:n},"Next"))}function ue(e){var t=e.defaultTodos,n=void 0===t?[]:t,o=e.defaultHistory,c=(e.defaultDay,I().saveDatabase),s=z().state,d=s.currentDay,f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:y()(),n=Object(a.useState)(e),r=Object(l.a)(n,2),o=r[0],c=r[1],s=function(){return $({day:t.get("day")})},d=K(Object.keys(s())),f=d.currentFilters,v=(d.setFilters,Object(i.a)(d,["currentFilters","setFilters"])),h=Object(u.a)(f.map(function(e){return s()[e]})),g=o.filter(function(e){return h.every(function(t){return t(e)})});return Object(a.useEffect)(function(){m.a.setItem(U,o)},[o]),Object(b.a)({todos:g,allTodos:o,updateTodo:function(e){var t=o.map(function(t){return e.id!==t.id?t:Object(b.a)({},t,e)});c(t)},removeTodo:function(e){c(o.filter(function(t){return t!==e}))},toggleTodo:function(e){var t=Object(u.a)(o);t[e].isCompleted=!t[e].isCompleted,c(t)},addTodo:function(e){var t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return function(){return t+=1,"".concat(e,"_").concat(t)}}("todo",o.length),n=[].concat(Object(u.a)(o),[Object(b.a)({id:t()},e)]);c(n)}},v)}(n,d),h=f.allTodos,g=f.todos,p=f.filters,O=f.toggleFilter,j=f.isFilterActive,E=f.addTodo,w=f.removeTodo,k=f.updateTodo,x=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e,n=Object(a.useState)(e),r=Object(l.a)(n,2),o=r[0],c=r[1];Object(a.useEffect)(function(){N()(t,o)||P()(o)||m.a.setItem(W,o)});var i=function(e){return o[e]||[]};return{history:o,isCompletedForDay:function(e,t){return i(V(t)).includes(e)},toggleTodoForDay:function(e,n){var a=V(n);if(a){var r=i(a),l=r.includes(e)?r.filter(function(t){return t!==e}):[].concat(Object(u.a)(r),[e]),s=Object(b.a)({},o,Object(v.a)({},a,l));t=s,c(s)}}}}(o),D=x.history,T=x.toggleTodoForDay,S=x.isCompletedForDay,C=function(e){var t=e.id;return S(t,d)};return Object(a.useEffect)(function(){c({data:{history:D,todos:h}})},[D,h]),r.a.createElement("div",null,r.a.createElement(ie,null),r.a.createElement("div",null,"Filters",p.map(function(e){return r.a.createElement("label",{key:e},e,r.a.createElement("input",{type:"checkbox",checked:j(e),onChange:function(){return O(e)}}))}),r.a.createElement("ul",null,g.map(function(e,t){return r.a.createElement("li",{key:t},r.a.createElement(ce,{index:t,todo:e,isCompleted:C(e),toggleTodo:function(){return T(e.id,d)},removeTodo:w,updateTodo:k}))}),r.a.createElement("li",null,r.a.createElement(te,{save:E}))),r.a.createElement("div",{style:{background:"lavender",padding:20,float:"right"}},r.a.createElement("pre",null,"todos: ",JSON.stringify(h,null,2)),r.a.createElement("pre",null,"history: ",JSON.stringify(D,null,2)),r.a.createElement("pre",null,"state: ",JSON.stringify(s,null,2)))))}var le=Object(Q.unstable_createResource)(G),se=Object(Q.unstable_createResource)(H),de=function(){return r.a.createElement("div",null,"Loading...")},fe=function(){var e=le.read(),t=se.read();return r.a.createElement(ue,{defaultTodos:e,defaultHistory:t})},ve=function(){var e=I(),t=e.authUrl,n=e.client,a=e.logout,o=e.user;if(o){var c=o.name;return r.a.createElement("div",null,"Logged in as: ",c.display_name,"\xa0",r.a.createElement("button",{onClick:a},"Logout"))}return n?"Fetching account...":r.a.createElement("a",{href:t},"Login to Dropbox")};var be=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function he(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}c.a.render(r.a.createElement(function(e){return r.a.createElement(L,null,r.a.createElement(ve,null),r.a.createElement(a.Suspense,{fallback:r.a.createElement(de,null)},r.a.createElement(fe,null)))},null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){var t=new URL("/todo-today",window.location.href);if(t.origin!==window.location.origin)return void console.log("bailing on registering service worker!!!!!",t,t.origin);window.addEventListener("load",function(){var t="".concat("/todo-today","/service-worker.js");be?(function(e,t){fetch(e).then(function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):he(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")})):he(t,e)})}}()},45:function(e,t,n){e.exports=n(116)}},[[45,2,1]]]);
//# sourceMappingURL=main.2764d983.chunk.js.map