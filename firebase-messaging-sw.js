null == window.DI && (window.DI = {}),
null == window.DI.util && (window.DI.util = {}),
function(e) {
    "use strict";
    function t(e, t) {
        var n = Object.prototype.toString.call(t).slice(8, -1);
        return void 0 !== t && null !== t && n === e
    }
    function n(e) {
        return isFinite(e) && e % 1 == 0
    }
    function r(e) {
        return JSON.parse(JSON.stringify(e))
    }
    function i(e, t) {
        if (t.bind)
            return t.bind(e);
        var n = []
          , r = function() {}
          , i = function() {
            return t.apply(e, n.concat(Array.prototype.slice.call(arguments)))
        };
        return r.prototype = t.prototype,
        i.prototype = new r,
        i
    }
    e.getObjType = function(e) {
        return Object.prototype.toString.call(e).slice(8, -1)
    }
    ,
    e.is = t,
    e.isNumber = function(e) {
        return !isNaN(parseFloat(e)) && isFinite(e)
    }
    ,
    e.isInt = n,
    e.convertToArray = function(e) {
        for (var t = [], n = 0; n < e.length; n++)
            t.push(e[n]);
        return t
    }
    ,
    e.clone = r,
    e.methodRef = i,
    e.isIE8OrOlder = function() {
        return null != window.attachEvent && null == window.addEventListener
    }
    ,
    e.isIE9OrOlder = function() {
        return e.isIE8OrOlder() || null != document.documentMode && (null == window.performance || document.documentMode < 10)
    }
    ,
    e.parseInt = function(e) {
        if (null == e || "" === e || !isFinite(e) || e % 1 != 0)
            throw new Error("Not an int : '" + e + "'");
        return parseInt(e, "10")
    }
    ,
    e.getURLParameters = function() {
        var e = window.location.search.slice(1)
          , t = {};
        if (null == e || "" == e)
            return t;
        for (var n = decodeURIComponent(e).split("&"), r = 0; r < n.length; r++) {
            var i = n[r].split("=");
            t[i[0]] = i[1]
        }
        return t
    }
    ,
    e.coalesce = function() {
        for (var e = 0; e < arguments.length; e++)
            if (null != arguments[e])
                return arguments[e];
        return null
    }
    ,
    e.prefixZeros = function(e, t) {
        var n = t - e.toString().length;
        return n <= 0 ? e : new Array(n + 1).join("0") + e.toString()
    }
    ,
    e.formatNumber = function(e, t, r) {
        var i;
        n(e) || (i = null != t ? Math.pow(10, t) : 100,
        e = Math.round(e * i) / i);
        for (var o = new RegExp("^(-?[0-9]+)([0-9]{3})"), l = e + ""; o.test(l); )
            l = l.replace(o, "$1 $2");
        if (r) {
            -1 == l.indexOf(".") && (l += ".");
            for (var s = l.afterLast(".").length; s < t; s++)
                l += "0"
        }
        return l
    }
    ,
    e.formatFloatNumber = function(e, t) {
        var n;
        null == t && (t = 2),
        n = null != t ? Math.pow(10, t) : 100,
        e = Math.round(e * n) / n;
        for (var r = new RegExp("(-?[0-9]+)([0-9]{3})"), i = e + ""; r.test(i); )
            i = i.replace(r, "$1 $2");
        -1 == i.indexOf(".") && (i += ".0");
        var o = i.afterLast(".");
        if (o.length < t)
            for (var l = 0; l < t - o.length; l++)
                i += "0";
        return i
    }
    ,
    e.assert = function(e, t) {
        if (!e)
            throw null == t ? new Error("assertion failure") : new Error(t)
    }
    ,
    e.net = {},
    e.net.ajax = function(e) {
        var n = new XMLHttpRequest;
        n.onreadystatechange = function() {
            4 == n.readyState && (200 == n.status ? e.success && e.success(n.responseText, n) : e.error && e.error(n.status, n.responseText, n))
        }
        ;
        var r = e.method || "POST";
        n.open(r, e.url, !0),
        null != e.timeout && (n.timeout = e.timeout);
        var i = null;
        if (null != e.data)
            if (i = "",
            t("String", e.data))
                n.setRequestHeader("Content-type", "text/plain"),
                i = e.data;
            else {
                if (!t("Object", e.data))
                    throw new Error("data type");
                "POST" == r && n.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                for (var o in e.data)
                    i.length > 0 && (i += "&"),
                    i += encodeURIComponent(o) + "=" + encodeURIComponent(e.data[o])
            }
        n.send(i)
    }
    ,
    e.net.corsAjax = function(e) {
        try {
            var t = new XMLHttpRequest
              , n = "withCredentials"in t;
            if (null != window.XDomainRequest && !n) {
                var r = new XDomainRequest;
                r.open("POST", e.url),
                r.ontimeout = function() {
                    e.error(408, "timeout")
                }
                ,
                r.onerror = function() {
                    e.error(500, "error")
                }
                ,
                r.onload = function() {
                    e.success(r.responseText)
                }
                ,
                setTimeout(function() {
                    r.send(e.data)
                }, 0)
            } else
                t.open("POST", e.url, !0),
                t.setRequestHeader("Content-type", "text/plain"),
                t.onreadystatechange = function() {
                    4 == t.readyState && (200 == t.status ? e.success(t.responseText) : e.error(t.status, t.responseText))
                }
                ,
                t.send(e.data)
        } catch (t) {
            e.error(500, "exception " + t),
            window.console && console.error(t)
        }
    }
    ;
    var o = e.string = {};
    o.trim = function(e) {
        return e.replace(/^\s+|\s+$/g, "")
    }
    ,
    o.formatTemplate = function(e, t) {
        return e.replace(/([{]\w+[}])/g, function(e, n, r, i) {
            return null != t[e] ? t[e] : e
        })
    }
    ;
    var l = e.datetime = {};
    l.buildDateWithStrictValidation = function(e, t, n, r, i, o) {
        var l = new Date(e,t,n,r,i,o,0);
        return l.getFullYear() != e || l.getMonth() != t || l.getDate() != n || l.getHours() != r || l.getMinutes() != i || l.getSeconds() != o ? null : l
    }
    ,
    l.parseOFSYSDateTime = function(t) {
        var n = /^(\d+)[.-](\d+)[.-](\d+) (\d+):(\d+):(\d+)$/gm.exec(t)
          , r = null;
        if (null != n && 7 == n.length) {
            var i = e.parseInt(n[1])
              , o = e.parseInt(n[2]) - 1
              , l = e.parseInt(n[3])
              , s = e.parseInt(n[4])
              , a = e.parseInt(n[5])
              , u = e.parseInt(n[6]);
            r = e.datetime.buildDateWithStrictValidation(i, o, l, s, a, u)
        } else {
            if (null != (n = /^(\d+)[.-](\d+)[.-](\d+) (\d+):(\d+)$/gm.exec(t)) && 6 == n.length) {
                i = e.parseInt(n[1]),
                o = e.parseInt(n[2]) - 1,
                l = e.parseInt(n[3]),
                s = e.parseInt(n[4]),
                a = e.parseInt(n[5]);
                r = e.datetime.buildDateWithStrictValidation(i, o, l, s, a, 0)
            } else {
                if (null != (n = /^(\d+)[.-](\d+)[.-](\d+)$/gm.exec(t)) && 4 == n.length) {
                    i = e.parseInt(n[1]),
                    o = e.parseInt(n[2]) - 1,
                    l = e.parseInt(n[3]);
                    r = e.datetime.buildDateWithStrictValidation(i, o, l, 0, 0, 0)
                }
            }
        }
        return r
    }
    ,
    l.parseOFSYSTime = function(t) {
        if (null != (o = /^(\d+):(\d+):(\d+)$/gm.exec(t)) && 4 == o.length) {
            var n = e.parseInt(o[1])
              , r = e.parseInt(o[2])
              , i = e.parseInt(o[3]);
            return null != e.datetime.buildDateWithStrictValidation(2001, 1, 1, n, r, i) ? {
                HH: n,
                mm: r,
                ss: i
            } : null
        }
        var o;
        if (null != (o = /^(\d+):(\d+)$/gm.exec(t)) && 3 == o.length) {
            n = e.parseInt(o[1]),
            r = e.parseInt(o[2]);
            return null != e.datetime.buildDateWithStrictValidation(2001, 1, 1, n, r, 0) ? {
                HH: n,
                mm: r,
                ss: 0
            } : null
        }
        return null
    }
    ;
    var s = {
        DeclareClassWithVariables: function(e) {
            var t = s.DeclareClass(!0, e.methods, e.name, e.variables);
            if (null != e.static) {
                t.__STATIC__ = e.static;
                for (var n in e.static)
                    t[n] = e.static[n]
            }
            return t
        },
        DeclareClass: function(e, n, i, o) {
            var l = function() {
                if (this.ClassName = i,
                null != o) {
                    for (var n in o)
                        this[n] = null != o[n] && (t("Object", o[n]) || t("Array", o[n])) ? r(o[n]) : o[n];
                    e && null != Object.seal && Object.seal(this),
                    null != this.init && this.init.apply(this, arguments)
                }
            };
            l.prototype = n,
            s.AddCommonClassMethods(l),
            l.Variables = o,
            l.ClassName = i;
            for (var a in n) {
                var u = n[a];
                null != u && (l[a] = u)
            }
            return l
        },
        AddCommonClassMethods: function(e) {
            e.prototype.CallMethod = function(e) {
                return i(this, e)
            }
            ,
            e.Extend = function(t) {
                var n = s.ExtendClass(!0, this, t.methods, t.name, t.variables);
                if (null != e.__STATIC__)
                    for (var r in e.__STATIC__)
                        n[r] = e.__STATIC__[r];
                if (null != t.static)
                    for (var r in t.static)
                        n[r] = t.static[r];
                return n
            }
        },
        ExtendClass: function(e, n, i, o, l) {
            if (null != Object.create) {
                var a = {};
                for (var u in i) {
                    if (null != (g = i[u]))
                        a[u] = {
                            value: i[u],
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        };
                    else {
                        var c = Object.getOwnPropertyDescriptor(i, u).get
                          , f = Object.getOwnPropertyDescriptor(i, u).set;
                        null != c && null != f ? a[u] = {
                            configurable: !1,
                            get: c,
                            set: f
                        } : null != c ? a[u] = {
                            configurable: !1,
                            get: c
                        } : null != f && (a[u] = {
                            configurable: !1,
                            set: f
                        })
                    }
                }
                if (null != n.Variables) {
                    var d = {};
                    for (var u in n.Variables)
                        d[u] = n.Variables[u];
                    if (null != l)
                        for (var u in l)
                            d[u] = l[u];
                    l = d
                }
                (h = function() {
                    if (this.ClassName = o,
                    null != l) {
                        for (var n in l)
                            this[n] = null != l[n] && (t("Object", l[n]) || t("Array", l[n])) ? r(l[n]) : l[n];
                        e && null != Object.seal && Object.seal(this),
                        null != this.init && this.init.apply(this, arguments)
                    }
                }
                ).prototype = Object.create(n.prototype, a),
                h.BasePrototype = n.prototype,
                h.BaseClass = n,
                h.Variables = l,
                h.ClassName = o
            } else {
                var h = function() {
                    if (this.ClassName = o,
                    null != l) {
                        for (var n in l)
                            this[n] = null != l[n] && (t("Object", l[n]) || t("Array", l[n])) ? r(l[n]) : l[n];
                        e && null != Object.seal && Object.seal(this),
                        null != this.init && this.init.apply(this, arguments)
                    }
                }
                  , m = {};
                for (var u in n.prototype)
                    m[u] = n.prototype[u];
                for (var u in i)
                    m[u] = i[u];
                h.prototype = m,
                h.BasePrototype = n.prototype,
                h.BaseClass = n,
                h.ClassName = o
            }
            s.AddCommonClassMethods(h);
            for (var p in a) {
                var g;
                null != (g = a[p]).value && (g = g.value),
                h[p] = g
            }
            return h
        }
    };
    e.classes = s
}(window.DI.util),
null == window.DI && (window.DI = {}),
null == window.DI.dom && (window.DI.dom = {}),
function(e) {
    "use strict";
    var t = window.DI;
    t.util;
    function n(e) {
        this.elem = e
    }
    function r(e) {
        this.elems = e
    }
    e.Elem = n,
    n.prototype = {
        findAll: function(t) {
            return e._selectAll(t, this.elem)
        },
        find1: function(t) {
            return e._select1(t, this.elem)
        },
        nextOrNull: function() {
            var t;
            if (this.elem.nextElementSibling)
                t = this.elem.nextElementSibling;
            else
                for (t = this.elem.nextSibling; null != t && 1 !== t.nodeType; )
                    t = t.nextSibling;
            return null == t ? null : new e.Elem(t)
        },
        next: function() {
            var e = this.nextOrNull();
            if (null == e)
                throw new Error("There is no next element");
            return e
        },
        prevOrNull: function() {
            var t = null;
            if (this.elem.previousElementSibling)
                t = this.elem.previousElementSibling;
            else
                for (t = this.elem.previousSibling; null != t && 1 !== t.nodeType; )
                    t = t.previousSibling;
            return null == t ? null : new e.Elem(t)
        },
        prev: function() {
            var e = this.prevOrNull();
            if (null == e)
                throw new Error("There is no previous element");
            return e
        },
        children: function() {
            for (var t = this.elem.children, n = [], r = 0; r < t.length; r++)
                1 == t[r].nodeType && n.push(t[r]);
            return new e.OfsysDomElemArray(n)
        },
        parent: function() {
            return new e.Elem(this.elem.parentNode)
        },
        firstParentMatching: function(t) {
            for (var n = this.elem.parentNode; null != n; ) {
                if (e.wrap(n).is(t))
                    return e.wrap(n);
                n = n.parentNode
            }
            return null
        },
        addClass: function(e) {
            return this.hasClass(e) || (this.elem.className += " " + e),
            this
        },
        removeClass: function(e) {
            for (var t = this.elem.className.split(" "), n = [], r = 0; r < t.length; r++)
                t[r] != e && n.push(t[r]);
            return this.elem.className = n.join(" "),
            this
        },
        classes: function() {
            return this.elem.className.split(" ")
        },
        hasClass: function(e) {
            for (var t = this.elem.className.split(" "), n = 0; n < t.length; n++)
                if (t[n] == e)
                    return !0;
            return !1
        },
        getAttr: function(e) {
            return this.elem.getAttribute(e)
        },
        setAttr: function(e, t) {
            return this.elem.setAttribute(e, t),
            this
        },
        removeAttr: function(e) {
            return this.elem.removeAttribute(e),
            this
        },
        getStyle: function(t) {
            var n = this._getComputedStyle(t);
            return null != n && "" != n || (n = this.elem.style.getPropertyValue ? this.elem.style.getPropertyValue(t) : this.elem.style[e.util.cssToCamelCase(t)]),
            "" === n ? null : n
        },
        _getComputedStyle: function(t) {
            if (window.getComputedStyle)
                return window.getComputedStyle(this.elem, null).getPropertyValue(t);
            if (this.elem.currentStyle)
                return this.elem.currentStyle[e.util.cssToCamelCase(t)];
            throw new Error("Unsupported")
        },
        getOwnStyle: function(t) {
            var n;
            return "" === (n = this.elem.style.getPropertyValue ? this.elem.style.getPropertyValue(t) : this.elem.style[e.util.cssToCamelCase(t)]) ? null : n
        },
        setStyle: function(t, n) {
            return this.elem.style.setProperty ? this.elem.style.setProperty(t, n) : this.elem.style[e.util.cssToCamelCase(t)] = n,
            this
        },
        setStyles: function(e) {
            for (var t in e)
                this.setStyle(t, e[t]);
            return this
        },
        removeStyle: function(t) {
            if (this.elem.style.removeProperty)
                this.elem.style.removeProperty(t);
            else {
                if (!this.elem.style.removeAttribute)
                    throw new Error("Unsupported");
                this.elem.style.removeAttribute(e.util.cssToCamelCase(t))
            }
            return this
        },
        isChecked: function() {
            return this.elem.checked
        },
        setChecked: function(e) {
            return this.elem.checked = e,
            this
        },
        getSelectedOption: function() {
            for (var e = this.getValue(), t = this.findAll("option"), n = 0; n < t.length(); n++)
                if (t.get(n).getValue() == e)
                    return t.get(n);
            return null
        },
        getValue: function() {
            return this.elem.value
        },
        setValue: function(e) {
            return this.elem.value = e,
            this
        },
        append: function(e) {
            return this.elem.appendChild(e.elem),
            this
        },
        prepend: function(e) {
            return this.elem.insertBefore(e.elem, this.elem.firstChild),
            this
        },
        appendTo: function(e) {
            return e.elem.appendChild(this.elem),
            this
        },
        insertAfter: function(e) {
            return e.elem.parentNode.insertBefore(this.elem, e.elem.nextSibling),
            this
        },
        insertBefore: function(e) {
            return e.elem.parentNode.insertBefore(this.elem, e.elem),
            this
        },
        remove: function() {
            this.elem.parentNode.removeChild(this.elem);
            this.elem = null
        },
        detach: function() {
            return this.elem = this.elem.parentNode.removeChild(this.elem),
            this
        },
        empty: function() {
            return this.elem.innerHTML = "",
            this
        },
        getText: function() {
            if ("textContent"in this.elem)
                return this.elem.textContent;
            if ("innerText"in this.elem)
                return this.elem.innerText;
            throw new Error("Unsupported")
        },
        setText: function(e) {
            if ("textContent"in this.elem)
                this.elem.textContent = e;
            else {
                if (!("innerText"in this.elem))
                    throw new Error("Unsupported");
                this.elem.innerText = e
            }
            return this
        },
        getInnerHTML: function() {
            return this.elem.innerHTML
        },
        setInnerHTML: function(e) {
            return this.elem.innerHTML = e,
            this
        },
        getOuterHTML: function() {
            return this.elem.outerHTML
        },
        setOuterHTML: function(e) {
            return this.elem.outerHTML = e,
            this
        },
        appendText: function(e) {
            return this.elem.appendChild(document.createTextNode(e)),
            this
        },
        appendHTML: function(e) {
            var t = document.createDocumentFragment()
              , n = document.createElement("div");
            for (n.innerHTML = e; n.firstChild; )
                t.appendChild(n.firstChild);
            return this.elem.appendChild(t),
            this
        },
        clone: function() {
            return e.parse(this.elem.outerHTML)
        },
        on: function(t, n, r) {
            return e.on(this.elem, t, n, r)
        },
        removeEvent: function(e) {
            if (this.elem.removeEventListener)
                this.elem.removeEventListener(e.eventType, e.fn, !1);
            else {
                if (!this.elem.detachEvent)
                    throw new Error("Unsupported");
                this.elem.detachEvent("on" + e.eventType, e.fn)
            }
            return this
        },
        trigger: function(e) {
            if (document.createEvent) {
                (t = document.createEvent("HTMLEvents")).initEvent(e, !0, !0),
                t.eventName = e,
                this.elem.dispatchEvent(t)
            } else {
                if (!document.createEventObject)
                    throw new Error("Unsupported");
                var t = document.createEventObject();
                this.elem.fireEvent("on" + e, t)
            }
        },
        getScroll: function() {
            return {
                left: this.elem.scrollLeft,
                top: this.elem.scrollTop
            }
        },
        setScrollLeft: function(e) {
            return this.elem.scrollLeft = e,
            this
        },
        setScrollTop: function(e) {
            return this.elem.scrollTop = e,
            this
        },
        getBounds: function() {
            var t = this.elem.getBoundingClientRect()
              , n = e.browserWindow.getScrollLeft()
              , r = e.browserWindow.getScrollTop();
            return {
                left: t.left + n,
                top: t.top + r,
                right: t.right + n,
                bottom: t.bottom + r,
                width: t.right == t.left ? 0 : t.right - t.left + 1,
                height: t.top == t.bottom ? 0 : t.bottom - t.top + 1
            }
        },
        getWidth: function() {
            return this.elem.offsetWidth
        },
        getHeight: function() {
            return this.elem.offsetHeight
        },
        getCoord: function() {
            var t = this.elem.getBoundingClientRect()
              , n = e.browserWindow.getScrollLeft()
              , r = e.browserWindow.getScrollTop();
            return {
                left: t.left + n,
                top: t.top + r
            }
        },
        getOffsetParent: function() {
            return new e.Elem(this.elem.offsetParent)
        },
        getRelativeOffset: function() {
            return {
                left: this.elem.offsetLeft,
                top: this.elem.offsetTop
            }
        },
        is: function(e) {
            if (this.elem.mozMatchesSelector)
                return this.elem.mozMatchesSelector(e);
            if (this.elem.webkitMatchesSelector)
                return this.elem.webkitMatchesSelector(e);
            if (this.elem.msMatchesSelector)
                return this.elem.msMatchesSelector(e);
            for (var t = this.elem.parentNode.querySelectorAll(e), n = 0; n < t.length; n++)
                if (t[n] === this.elem)
                    return !0;
            return !1
        },
        focus: function() {
            this.elem.focus()
        },
        setShown: function(e) {
            e ? this.show() : this.hide()
        },
        hide: function() {
            return this.setAttr("domTools_previous_display", this.getStyle("display")),
            this.setStyle("display", "none"),
            this
        },
        show: function() {
            var e = this.getAttr("domTools_previous_display");
            return null != e && "" != e && "none" != e ? this.setStyle("display", e) : this.removeStyle("display"),
            this
        },
        toggle: function() {
            return "none" == this.getStyle("display") ? this.show() : this.hide(),
            this
        },
        animate: function(t) {
            null == t && (t = {});
            var n = t.properties
              , r = t.durationMilli;
            null == r && (r = 400);
            var i = t.interpolation;
            null == i && (i = "swing");
            var o = t.onCompleteCallback
              , l = t.onStepCallback
              , s = t.extensionProperties
              , a = {};
            if (this.elem == window)
                a.scrollTop = {
                    get: function() {
                        return e.browserWindow.getScrollTop()
                    },
                    set: function(t, n) {
                        e.browserWindow.setScrollTop(t)
                    }
                },
                a.scrollLeft = {
                    get: function() {
                        return e.browserWindow.getScrollLeft()
                    },
                    set: function(t, n) {
                        e.browserWindow.setScrollLeft(t)
                    }
                };
            else {
                var u = this;
                a.scrollTop = {
                    get: function() {
                        return u.getScrollTop()
                    },
                    set: function(e) {
                        u.setScrollTop(e)
                    }
                },
                a.scrollLeft = {
                    get: function() {
                        return u.getScrollLeft()
                    },
                    set: function(e) {
                        u.setScrollLeft(e)
                    }
                }
            }
            if (null != s)
                for (var c in s)
                    a[c] = s[c];
            var f = []
              , d = /^(-?\d+(?:\.\d+)?)([a-zA-Z]*|%)$/g;
            for (var h in n) {
                var m = null;
                if (null != a[h] ? m = a[h].get() : null != (m = this.getOwnStyle(h)) && "" != m || (m = this._getComputedStyle(h)),
                null === m || "" === m)
                    throw new Error("No CSS val :" + h);
                if (m.indexOf && (0 == m.indexOf("#") || 0 == m.indexOf("rgb(") || 0 == m.indexOf("rgba("))) {
                    var p = e.util.parseColor(m)
                      , g = e.util.parseColor(n[h]);
                    if (null != p && null != g) {
                        f.push({
                            css: h,
                            init: p,
                            delta: [g[0] - p[0], g[1] - p[1], g[2] - p[2], g[3] - p[3]],
                            unit: e.util.supportsRGBA() ? "rgba" : "rgb"
                        });
                        continue
                    }
                }
                d.lastIndex = 0;
                var w = d.exec(m);
                if (null == w)
                    throw new Error("Bad CSS val " + h + " : " + m);
                var v = parseFloat(w[1]);
                if (isNaN(v))
                    throw new Error("Bad CSS val " + h + " : " + m);
                var y = w[2]
                  , S = n[h];
                if ("string" == typeof n[h]) {
                    if (d.lastIndex = 0,
                    null == (w = d.exec(n[h])))
                        throw new Error("Bad CSS val " + h + " : " + n[h]);
                    if (S = parseFloat(w[1]),
                    isNaN(S))
                        throw new Error("Invalid target CSS " + h + " : " + n[h]);
                    if (y != w[2])
                        throw new Error("Cannot animate CSS " + h + " from " + y + " to " + w[2])
                }
                f.push({
                    css: h,
                    init: v,
                    delta: S - v,
                    unit: y
                })
            }
            var b, C = e.util.getTimeStampForAnimation();
            if ("linear" == i)
                b = 0;
            else {
                if ("swing" != i)
                    throw new Error("Invalid interpolation " + i);
                b = 1
            }
            u = this;
            var I = function() {
                var t = (e.util.getTimeStampForAnimation() - C) / r;
                t > 1 && (t = 1),
                1 == b && (t = Math.sin((t - .5) * Math.PI) / 2 + .5);
                for (var n = 0; n < f.length; n++) {
                    var i = f[n];
                    if ("rgba" == i.unit)
                        var s = "rgba(" + (i.init[0] + i.delta[0] * t | 0) + "," + (i.init[1] + i.delta[1] * t | 0) + "," + (i.init[2] + i.delta[2] * t | 0) + "," + (i.init[3] + i.delta[3] * t) + ")";
                    else if ("rgb" == i.unit)
                        s = "rgb(" + (i.init[0] + i.delta[0] * t | 0) + "," + (i.init[1] + i.delta[1] * t | 0) + "," + (i.init[2] + i.delta[2] * t | 0) + ")";
                    else
                        s = i.init + i.delta * t + i.unit;
                    null != a[i.css] ? a[i.css].set(s, u) : u.setStyle(i.css, s)
                }
                t < 1 ? (window.requestAnimationFrame ? window.requestAnimationFrame(I) : setTimeout(I, 1),
                null != l && l()) : null != o && o()
            };
            window.requestAnimationFrame ? window.requestAnimationFrame(I) : setTimeout(I, 1)
        },
        fadeIn: function(e, t, n) {
            null == e && (e = 500);
            var r = this;
            return this.setStyle("opacity", "0.0"),
            "none" == this.getStyle("display") && this.removeStyle("display"),
            this.animate({
                properties: {
                    opacity: 1
                },
                durationMilli: e,
                interpolation: t,
                onCompleteCallback: function() {
                    r.removeStyle("opacity"),
                    n && n()
                }
            }),
            this
        },
        fadeOut: function(e, t, n) {
            null == e && (e = 500);
            var r = this;
            return this.setStyle("opacity", "1.0"),
            this.animate({
                properties: {
                    opacity: 0
                },
                durationMilli: e,
                interpolation: t,
                onCompleteCallback: function() {
                    r.setStyle("display", "none").removeStyle("opacity"),
                    n && n()
                }
            }),
            this
        },
        fadeToggle: function() {
            return "none" != this.getStyle("display") ? this.fadeOut() : this.fadeIn(),
            this
        },
        slideDown: function(e, t) {
            null == e && (e = 500);
            var n = this.getStyle("height");
            "auto" == n && (this.setStyle("visibility", "hidden"),
            "none" == this.getStyle("display") && this.removeStyle("display"),
            n = this.getHeight() - parseInt(this.getStyle("padding-top")) - parseInt(this.getStyle("padding-bottom")) - parseInt(this.getStyle("border-top-width")) - parseInt(this.getStyle("border-bottom-width"))),
            this.setStyle("height", "0px").setStyle("visibility", "visible");
            var r = parseInt(n);
            this.elem.style.height = "0px",
            this.setStyle("overflow", "hidden"),
            "none" == this.getStyle("display") && this.removeStyle("display");
            var i = this.getStyle("padding-top")
              , o = this.getStyle("padding-bottom");
            return this.setStyle("padding-top", "0px").setStyle("padding-bottom", "0px"),
            this.animate({
                properties: {
                    height: r,
                    "padding-top": i,
                    "padding-bottom": o
                },
                durationMilli: e,
                interpolation: t
            }),
            this
        },
        slideUp: function(e, t) {
            null == e && (e = 500);
            var n = this.getStyle("padding-top")
              , r = this.getStyle("padding-bottom")
              , i = this.elem.offsetHeight - parseInt(n) - parseInt(r) - parseInt(this.getStyle("border-top-width")) - parseInt(this.getStyle("border-bottom-width"));
            this.elem.style.height = i + "px",
            this.elem.style.overflow = "hidden";
            var o = this;
            return this.animate({
                properties: {
                    height: 0,
                    "padding-top": 0,
                    "padding-bottom": 0
                },
                durationMilli: e,
                interpolation: t,
                onCompleteCallback: function() {
                    o.elem.style.display = "none",
                    o.setStyle("padding-top", n).setStyle("padding-bottom", r).setStyle("height", i + "px")
                }
            }),
            this
        },
        slideToggle: function() {
            return "none" != this.getStyle("display") ? this.slideUp() : this.slideDown(),
            this
        },
        scaleUp: function(e, t, n) {
            null == e && (e = 500),
            null == t && (t = 0),
            null == n && (n = 1);
            var r = this;
            return this.setStyle("transform", "scale(" + t + ")").show(),
            this.animate({
                properties: {
                    transform_scale: n
                },
                durationMilli: e,
                onCompleteCallback: function() {
                    r.removeStyle("transform")
                },
                extensionProperties: {
                    transform_scale: {
                        get: function() {
                            return t
                        },
                        set: function(e, t) {
                            t.setStyle("transform", "scale(" + e + ")")
                        }
                    }
                }
            }),
            this
        },
        scaleDown: function(e, t, n) {
            null == e && (e = 500),
            null == t && (t = 1),
            null == n && (n = 0);
            var r = this;
            return this.setStyle("transform", "scale(" + t + ")"),
            this.animate({
                properties: {
                    transform_scale: n
                },
                durationMilli: e,
                onCompleteCallback: function() {
                    r.removeStyle("transform"),
                    r.hide()
                },
                extensionProperties: {
                    transform_scale: {
                        get: function() {
                            return t
                        },
                        set: function(e, t) {
                            t.setStyle("transform", "scale(" + e + ")")
                        }
                    }
                }
            }),
            this
        }
    },
    e.OfsysDomElemArray = r,
    r.prototype = {
        get: function(t) {
            if (null == this.elems[t])
                throw new Error("No element at index : " + t);
            return new e.Elem(this.elems[t])
        },
        first: function() {
            if (0 == this.elems.length)
                throw new Error("Empty");
            return new e.Elem(this.elems[0])
        },
        last: function() {
            if (0 == this.elems.length)
                throw new Error("Empty");
            return new e.Elem(this.elems[this.elems.length - 1])
        },
        length: function() {
            return this.elems.length
        },
        addClass: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).addClass(t);
            return this
        },
        removeClass: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).removeClass(t);
            return this
        },
        setAttr: function(t, n) {
            for (var r = 0; r < this.elems.length; r++)
                e.wrap(this.elems[r]).setAttr(t, n);
            return this
        },
        removeAttr: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).removeAttr(t);
            return this
        },
        setStyle: function(t, n) {
            for (var r = 0; r < this.elems.length; r++)
                e.wrap(this.elems[r]).setStyle(t, n);
            return this
        },
        removeStyle: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).removeStyle(t);
            return this
        },
        setProp: function(t, n) {
            for (var r = 0; r < this.elems.length; r++)
                e.wrap(this.elems[r]).setProp(t, n);
            return this
        },
        setVal: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).setVal(t);
            return this
        },
        remove: function() {
            for (var t = 0; t < this.elems.length; t++)
                e.wrap(this.elems[t]).remove();
            return this
        },
        empty: function() {
            for (var t = 0; t < this.elems.length; t++)
                e.wrap(this.elems[t]).empty();
            return this
        },
        setText: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).setText(t);
            return this
        },
        setInnerHTML: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).setInnerHTML(t);
            return this
        },
        setOuterHTML: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).setOuterHTML(t);
            return this
        },
        appendText: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).appendText(t);
            return this
        },
        appendHTML: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).appendHTML(t);
            return this
        },
        on: function(t, n, r) {
            for (var i = 0; i < this.elems.length; i++)
                e.wrap(this.elems[i]).on(t, n, r);
            return this
        },
        trigger: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).trigger(t);
            return this
        },
        setScrollLeft: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).setScrollLeft(t);
            return this
        },
        setScrollTop: function(t) {
            for (var n = 0; n < this.elems.length; n++)
                e.wrap(this.elems[n]).setScrollTop(t);
            return this
        },
        hide: function() {
            for (var t = 0; t < this.elems.length; t++)
                e.wrap(this.elems[t]).hide();
            return this
        },
        show: function() {
            for (var t = 0; t < this.elems.length; t++)
                e.wrap(this.elems[t]).show();
            return this
        },
        toggle: function() {
            for (var t = 0; t < this.elems.length; t++)
                e.wrap(this.elems[t]).toggle();
            return this
        }
    },
    e.util = {},
    e.util.cssToCamelCase = function(e) {
        return e.replace(/-+(.)?/g, function(e, t) {
            return t ? t.toUpperCase() : ""
        })
    }
    ,
    e.util.supportsRGBA = function() {
        var t = e.create("script");
        try {
            t.elem.style.color = "rgba(0, 0, 0, 0.5)"
        } catch (e) {
            return !1
        }
        return !0
    }
    ,
    e.util.supportsTransform = function() {
        return "transform"in e.create("div").elem.style
    }
    ,
    e.util.getTimeStampForAnimation = function() {
        return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : (new Date).getTime()
    }
    ,
    e.util.parseColor = function(e, n) {
        var r = (e = t.util.string.trim(e).toLowerCase()).match(/^#([0-9a-f]{3})$/i);
        if (r)
            return r = r[1],
            [17 * parseInt(r.charAt(0), 16), 17 * parseInt(r.charAt(1), 16), 17 * parseInt(r.charAt(2), 16), 1];
        var i = e.match(/^#([0-9a-f]{6})$/i);
        if (i)
            return i = i[1],
            [parseInt(i.substr(0, 2), 16), parseInt(i.substr(2, 2), 16), parseInt(i.substr(4, 2), 16), 1];
        var o = e.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i) || e.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (o)
            return [parseInt(o[1]), parseInt(o[2]), parseInt(o[3]), void 0 === o[4] ? 1 : parseFloat(o[4])];
        var l = e.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        return l ? [parseInt(l[1]), parseInt(l[2]), parseInt(l[3]), 1] : n
    }
    ,
    e.util.cancelEvent = function(e) {
        e.preventDefault && e.preventDefault(),
        e.stopPropagation && e.stopPropagation(),
        t.util.isIE8OrOlder() && (e.cancelBubble = !0,
        e.returnValue = !1)
    }
    ,
    e.util._onInputEventCompatibility = function(e, t) {
        "onpropertychange"in e.elem && (e.elem.onpropertychange = t),
        e.on("keyup", {
            input: e
        }, t)
    }
    ,
    e.util.makeUnselectable = function(n) {
        if (t.util.isIE9OrOlder()) {
            if (null == n.tagName)
                return;
            var r = n.tagName.toLowerCase();
            if ("input" != r && "select" != r && "textarea" != r) {
                1 == n.nodeType && n.setAttribute("unselectable", "on");
                for (var i = n.firstChild; i; )
                    e.util.makeUnselectable(i),
                    i = i.nextSibling
            }
        }
    }
    ,
    e.util.selectNothing = function() {
        if (window.getSelection)
            window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges();
        else if (document.selection)
            try {
                document.selection.empty()
            } catch (e) {}
    }
    ,
    e.id = function(t) {
        return e._selectByID(t, document)
    }
    ,
    e.body = function() {
        return e.wrap(document.body)
    }
    ,
    e.select1 = function(t) {
        return e._select1(t, document)
    }
    ,
    e.selectAll = function(t) {
        return e._selectAll(t, document)
    }
    ,
    e.selectAllByClass = function(t) {
        return e._selectAllByClass(t, document)
    }
    ,
    e.create = function(t, n) {
        var r = document.createElement(t)
          , i = new e.Elem(r);
        if (null != n) {
            for (var o in n)
                ("style" != o || "style" == o && null != o.toUpperCase) && r.setAttribute(o, n[o]);
            if (null != n.style && null == n.style.toUpperCase) {
                var l = n.style;
                for (var o in l)
                    i.setStyle(o, l[o])
            }
        }
        return i
    }
    ,
    e.nsCreate = function(t, n, r) {
        if (null == document.createElementNS)
            throw new Error("Namespaces not supported by browser");
        var i = document.createElementNS(t, n)
          , o = new e.Elem(i);
        if (null != r) {
            for (var l in r)
                ("style" != l || "style" == l && null != l.toUpperCase) && i.setAttribute(l, r[l]);
            if (null != r.style && null == r.style.toUpperCase) {
                var s = r.style;
                for (var l in s)
                    o.setStyle(l, s[l])
            }
        }
        return o
    }
    ,
    e.parse = function(t) {
        var n = document.createElement("div");
        if (n.innerHTML = t,
        n.childNodes.length > 1)
            throw new Error("Multiple nodes in html fragment");
        return new e.Elem(n.firstChild)
    }
    ,
    e.wrap = function(t) {
        return new e.Elem(t)
    }
    ;
    var i = !1;
    if (e.onLoad = function(e) {
        if (i)
            e();
        else if (window.addEventListener)
            window.addEventListener("load", e, !1);
        else {
            if (!window.attachEvent)
                throw new Error("Not supported");
            window.attachEvent("onload", e)
        }
    }
    ,
    window.addEventListener)
        window.addEventListener("load", function() {
            i = !0
        }, !1);
    else {
        if (!window.attachEvent)
            throw new Error("Unsupported");
        window.attachEvent("onload", function() {
            i = !0
        })
    }
    e.onReady = function(e) {
        if ("complete" == document.readyState || "interactive" == document.readyState)
            e();
        else if (document.addEventListener)
            document.addEventListener("DOMContentLoaded", e, !1);
        else {
            if (!document.attachEvent)
                throw new Error("Not supported");
            document.attachEvent("onreadystatechange", function() {
                "complete" === document.readyState && e()
            })
        }
    }
    ,
    e.on = function(n, r, i, o) {
        var l, s, a;
        if (null == o ? a = l = i : (s = i,
        l = o,
        a = function(e) {
            l(e, s)
        }
        ),
        "input" == r && (!("oninput"in n) || t.util.isIE9OrOlder()))
            return e.util._onInputEventCompatibility(e.wrap(n), a);
        if (null == o)
            if (n.addEventListener)
                n.addEventListener(r, l, !1);
            else {
                if (!n.attachEvent)
                    throw new Error("Unsupported");
                n.attachEvent("on" + r, l)
            }
        else if (n.addEventListener)
            n.addEventListener(r, a, !1);
        else {
            if (!n.attachEvent)
                throw new Error("Unsupported");
            n.attachEvent("on" + r, a)
        }
        return {
            eventType: r,
            fn: a
        }
    }
    ,
    e._selectAll = function(n, r) {
        var i = r.querySelectorAll(n);
        return new e.OfsysDomElemArray(t.util.convertToArray(i, 0))
    }
    ,
    e._selectAllByClass = function(n, r) {
        var i;
        if (r.getElementsByClassName)
            i = r.getElementsByClassName(n);
        else {
            if (!r.querySelectorAll)
                throw new Error("Unsupported");
            i = r.querySelectorAll("." + n)
        }
        return new e.OfsysDomElemArray(t.util.convertToArray(i, 0))
    }
    ,
    e._select1 = function(t, n) {
        var r = n.querySelectorAll(t);
        if (1 == r.length)
            return new e.Elem(r[0]);
        throw 0 == r.length ? new Error("Element(s) not found : " + t) : new Error("Too many element(s) found for " + t + " : " + r.length)
    }
    ,
    e._selectByID = function(t, n) {
        if ("getElementById"in n) {
            if (null == (r = n.getElementById(t)))
                throw new Error("Element not found : " + t);
            return new e.Elem(r)
        }
        var r;
        if (null == (r = n.querySelector("#" + t)))
            throw new Error("Element not found : " + t);
        return new e.Elem(r)
    }
    ,
    e.svg = {
        create: function(t, n) {
            return e.nsCreate("http://www.w3.org/2000/svg", t, n)
        }
    },
    e.browserWindow = {
        getSize: function() {
            var e = 1080
              , t = 800;
            return window.innerHeight ? (e = window.innerWidth,
            t = window.innerHeight) : window.document.documentElement.clientHeight ? (e = window.document.documentElement.clientWidth,
            t = window.document.documentElement.clientHeight) : window.document.body.clientHeight && (e = window.document.body.clientWidth,
            t = window.document.body.clientHeight),
            {
                width: e,
                height: t
            }
        },
        getScrollTop: function() {
            return void 0 !== window.pageYOffset ? window.pageYOffset : "CSS1Compat" === (document.compatMode || "") ? document.documentElement.scrollTop : document.body.scrollTop
        },
        setScrollTop: function(t) {
            window.scrollTo(e.browserWindow.getScrollLeft(), t)
        },
        getScrollLeft: function() {
            return void 0 !== window.pageXOffset ? window.pageXOffset : "CSS1Compat" === (document.compatMode || "") ? document.documentElement.scrollLeft : document.body.scrollLeft
        },
        setScrollLeft: function(t) {
            window.scrollTo(t, e.browserWindow.getScrollTop())
        },
        getScrollWidth: function() {
            return document.body.scrollWidth
        },
        getScrollHeight: function() {
            return document.body.scrollHeight
        }
    }
}(window.DI.dom),
null == window.DI && (window.DI = {}),
null == window.DI.Push && (window.DI.Push = {}),
function(e) {
    "use strict";
    var t = "4953:GHGmojIeZImOaTCA0fOLNy2vaGopy9Av"
      , n = {
        "Unknown": 0,
        "Chrome": 4,
        "Firefox": 8
    }
      , r = !1;
    firebase.initializeApp({
        apiKey: 'AIzaSyDhT3n_qnl8xoxAlbGqb2n2VRwjwcBJVE0',
        authDomain: 'demodi-8272d.firebaseapp.com',
        databaseURL: 'https://demodi-8272d.firebaseio.com',
        projectId: 'demodi-8272d',
        storageBucket: 'demodi-8272d.appspot.com',
        messagingSenderId: '165900517247'
    });
    var i = firebase.messaging();
    function o() {
        return window.localStorage.getItem("PushToken")
    }
    function l() {
        var e = o();
        null != e && c(e)
    }
    function s() {
        return null !== window.localStorage.getItem("ContactIdentifier")
    }
    function a() {
        var e = window.localStorage.getItem("IsIdentitySent");
        return null != e && "1" == e
    }
    function u(e) {
        return window.localStorage.setItem("IsIdentitySent", e ? 1 : 0)
    }
    function c(e) {
        if (void 0 !== e && null !== e) {
            var i = window.localStorage.getItem("PushToken");
            if (!f() || null !== i && i !== e || s() && !a()) {
                var o = window.localStorage.getItem("ContactIdentifier")
                  , l = null
                  , c = null
                  , h = null;
                null != o && ("contact" == (l = (o = JSON.parse(o)).identificationType) || "sendlog" == l ? c = o.id + ":" + o.key : "project" == l && (h = o.keys));
                var m = {
                    ApplicationId: t,
                    ContactIdentificationType: l,
                    ContactIdentification: c,
                    Fields: h,
                    Token: e,
                    Domain: location.host,
                    Language: (window.navigator.userLanguage || window.navigator.language).substring(0, 2),
                    idPlatformPush: function(e) {
                        var t, n = new RegExp("Chrome/[.0-9]*(sMobile)?|CriOS"), i = new RegExp("Firefox/[.0-9]*$|FxiOS/"), o = navigator.userAgent;
                        t = n.test(o) ? "Chrome" : i.test(o) ? "Firefox" : "Unknown";
                        !0 === r && console.log(o + " matched with " + t);
                        return e[t]
                    }(n)
                };
                !0 === r && console.log("Sending token to server with data: ", m),
                window.DI.util.net.corsAjax({
                    url: "https://dev-webpush.dev-bm.hq2.rep/webservices/ofc4/push.ashx?method=SetToken",
                    data: JSON.stringify(m),
                    success: function(e) {
                        !0 === r && console.log(e),
                        d(!0),
                        u(null != o)
                    },
                    error: function(e, t) {
                        !0 === r && (console.log(e),
                        console.log(t))
                    }
                })
            } else
                !0 === r && console.log("Token already sent to server so won't send it again unless it changes");
            window.localStorage.setItem("PushToken", e)
        }
    }
    function f() {
        return 1 == window.localStorage.getItem("sentToServer")
    }
    function d(e) {
        window.localStorage.setItem("sentToServer", e ? 1 : 0)
    }
    i.onTokenRefresh(function() {
        i.getToken().then(function(e) {
            d(!1),
            c(e)
        }).catch(function(e) {
            !0 === r && console.log("Unable to retrieve refreshed token", e)
        })
    }),
    i.onMessage(function(e) {
        !0 === r && console.log("onMessage :Message received. ", e),
        function(e) {
            if (!Notification || "granted" !== Notification.permission || document.hidden)
                return;
            navigator.serviceWorker.getRegistration("/firebase-cloud-messaging-push-scope").then(function(t) {
                t.active.postMessage({
                    showNotification: e
                })
            }).catch(function(e) {
                !0 === r && console.log(e)
            })
        }(e)
    }),
    e.Init = function() {
        !function() {
            if (!s()) {
                var e = window.DI.util.getURLParameters();
                if (void 0 !== e.oft_id && void 0 !== e.oft_k) {
                    var t = {
                        id: e.oft_id,
                        key: e.oft_k,
                        identificationType: "sendlog"
                    };
                    window.localStorage.setItem("ContactIdentifier", JSON.stringify(t))
                } else if (void 0 !== e.oft_c && void 0 !== e.oft_ck) {
                    var t = {
                        id: e.oft_c,
                        key: e.oft_ck,
                        identificationType: "contact"
                    };
                    window.localStorage.setItem("ContactIdentifier", JSON.stringify(t))
                }
            }
        }(),
        f() && s() && !a() && l(),
        r = window.location.search.slice(1).split("&").indexOf("ofsysDebug=1") > -1
    }
    ,
    e.ResetIdentify = function() {
        u(!1),
        window.localStorage.removeItem("ContactIdentifier"),
        !0 === r && console.log("Identity reset")
    }
    ,
    e.Identify = function() {
        if (s())
            !0 === r && console.log("Contact already identified, " + window.localStorage.getItem("ContactIdentifier"));
        else {
            var e = {};
            if (1 === arguments.length && arguments[0].constructor === {}.constructor)
                for (var t in arguments[0])
                    e[t] = arguments[0][t];
            else if (1 === arguments.length && arguments[0].constructor === [].constructor && arguments[0].length % 2 == 0)
                for (var n = 0; n < arguments[0].length; n++)
                    n % 2 == 0 && "string" == typeof (t = arguments[0][n]) && 0 === t.indexOf("f_") && (e[t] = arguments[0][n + 1]);
            else {
                if (!(arguments.length > 0 && arguments.length % 2 == 0))
                    throw "invalid parameters";
                for (n = 0; n < arguments.length; n++)
                    n % 2 == 0 && "string" == typeof (t = arguments[n]) && 0 === t.indexOf("f_") && (e[t] = arguments[n + 1])
            }
            var i = {
                keys: e,
                identificationType: "project"
            };
            window.localStorage.setItem("ContactIdentifier", JSON.stringify(i)),
            !0 === r && console.log("Contact identified")
        }
        f() && !a() && l()
    }
    ,
    e.RequestPermission = function() {
        i.requestPermission().then(function() {
            i.getToken().then(function(e) {
                e ? c(e) : (!0 === r && console.log("No Instance ID token available. Request permission to generate one."),
                d(!1))
            }).catch(function(e) {
                !0 === r && console.log("An error occurred while retrieving token. ", e),
                showToken("Error retrieving Instance ID token. ", e),
                d(!1)
            })
        }).catch(function(e) {
            !0 === r && console.log("Unable to get permission to notify.", e)
        })
    }
    ,
    window.addEventListener("message", function(e) {
        if (!0 === r && (console.log("message received"),
        console.log(e)),
        void 0 !== e && null != e) {
            var t = e;
            if (e.constructor === "".constructor)
                try {
                    t = JSON.parse(e)
                } catch (e) {
                    return
                }
            if (void 0 !== t.data && null != t.data)
                if ("di:" == ("" + t.data).substr(0, 3)) {
                    var n = o();
                    n ? e.source.postMessage("di:" + JSON.stringify({
                        event: "sendtoken",
                        value: n
                    }), "*") : e.source.postMessage("di:" + JSON.stringify({
                        event: "sendtoken",
                        value: null
                    }), "*")
                }
        }
    })
}(window.DI.Push),
window.DI.dom.onLoad(function() {
    window.DI.Push.Init()
});
