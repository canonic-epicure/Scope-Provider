Class('Scope.Provider', {
    
    /*VERSION,*/
    
    has     : {
        scope               : null,
        
        preload             : {
            is      : 'ro',
            init    : Joose.I.Array
        }
    },
    
        
    methods : {
        
        isCSS : function (url) {
            return /\.css(\?.*)?$/i.test(url)
        },
        
        
        addPreload : function (preloadDesc) {
            if (typeof preloadDesc == 'string')
                
                if (this.isCSS(preloadDesc)) 
                    preloadDesc = {
                        type        : 'css',
                        url         : preloadDesc
                    }
                else
                    preloadDesc = {
                        type        : 'js',
                        url         : preloadDesc
                    }
            else
            
                if (preloadDesc.text) 
                    preloadDesc = {
                        type        : 'js',
                        content     : preloadDesc.text
                    }
                
            this.preload.push(preloadDesc)
        },
        
        
        batchRealize : function (callback) {
            throw "Abstract method `batchRealize` of Scope.Provider called"
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