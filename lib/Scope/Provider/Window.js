Class('Scope.Provider.Window', {
    
    isa     : Scope.Provider,

    does    : Scope.Provider.Role.WithDOM,
    
    
    have : {
        popupWindow     : null,
        
        sourceURL       : '/jsan/Test/Run/static/stub-window.html'
    },
    

    methods : {
        
        setup : function (callback) {
            var popup = this.scope = this.popupWindow = this.parentWindow.open(src, '_blank')
            
            if (!popup) {
                alert('Please enable popups for the host with this test suite running')
                throw 'Please enable popups for the host with this test suite running'
            }
            
            popup.onload = callback
        },
        
        
        getDocument : function () {
            return this.popup.document
        }
    }
})