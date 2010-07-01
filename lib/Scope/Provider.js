Class('Scope.Provider', {
    
    have : {
        scope       : null
    },
    
        
    methods : {
        
        setup : function (callback) {
            throw "Abstract method `setup` of Scope.Provider called"
        },
        
        
        execute : function (text, callback) {
            throw "Abstract method `execute` of Scope.Provider called"
        },
        
        
        executeScript : function (url, callback) {
            throw "Abstract method `executeScript` of Scope.Provider called"
        }
    }
})