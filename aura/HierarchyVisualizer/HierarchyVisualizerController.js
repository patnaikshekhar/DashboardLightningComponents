({
	recordSelected : function(component, event, helper) {
        
        // Make component visible
		$A.util.removeClass(component.getElement(), 'hidden');
		
        helper.getRoot(component, event.getParam('object'), event.getParam('id'), function(rootId) {
            helper.constructTree(component, event.getParam('object'), event.getParam('id'), rootId, function(data) {
            	helper.generateTree(component, component.getElement().querySelector('.tree-canvas'), data);	 
            });
        });
	}
})