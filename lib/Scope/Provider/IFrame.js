Class('Scope.Provider.IFrame', {
    
    does : Scope.Provider.Role.WithDOM,
    
    have : {
        sourceURL       : '/jsan/Test/Run/static/stub.html'
    },
    

    methods : {
        
        initialize : function () {
            this.document = this.document || document
        },
        
        
        customize : function (iframe) {
        },
        
        
        setup : function (callback) {
            
            var doc = this.parentDoc
            
            var iframe = doc.createElement('iframe')
                
            if (iframe.attachEvent) 
                iframe.attachEvent('onload', callback)
            else
                iframe.onload = callback
                
            iframe.src = this.sourceURL
                
            this.customize(iframe)
                
            doc.body.appendChild(iframe)
                
            this.scope = iframe.contentWindow
        }
    }
})