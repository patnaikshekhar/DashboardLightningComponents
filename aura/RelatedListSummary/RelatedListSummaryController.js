({
	recordSelected : function(component, event, helper) {
        
        // Make component visible
		$A.util.removeClass(component.getElement(), 'hidden');
        
        // Set context id to be used in navigation
        component.set('v.contextId', event.getParam('id'));
        component.set('v.contextObject', event.getParam('object'));
        
        helper.refresh(component, event.getParam('object'), event.getParam('id'));
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
    },
    
    recordUpdated: function(component, event, helper) {
        var obj = component.get('v.contextObject');
        var id = component.get('v.contextId');
        helper.refresh(component, obj, id);
    }
})