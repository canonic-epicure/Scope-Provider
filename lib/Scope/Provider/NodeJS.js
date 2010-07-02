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