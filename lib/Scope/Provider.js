Class('Scope.Provider', {
    
    /*VERSION,*/
    
    has     : {
        scope               : null,
        
        preload             : {
            is      : 'rw',
            init    : Joose.I.Array
        }
    },
    
        
    methods : {
        
        addPreload : function (preloadDesc) {
            this.preload.push(preloadDesc)
        },
        
        
        batchRealize : function (callback) {
        },
        
        
        create : function () {
            throw "Abstract method `create` of Scope.Provider called"
        },
        
        
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