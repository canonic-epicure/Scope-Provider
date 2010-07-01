Class('Scope.Provider.NodeJS', {
    
    isa     : Scope.Provider,

    
    have : {
        runner          : null
    },
    

    methods : {
        
        setup : function (callback) {
            var Script  = process.binding('evals').Script
            
            var runner  = this.runner   = Script.runInNewContext('__RUNNER__ = function (code) { return eval(code) }', {})
            var scope   = this.scope    = runner('(function(){ return this })()')
            
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