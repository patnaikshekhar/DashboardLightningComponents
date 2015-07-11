({
	refresh : function(component, obj, id) {
		// Run method with inputs
        var action = component.get("c.getRelationshipCounts");
        action.setParams({
            objectName: obj,
            objectId: id,
            types: component.get('v.types')
        });
        
        DNuggetCommonLibrary.runServerMethod(action, function(results) {
            // Transform the result to be displayed on the UI
            var resultObj = Object.keys(results).map(function(value, index) {
                return {
                    name: value,
                    count: results[value]
                }
            });
            
            component.set('v.objects', resultObj);
        });
	}
})