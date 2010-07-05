Class('Scope.Provider.NodeJS', {
    
    isa     : Scope.Provider,

    
    have : {
        runner          : null
    },
    

    methods : {
        
        setup : function (callback) {
            var Script  = process.binding('evals').Script
            
            var runnerSource = function (code) {
                return (function () { return eval(code) })()
            }
            
            var runner  = this.runner   = Script.runInNewContext('__RUNNER__ = ' + runnerSource.toString(), {})
            var scope   = this.scope    = runner('this')
            
            Joose.O.extend(scope, {
                process       : process,
                require       : require,
                
                global        : scope,
                
                setTimeout    : setTimeout,
                clearTimeout  : clearTimeout,
                setInterval   : setInterval,
                clearInterval : clearInterval
            })
            
            callback(this)
        },
        
        
        runCode : function (text, callback) {
            this.runner(text)
            
            callback()
        },
        
        
        runScript : function (url, callback) {
            var content = require('fs').readFileSync(url)
            
            this.runCode(content, callback)
        },
        
        
        cleanup : function () {
        }
    }
})


/**

Name
====

Scope.Provider.NodeJS - scope provider, which uses the `Script.runInNewContext` call of the NodeJS.


SYNOPSIS
========

        var provider = new Scope.Provider.NodeJS()
        
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

`Scope.Provider.NodeJS` is an implementation of the scope provider, 
which uses the `Script.runInNewContext` call of the NodeJS platform.


ISA
===

[Scope.Provider](../Provider.html)



GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/Scope-Provider/issues>

For general Joose questions you can also visit [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1) 
on irc.freenode.org or the forum at: <http://joose.it/forum>
 


SEE ALSO
========

Web page of this module: <http://github.com/SamuraiJack/Scope-Provider/>

General documentation for Joose: <http://openjsan.org/go/?l=Joose>


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