Role('Scope.Provider.Role.WithDOM', {
    
    requires    : [ 'getDocument' ],
    
    have : {
        parentWindow    : null
    },
    
    
    after : {
        
        initialize : function () {
            this.parentWindow = this.parentWindow || window
        }
    },
    
        
    methods : {
        
        runCode : function (text, callback) {
            this.getDocument().body.appendChild(this.createScriptTag(text, null, callback))
        },
        
        
        runScript : function (url, callback) {
            this.getDocument().body.appendChild(this.createScriptTag(null, url, callback))
        },
        
        
        createScriptTag : function (text, url, callback) {
            var node = this.getDocument().createElement("script")
            
            node.setAttribute("type", "text/javascript")
            
            if (url) node.setAttribute("src", url)
            
            if (text) node.text = text
            
            if (callback) node.onload = node.onreadystatechange = function() {
                if (!node.readyState || node.readyState == "loaded" || node.readyState == "complete" || node.readyState == 4 && node.status == 200)
                    //surely for IE6..
                    setTimeout(onload, 1)
            }
            
            return node
        }        
    }
})