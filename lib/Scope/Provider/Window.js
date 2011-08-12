Class('Scope.Provider.Window', {
    
    isa     : Scope.Provider,

    does    : Scope.Provider.Role.WithDOM,
    
    
    have : {
        popupWindow     : null,
        
        sourceURL       : '/jsan/Scope/Provider/static/stub-window.html'
    },
    

    methods : {
        
        create : function () {
            var popup   = this.scope = this.popupWindow = this.parentWindow.open(this.sourceURL, '_blank', "width=800,height=600")
            
            if (!popup) {
                alert('Please enable popups for the host with this test suite running')
                throw 'Please enable popups for the host with this test suite running'
            }
            
            return popup
        },
        
        
        setup : function (callback) {
            var me      = this
            
            var popup   = this.create()
            
            var interval = setInterval(function () {
                
                if (popup.__IS_LOADED__) {
                    
                    clearInterval(interval)
                    
                    callback(me)
                }
            }, 50)
        },
        
        
        getDocument : function () {
            return this.popupWindow.document
        },
        
        
        cleanup : function () {
            this.popupWindow.onload = null
            this.popupWindow.close()
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