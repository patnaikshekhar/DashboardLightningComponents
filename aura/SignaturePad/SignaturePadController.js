({
    initialize: function(component, event, helper) {
        
        var canvas = component.getElement().querySelector('canvas');
        
        var signaturePad = new SignaturePad(canvas);
        component.set('v.signaturePad', signaturePad);
        
        window.onresize = helper.resizeCanvas(component);
        helper.resizeCanvas(component);
    },
    
	recordSelected : function(component, event, helper) {
        
        // Make component visible
        $A.util.removeClass(component.getElement(), 'hidden');
        helper.resizeCanvas(component);
        
        // Set Context
        component.set('v.objectId', event.getParam('id'));
    },
    
    uploadFile: function(component, event, helper) {
        helper.uploadToServer(component);
    },
    
    clearCanvas: function(component, event, helper) {
        component.get('v.signaturePad').clear();
        helper.resizeCanvas(component);
    }
})