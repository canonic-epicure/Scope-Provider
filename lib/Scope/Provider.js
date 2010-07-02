Class('Scope.Provider', {
    
    have : {
        scope       : null
    },
    
        
    methods : {
        
        setup : function (callback) {
            throw "Abstract method `setup` of Scope.Provider called"
        },
        
        
        cleanup : function () {
            throw "Abstract method `cleanup` of Scope.Provider called"
        },
        
        
        runCode : function (text, callback) {
            throw "Abstract method `runCode` of Scope.Provider called"
        },
        
        
        runScript : function (url, callback) {
            throw "Abstract method `runScript` of Scope.Provider called"
        }
    }
})