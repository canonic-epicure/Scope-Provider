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
            
            // XXX setup NodeJS globals like 'require', 'process', etc
            
            callback(this)
        },
        
        
        runCode : function (text, callback) {
            this.runner(text)
            
            callback()
        },
        
        
        runScript : function (url, callback) {
            var content = require('fs').readFileSync(url)
            
            this.runCode(content, callback)
        }
    }
})