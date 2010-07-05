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
            this.getDocument().body.appendChild(this.createScriptTag(text))
            
            callback()
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
                    setTimeout(callback, 1)
            }
            
            return node
        }        
    }
})


/**

Name
====

Scope.Provider.Role.WithDOM - role for scope provider, which uses `script` tag for running the code.


SYNOPSIS
========

        Class('Scope.Provider.IFrame', {
            
            isa     : Scope.Provider,
            
            does    : Scope.Provider.Role.WithDOM,
            
            ...
        })

DESCRIPTION
===========

`Scope.Provider.Role.WithDOM` requires the implementation of the `getDocument` method, which should return the
document into which the `script` tags will be created.

In return, this role provides the implementation of `runCode` and `runScript`.




GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/Scope-Provider/issues>

For general Joose questions you can also visit [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1) 
on irc.freenode.org or the forum at: <http://joose.it/forum>
 


SEE ALSO
========

Web page of this module: <http://github.com/SamuraiJack/Scope-Provider/>

General documentation for Joose: <http://openjsan.org/go/?l=Joose>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/Scope-Provider/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>





COPYRIGHT AND LICENSE
=====================

This software is Copyright (c) 2010 by Nickolay Platonov <nplatonov@cpan.org>.

This is free software, licensed under:

  The GNU Lesser General Public License, Version 3, June 2007

*/