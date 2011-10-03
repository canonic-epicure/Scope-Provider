Class('Scope.Provider.IFrame', {
    
    isa     : Scope.Provider,
    
    does    : Scope.Provider.Role.WithDOM,
    
    
    have : {
        iframe          : null,
        
        parentEl        : null
    },
    

    methods : {
        
        getDocument : function () {
            return this.iframe.contentWindow.document
        },
        
        
        create : function (onLoadCallback) {
            var me      = this
            var doc     = this.parentWindow.document
            var iframe  = this.iframe = doc.createElement('iframe')
            
            iframe.style.width      = '800px'
            iframe.style.height     = '600px'
            iframe.setAttribute('frameborder', 0)

            var ignoreOnLoad        = false    
            
            var callback = function () {
                if (ignoreOnLoad) return
                
                iframe.onload   = null
                
                onLoadCallback && onLoadCallback(me)
            }
            
            if (iframe.attachEvent) 
                iframe.attachEvent('onload', callback)
            else
                iframe.onload = callback
            
            iframe.src = this.sourceURL || 'about:blank'
            
            ;(this.parentEl || doc.body).appendChild(iframe)
            
            var doc = this.getDocument()
            
            // dances with tambourine around the IE, somehow fixes the cross-domain limits
            // (as the about:blank seems not 
            if ('v' == '\v' || Boolean(this.parentWindow.msWriteProfilerMark)) {
                ignoreOnLoad = true
                
                doc.open()
                doc.write('')
                doc.close()
                
                ignoreOnLoad = false
                
                if (this.sourceURL) iframe.src = this.sourceURL
            }
            
            this.scope = iframe.contentWindow
        },
        
        
        cleanup : function () {
            var iframe      = this.iframe
            
            ;(this.parentEl || this.parentWindow.document.body).removeChild(iframe)
            
            this.iframe     = null
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