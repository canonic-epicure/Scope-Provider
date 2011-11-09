Role('Scope.Provider.Role.WithDOM', {
    
    requires    : [ 'getDocument', 'create', 'getPreload', 'isAlreadySetUp' ],
    
    has : {
        useStrictMode   : true,
        sourceURL       : null,
        
        parentWindow    : function () { return window },
        scopeId         : function () { return Math.round(Math.random() * 1e10) },
        
        // a cached "onerror" handler, which means "addOnErrorHandler" was called prior context initialization
        onErrorHandler  : null
    },
    
    
    before : {
        
        cleanup : function () {
            this.scope.onerror = null
            
            var scopeProvider = this.parentWindow.Scope.Provider
            
            delete scopeProvider.__ONLOAD__[ this.scopeId ]
        }
    },
    
        
    methods : {
        
        getHead : function () {
            return this.getDocument().getElementsByTagName('head')[ 0 ]
        },
        
        
        addOnErrorHandler : function (handler) {
            if (this.isAlreadySetUp()) {
                var scopeWindow         = this.scope
                
                var prevHandler         = scopeWindow.onerror
                if (prevHandler && prevHandler.__MANAGED__) return
                
                var wrapper = function (message, url, lineNumber) {
                    // prevent recursive calls if other authors politely did not overwrite the handler and will call it
                    if (handler.__CALLING__) return
                    
                    handler.__CALLING__ = true
                    
                    prevHandler && prevHandler.apply(this, arguments)
                
                    handler.apply(this, arguments)
                    
                    handler.__CALLING__ = false
                    
                    // in FF/IE need to return `true` to prevent default action
                    return scopeWindow.WebKitPoint ? false : true 
                }
                
                wrapper.__MANAGED__ = true
                
                scopeWindow.onerror = wrapper
            } else {
                this.onErrorHandler = handler
            }
        },
        
        
        addSeedingToPreload : function () {
            var preload             = this.getPreload()
                
            if (this.seedingCode) preload.unshift({
                type        : 'js',
                content     : this.seedingCode
            })
            
            if (this.seedingScript) preload.push({
                type        : 'js',
                url         : this.seedingScript
            })
        },
        
        
        setup : function (callback) {
            var isIE                = 'v' == '\v' || Boolean(this.parentWindow.msWriteProfilerMark)
//            var isOpera             = Object.prototype.toString.call(this.parentWindow.opera) == '[object Opera]'
            var hasInlineScript     = false
            
            Joose.A.each(this.getPreload(), function (preloadDesc) {
                // IE will execute the inline scripts ASAP, this might be not what we want (inline script might be need executed only after some url script)
                // its however ok in some cases (like adding `onerror` handler
                // such inline scripts should be marked with `unordered` - true
                if (preloadDesc.type == 'js' && preloadDesc.content && !preloadDesc.unordered) {
                    hasInlineScript = true
                    
                    return false
                } 
            })
            
            if (this.sourceURL || isIE && hasInlineScript) {
                this.addSeedingToPreload()
                
                this.setupIncrementally(callback)
                
            } else {
                // for sane browsers just add the seeding code and seeding script to preloads
                if (!isIE) this.addSeedingToPreload()
                
                // seeding scripts are included only for sane browsers (not IE)
                this.setupWithDocWrite(callback, isIE)
            }
        },
        
        
        setupWithDocWrite : function (callback, needToSeed) {
            var html        = []
            var me          = this
            
            Joose.A.each(this.getPreload(), function (preloadDesc) {
                
                if (preloadDesc.type == 'js') 
                    html.push(me.getScriptTagString(preloadDesc.url, preloadDesc.content))
                    
                else if (preloadDesc.type == 'css') 
                    html.push(me.getLinkTagString(preloadDesc.url, preloadDesc.content))
                
                else throw "Incorrect preload descriptor " + preloadDesc
            })
            
            // no need to wait for DOM ready - we'll overwrite it anyway
            this.create()
            
            var scopeId              = this.scopeId
            
            this.parentWindow.Scope.Provider.__ONLOAD__[ scopeId ]    = function () {

                var cont = function () { callback && callback(me) }
                
                // sane browsers - seeding code and script has been already added
                if (!needToSeed) { cont(); return }
                
                // our beloved IE - manually seeding the scope
                
                if (me.seedingCode) me.runCode(me.seedingCode)
                
                if (me.seedingScript) 
                    me.runScript(me.seedingScript, cont)
                else
                    cont()
            }
            
            var doc             = this.getDocument()
            
            doc.open()
            
            doc.write([
                this.useStrictMode ? '<!DOCTYPE html>' : '',
                '<html style="width: 100%; height: 100%; margin : 0; padding : 0;">',
                    '<head>',
                        html.join(''),
                    '</head>',
    
                    '<body style="margin : 0; padding : 0; width: 100%; height: 100%" onload="(window.opener || window.parent).Scope.Provider.__ONLOAD__[' + scopeId + ']()">',
                    '</body>',
                '</html>'
            ].join(''))
            
            doc.close()
        },
        
        
        setupIncrementally : function (callback) {
            var me      = this
            
            this.create(function () {
                
                var loadScripts     = function (preloads, callback) {
                    
                    var cont = function () { loadScripts(preloads, callback) }
                    
                    if (!preloads.length) 
                        callback && callback()
                    else {
                        var preloadDesc     = preloads.shift()
                        
                        if (preloadDesc.url) 
                            me.runScript(preloadDesc.url, cont)
                        else 
                            if (preloadDesc.type == 'js')
                                me.runCode(preloadDesc.content, cont)
                            else {
                                me.addStyleTag(preloadDesc.content)
                                
                                cont()
                            }
                    }
                }
                
                loadScripts(me.getPreload().slice(), callback)
            })
        },        
        
        
        getScriptTagString : function (url, text) {
            var res = '<script type="text/javascript"'
            
            if (url) 
                res     += ' src="' + url + '"></script>'
            else
                res     += '>' + text.replace(/<\/script>/gi, '\\x3C/script>') + '</script>'
                
            return res
        },
        
        
        getLinkTagString : function (url, text) {
            if (url) return '<link href="' + url + '" rel="stylesheet" type="text/css" />'
            
            if (text) return '<style>' + text + '</style>'
        },
        
        
        loadCSS : function (url, callback) {
            var doc         = this.getDocument()
            
            var link        = doc.createElement('link')
            
            link.type       = 'text/css'
            link.rel        = 'stylesheet'
            link.href       = url
        
            this.getHead().appendChild(link)
        
            var img = doc.createElement('img')
            
            img.onerror = function () {
                if (callback) callback()
                
                doc.body.removeChild(img)
            }
        
            doc.body.appendChild(img)
            
            img.src = url
        },
        
        
        runCode : function (text, callback) {
            this.getHead().appendChild(this.createScriptTag(text))
            
            callback && callback()
        },
        
        
        runScript : function (url, callback) {
            if (this.isCSS(url))
                this.loadCSS(url, callback)
            else
                this.getHead().appendChild(this.createScriptTag(null, url, callback))
        },
        
        
        createScriptTag : function (text, url, callback) {
            var node = this.getDocument().createElement("script")
            
            node.setAttribute("type", "text/javascript")
            
            if (url) node.setAttribute("src", url)
            
            if (text) node.text = text
            
            if (callback) node.onload = node.onreadystatechange = function() {
                if (!node.readyState || node.readyState == "loaded" || node.readyState == "complete" || node.readyState == 4 && node.status == 200) {
                    node.onload = node.onreadystatechange = null
                    
                    //surely for IE6..
                    if ('v' == '\v') 
                        setTimeout(callback, 0)
                    else
                        callback()
                }
            }
            
            return node
        },
        
        
        addStyleTag : function (text) {
            var document    = this.getDocument()
            var node        = document.createElement('style')
            
            node.setAttribute("type", "text/css")
            
            var head = document.getElementsByTagName('head')[0]
            head.appendChild(node)
            
            if (node.styleSheet) {   // IE
                node.styleSheet.cssText = text
            } else {                // the world
                node.appendChild(document.createTextNode(text))
            }
        }        
    }
})


/**

Name
====

Scope.Provider.Role.WithDOM - role for scope provider, which uses `script` tag for running the code.


SYNOPSIS
========

        Class('Scope.Provider.IFrame', {
            
            isa     : Scope.Provider,
            
            does    : Scope.Provider.Role.WithDOM,
            
            ...
        })

DESCRIPTION
===========

`Scope.Provider.Role.WithDOM` requires the implementation of the `getDocument` method, which should return the
document into which the `script` tags will be created.

In return, this role provides the implementation of `runCode` and `runScript`.




GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/Scope-Provider/issues>

For general Joose questions you can also visit [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1) 
on irc.freenode.org or the forum at: <http://joose.it/forum>
 


SEE ALSO
========

Web page of this module: <http://github.com/SamuraiJack/Scope-Provider/>

General documentation for Joose: <http://joose.github.com/Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/Scope-Provider/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>





COPYRIGHT AND LICENSE
=====================

This software is Copyright (c) 2010 by Nickolay Platonov <nplatonov@cpan.org>.

This is free software, licensed under:

  The GNU Lesser General Public License, Version 3, June 2007

*/