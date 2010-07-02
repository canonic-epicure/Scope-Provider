Class('Scope.Provider.IFrame', {
    
    isa     : Scope.Provider,
    
    does    : Scope.Provider.Role.WithDOM,
    
    
    have : {
        sourceURL       : '/jsan/Scope/Provider/static/stub.html',
        
        iframe          : null
    },
    

    methods : {
        
        getDocument : function () {
            return this.iframe.contentWindow.document
        },
        
        
        setup : function (callback) {
            var me      = this
            var doc     = this.parentWindow.document
            var iframe  = this.iframe = doc.createElement('iframe')
            
            var subCallback = function () {
                callback(me)
            }
                
            if (iframe.attachEvent) 
                iframe.attachEvent('onload', subCallback)
            else
                iframe.onload = subCallback
                
            iframe.src = this.sourceURL
                
            doc.body.appendChild(iframe)
                
            this.scope = iframe.contentWindow
        },
        
        
        cleanup : function () {
            var iframe      = this.iframe
            
            iframe.onload   = null
            
            this.parentWindow.document.body.removeChild(iframe)
        }
        
    }
})