Class('Scope.Provider.IFrame', {
    
    isa     : Scope.Provider,
    
    does    : Scope.Provider.Role.WithDOM,
    
    
    have : {
        iframe          : null,
        cls             : null,
        
        parentEl        : null
    },
    

    methods : {
        
        getDocument : function () {
            return this.iframe.contentWindow.document
        },
        
        
        create : function (onLoadCallback) {
            var me      = this
            var self    = { self : this }
            var doc     = this.parentWindow.document
            var iframe  = this.iframe = doc.createElement('iframe')
            
            var minViewportSize     = this.minViewportSize
            
            iframe.className        = this.cls || ''
            iframe.style.width      = (minViewportSize && minViewportSize.width || 1024) + 'px'
            iframe.style.height     = (minViewportSize && minViewportSize.height || 768) + 'px'
            iframe.setAttribute('frameborder', 0)

            var ignoreOnLoad        = false    
            
            var callback = function () {
                if (ignoreOnLoad) return
                
                if (iframe.detachEvent) 
                    iframe.detachEvent('onload', callback)
                else
                    iframe.onload = null
                
                onLoadCallback && onLoadCallback(me)
            }
            
            if (iframe.attachEvent) 
                iframe.attachEvent('onload', callback)
            else
                iframe.onload = callback
            
            iframe.src = this.sourceURL || 'about:blank'
            
            ;(this.parentEl || doc.body).appendChild(iframe)
            
            var scope   = this.scope = iframe.contentWindow
            var doc     = this.getDocument()
            
            // dances with tambourine around the IE, somehow fixes the cross-domain limits
            if ('v' == '\v' || Boolean(this.parentWindow.msWriteProfilerMark)) {
                // only ignore the 1st call to callback when there is a `sourceURL` config
                // which will later be assigned to `iframe.src` and will trigger a new iframe loading
                if (this.sourceURL) ignoreOnLoad = true
                
                doc.open()
                doc.write('')
                doc.close()
                
                ignoreOnLoad = false
                
                iframe.onreadystatechange = function () {
                    if (iframe.readyState == 'complete') iframe.onreadystatechange = null
                    
                    // trying to add the "early" onerror handler on each "readyState" change
                    // for some mystical reasons can't use `me.installOnErrorHandler` need to inline the call
                    if (me.cachedOnError) me.attachToOnError(scope, me.scopeId, me.cachedOnError)
                }
                
                if (this.sourceURL) iframe.src = this.sourceURL
            }
            
            // trying to add the "early" onerror handler - installing it in this stage will only work in FF 
            // (other browsers will clear on varios stages)
            if (me.cachedOnError) me.installOnErrorHandler(me.cachedOnError)
        },
        
        
        cleanup : function () {
            var iframe      = this.iframe
            var win         = this.scope
            var me          = this
            
            iframe.style.display    = 'none'
            
            var onUnloadChecker = function () {
                if (!window.onunload) window.onunload = function () { return 'something' }
            }
            
            // add the `onunload` handler if there's no any - attempting to prevent browser from caching the iframe
            // trying to create the handler from inside of the scope
            this.runCode(';(' + onUnloadChecker.toString() + ')();')

            this.iframe     = null
            this.scope      = null

            // wait for 1000ms to allow time for possible `setTimeout` in the scope of iframe
            setTimeout(function () {
                
                if (me.beforeCleanupCallback) me.beforeCleanupCallback()
                
                // chaging the page, triggering `onunload` and hopefully preventing browser from caching the content of iframe
                iframe.src              = 'javascript:false'
                
                // wait again before removing iframe from the DOM, as recommended by some online sources
                setTimeout(function () {
                    ;(me.parentEl || me.parentWindow.document.body).removeChild(iframe)
                    
                    iframe  = null
                    win     = null
                    
                    if (me.cleanupCallback) me.cleanupCallback()
                    
                }, 1000)
            }, 1000)
        }
    }
})

/**

Name
====

Scope.Provider.IFrame - scope provider, which uses the iframe.


SYNOPSIS
========

        var provider = new Scope.Provider.IFrame()
        
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

`Scope.Provider.IFrame` is an implementation of the scope provider, which uses the iframe, 
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