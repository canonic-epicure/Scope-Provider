Class('Scope.Provider.NodeJS', {
    
    isa     : Scope.Provider,

    
    has     : {
        sourceURL       : null
    },
    

    methods : {
        
        compile : function (module, content, filename) {
            var Module    = require('module')
            var path      = require('path')
            
            var self      = module;
            // remove shebang
            content       = content.replace(/^\#\!.*/, '');
        
            var modRequire     = function (path) {
                return self.require(path);
            }
        
            modRequire.resolve = function(request) {
                return Module._resolveFilename(request, self)[1];
            };
        
            Object.defineProperty(modRequire, 'paths', { get: function() {
                throw new Error('modRequire.paths is removed. Use ' +
                            'node_modules folders, or the NODE_PATH '+
                            'environment variable instead.');
            }});
        
            modRequire.main = process.mainModule;
        
            // Enable support to add extra extension types
            modRequire.extensions = Module._extensions;
            modRequire.registerExtension = function() {
                throw new Error('modRequire.registerExtension() removed. Use ' +
                            'modRequire.extensions instead.');
            };
        
            modRequire.cache = Module._cache;
        
            var dirname = path.dirname(filename);
        
            // create wrapper function
            var wrapper = Module.wrap(content);
            
            var compiledWrapper = require('vm').runInContext(wrapper, this.scope, filename);
            
            return compiledWrapper.apply(self.exports, [self.exports, modRequire, self, filename, dirname]);
        },        
        
        
        addOnErrorHandler : function (handler, callback) {
        },

        
        create : function (callback) {
            var vm          = require('vm')
            var sandbox     = {}

            Joose.O.extend(sandbox, {
//                __PROVIDER__    : true,
                
                process         : process,
                
                global          : sandbox,
                root            : root,
                
                setTimeout      : setTimeout,
                clearTimeout    : clearTimeout,
                setInterval     : setInterval,
                clearInterval   : clearInterval
//                ,
//                
//                __filename      : __filename,
//                __dirname       : __dirname,
//                module          : module
            })
            
            var scope       = this.scope    = vm.createContext(sandbox)
            
            callback && callback()
        },
        
        
        setup : function (callback) {
            this.create()
            
            var me      = this
            
            if (this.seedingCode) require('vm').runInContext(this.seedingCode, this.scope)
            
            Joose.A.each(this.getPreload(), function (preloadDesc) {
                
                if (preloadDesc.type == 'js')
                    if (preloadDesc.url)
                        me.runScript(preloadDesc.url)
                    else
                        me.runCode(preloadDesc.content)
            })
            
            if (this.seedingScript) {
                var Module          = require('module')
                var path            = require('path')
                
                var module          = new Module('./' + this.sourceURL, require.main)
                
                var filename        = module.filename = path.join(path.dirname(require.main.filename), this.sourceURL)
                
                var content         = require('fs').readFileSync(filename, 'utf8')
                // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
                // because the buffer-to-string conversion in `fs.readFileSync()`
                // translates it to FEFF, the UTF-16 BOM.
                if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1)
  
                this.compile(module, content, filename)
            }
            
            callback && callback()
        },
        
        
        runCode : function (text, callback) {
            var res = require('vm').runInContext(text, this.scope)
            
            callback && callback(res)
            
            return res
        },
        
        
        runScript : function (url, callback) {
            var content = require('fs').readFileSync(url, 'utf8')
            
            var res = require('vm').runInContext(content, this.scope, url)
            
            callback && callback(res)
            
            return res
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