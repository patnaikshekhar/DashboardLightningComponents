({
	recordSelected : function(component, event, helper) {
        
        // Make component visible
		$A.util.removeClass(component.getElement(), 'hidden');
		
        // Run method with inputs
        var action = component.get("c.getRelationshipCounts");
        action.setParams({
            objectName: event.getParam('object'),
            objectId: event.getParam('id'),
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
        
        // Set context id to be used in navigation
        component.set('v.contextId', event.getParam('id'));
	},
    
    gotoRelatedlist: function(component, event, helper) {
        // Find the index
        var index = event.target.getAttribute('data-index');
		
        // If the count is greater than 0 only then navigate
        if (component.get('v.objects')[index].count > 0) {
            
            
            var relatedListEvent = $A.get("e.force:navigateToRelatedList");
            
            if (relatedListEvent) {
                var params = {
                    "relatedListId": component.get('v.objects')[index].name,
                    "parentRecordId": component.get("v.contextId")
                };
                
                relatedListEvent.setParams(params);
                
                relatedListEvent.fire();
            }
        }
    }
})