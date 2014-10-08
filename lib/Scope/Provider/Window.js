Class('Scope.Provider.Window', {
    
    isa     : Scope.Provider,

    does    : Scope.Provider.Role.WithDOM,
    
    
    has     : {
        popupWindow     : null
    },
    

    methods : {
        
        create : function (onLoadCallback) {
            var popup   = this.scope = this.popupWindow = this.parentWindow.open(this.sourceURL || 'about:blank', '_blank', "width=800,height=600")
            
            if (!popup) {
                alert('Please enable popups for the host with this test suite running: ' + this.parentWindow.location.host)
                throw 'Please enable popups for the host with this test suite running: ' + this.parentWindow.location.host
            }
            
            var isIE = 'v' == '\v' || Boolean(this.parentWindow.msWriteProfilerMark)
            
            // dances with tambourine around the IE
            if (isIE && !this.sourceURL) {
                var doc = this.getDocument()
                
                doc.open()
                doc.write('')
                doc.close()
            }
            
            // trying to add the "early" onerror handler - will probably only work in FF
            if (this.cachedOnError) this.installOnErrorHandler(this.cachedOnError)
            
            /*!
             * contentloaded.js
             *
             * Author: Diego Perini (diego.perini at gmail.com)
             * Summary: cross-browser wrapper for DOMContentLoaded
             * Updated: 20101020
             * License: MIT
             * Version: 1.2
             *
             * URL:
             * http://javascript.nwbox.com/ContentLoaded/
             * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
             *
             */
            
            // @win window reference
            // @fn function reference
            var contentLoaded = function (win, fn) {
            
                var done = false, top = true,
            
                doc = win.document, root = doc.documentElement,
            
                add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
                rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
                pre = doc.addEventListener ? '' : 'on',
            
                init = function(e) {
                    if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                    
                    (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                    
                    if (!done && (done = true)) fn.call(win, e.type || e);
                },
            
                poll = function() {
                    try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
                    
                    init('poll');
                };
            
                if (doc.readyState == 'complete') 
                    fn.call(win, 'lazy');
                else {
                    if (doc.createEventObject && root.doScroll) {
                        try { top = !win.frameElement; } catch(e) { }
                        if (top) poll();
                    }
                    doc[add](pre + 'DOMContentLoaded', init, false);
                    doc[add](pre + 'readystatechange', init, false);
                    win[add](pre + 'load', init, false);
                }
            }
            
            contentLoaded(popup, onLoadCallback || function () {})
        },
        
        
        getDocument : function () {
            return this.popupWindow.document
        },
        
        
        cleanup : function () {
            if (this.beforeCleanupCallback) this.beforeCleanupCallback()
            
            this.popupWindow.close()
            
            this.popupWindow = null
            
            this.cleanupHanlders()
            
            if (this.cleanupCallback) this.cleanupCallback()
        }
    }
})

/**

Name
====

Scope.Provider.Window - scope provider, which uses the popup browser window.


SYNOPSIS
========

        var provider = new Scope.Provider.Window()
        
        provider.setup(function () {
        
            if (provider.scope.SOME_GLOBAL == 'some_value') {
                ...
            }
            
            provider.runCode(text, callback)
            
            ...
            
            provider.runScript(url, callback)
            
            ...
            
            provider.cleanup()        
        })


DESCRIPTION
===========

`Scope.Provider.Window` is an implementation of the scope provider, which uses the popup browser window, 
to create a new scope.


ISA
===

[Scope.Provider](../Provider.html)


DOES
====

[Scope.Provider.Role.WithDOM](Role/WithDOM.html)



GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/Scope-Provider/issues>

You can also ask questions at IRC channel : [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1)
 
Or the mailing list: <http://groups.google.com/group/joose-js>
 


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