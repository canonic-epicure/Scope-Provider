Class('Scope.Provider.IFrame', {
    
    isa     : Scope.Provider,
    
    does    : Scope.Provider.Role.WithDOM,
    
    
    have : {
        sourceURL       : '/jsan/Test/Run/static/stub.html',
        
        iframe          : null
    },
    

    methods : {
        
        getDocument : function () {
            return this.iframe.contentWindow.document
        },
        
        
        setup : function (callback) {
            
            var doc = this.parentWindow.document
            
            var iframe = this.iframe = doc.createElement('iframe')
                
            if (iframe.attachEvent) 
                iframe.attachEvent('onload', callback)
            else
                iframe.onload = callback
                
            iframe.src = this.sourceURL
                
            doc.body.appendChild(iframe)
                
            this.scope = iframe.contentWindow
        }
    }
})