// ==UserScript==
// @name           Gmailers Against Picasa
// @description    Puts back the reader link. Optional link to Flickr for Photos link.
// @version        1.0
// @author         scragz
// @namespace      http://scragz.com/
// @include        http://mail.google.com/mail/*
// @include        https://mail.google.com/mail/*
// ==/UserScript==

(function() {
SHOW_FLICKR_LINK = true;

/* begin scragz' GM utility functions */
DEBUG = true;
var _gt = function(e) { return document.getElementsByTagName(e); };
var _gi = function(e) { return document.getElementById(e); };
var _ce = function(e) { return document.createElement(e); };
var _ct = function(e) { return document.createTextNode(e); };
var _gc = function(clsName)
{
    var elems = document.getElementsByTagName('*');
    var j = 0;
    var arr = new Array();
    for (var i=0; (elem = elems[i]); i++) {
        if (elem.className == clsName) {
            arr[j] = elem;
            j++;
        }
    }
    return (arr.length > 0) ? arr : false;
};
var xpath = function(query, startingPoint)
{
    if (startingPoint == null) {
        startingPoint = document;
    }
    var retVal = document.evaluate(query, startingPoint, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    return retVal;
};
var xpathFirst = function(query, startingPoint)
{
    var res = xpath(query, startingPoint);

    if (res.snapshotLength == 0) return false;
    else return res.snapshotItem(0);
};
var swapNode = function(node, swap)
{
    var nextSibling = node.nextSibling;
    var parentNode = node.parentNode;
    swap.parentNode.replaceChild(node, swap);
    parentNode.insertBefore(swap, nextSibling);
};
var addGlobalStyle = function(css)
{
    var head, style;
    head = _gt('head')[0];
    if (!head) { return; }
    style = _ce('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
};
/* end scragz' GM utility functions */


/*
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */
window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})();
if (!DEBUG) debug.setLevel(0);

debug.log('GAP loading...');
/*
It is really difficult to get scripts that manipulate the initial DOM
in Gmail to load happily, especially in Chrome.
*/
var restart_count = 0;
var done = false;
var go_ahead = function()
{
    debug.log('GO AHEAD');
    var nav, photos_link, reader_link;
    if (nav = _gi('gbar')) {
        debug.log(nav);
        photos_link = xpathFirst("//a[text()[contains(., 'Photos')]]", nav);
        debug.log(photos_link);
        reader_link = photos_link.cloneNode(false);
        reader_link.setAttribute('href', 'http://www.google.com/reader/view/?tab=my');
        reader_link.appendChild(_ct('Reader'));
        photos_link.parentNode.insertBefore(reader_link, photos_link);
        debug.log(reader_link);
        if (SHOW_FLICKR_LINK) {
            photos_link.setAttribute('href', 'http://www.flickr.com/');
        } else {
            photos_link.parentNode.removeChild(photos_link);
        }
        done = true;
    }
}
if (typeof(unsafeWindow) == 'undefined') { unsafeWindow = window; }
function waitForReady(callback) {
    try { var docState = unsafeWindow.document.readyState; } catch(e) { docState = null; }
    if (docState) {
        if (docState != 'complete' && restart_count < 100) { restart_count++; window.setTimeout(waitForReady, 150, callback); return; }
    }
    callback();
}
if (!done) {
    waitForReady(go_ahead);
    window.addEventListener('load', go_ahead, true)
}
})();