({
    initialize: function(component, event, helper) {
        component.set('v.isLoading', false);
        component.find('imageUpload').getElement().setAttribute('capture', 'camera');
        component.find('imageUpload').getElement().setAttribute('accept', 'image/*;capture=camera');
    },
    
	recordSelected : function(component, event, helper) {
        // Make component visible
		$A.util.removeClass(component.getElement(), 'hidden');
		
        // Set Context
        component.set('v.objectId', event.getParam('id'));
              
        helper.refresh(component, event.getParam('id'));
	},
    
    uploadFile: function(component, event, helper) {
        helper.upload(component, 'fileUpload');
    },
    
    uploadImage: function(component, event, helper) {
        helper.upload(component, 'imageUpload');
    },
    
    deleteFile: function(component, event, helper) {
        var selectedIndex = event.target.getAttribute('data-list-index');
        helper.deleteFile(component, selectedIndex);
    },
    
    navigateToRecord: function(component, event, helper) {
        
        var selectedIndex = event.target.getAttribute('data-list-index');
        
        var navEvt = $A.get("e.force:navigateToSObject");
        
        if (navEvt) {
            
            navEvt.setParams({
                "recordId": component.get('v.attachments')[selectedIndex].Id,
                "slideDevName": "detail"
            });
            
            navEvt.fire();
        }
    }
})