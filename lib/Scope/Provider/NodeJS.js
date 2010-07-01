Class('Scope.Provider.NodeJS', {
    
    isa     : Scope.Provider,

    
    have : {
        runner          : null,
        sandbox         : null,
    },
    

    methods : {
        
        setup : function (callback) {
            this.sandbox    = {}
            
            var Script      = process.binding('evals').Script
            var runner      = function (code) { return eval(code) }
            
            this.runner     = Script.runInNewContext('__RUNNER__ = ' + runner.toString(), this.sandbox)
            
            callback()
        },
        
        
        execute : function (text, callback) {
            this.runner(text)
            
            callback()
        },
        
        
        executeScript : function (url, callback) {
            var content = require('fs').readFileSync(url)
            
            this.execute(content, callback)
        }
    }
})