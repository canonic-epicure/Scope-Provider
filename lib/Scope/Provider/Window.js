Class('Scope.Provider.Window', {
    
    isa     : Scope.Provider,

    does    : Scope.Provider.Role.WithDOM,
    
    
    have : {
        popupWindow     : null,
        
        sourceURL       : '/jsan/Scope/Provider/static/stub-window.html'
    },
    

    methods : {
        
        setup : function (callback) {
            var me      = this
            var popup   = this.scope = this.popupWindow = this.parentWindow.open(src, '_blank')
            
            var subCallback = function () {
                callback(me)
            }
            
            if (!popup) {
                alert('Please enable popups for the host with this test suite running')
                throw 'Please enable popups for the host with this test suite running'
            }
            
            popup.onload = subCallback
        },
        
        
        getDocument : function () {
            return this.popup.document
        }
    }
})