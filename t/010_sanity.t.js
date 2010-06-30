StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('Scope.Provider', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(Scope.Provider, "Scope.Provider is here")
        
        t.endAsync(async0)
    })
})    