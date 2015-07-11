({
	resizeCanvas : function(component) {
        
        var canvas = component.getElement().querySelector('canvas');
        
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);
        // Set canvas width to parent width
        
        canvas.setAttribute('width', canvas.parentNode.width);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
	},
    
    uploadToServer: function(component, file, contents) {
        component.set('v.isLoading', true);
        var action = component.get("c.uploadAttachment");
        var thishelper = this;
		
		var base64Mark = 'base64,'; 
        var canvas = component.getElement().querySelector('canvas');
        var contents = canvas.toDataURL();
        var dataStart = contents.indexOf(base64Mark) + base64Mark.length;
        contents = contents.substring(dataStart);
        
        action.setParams({
            parentId: component.get('v.objectId'),
            fileName: 'signature.jpg',
            base64Data: encodeURIComponent(contents), 
            contentType: 'image/jpeg'
        });
        
        DNuggetCommonLibrary.runServerMethod(action, function(result) {
            component.set('v.isLoading', false);
            thishelper.triggerRecordUpdatedEvent();
        });
    },
    
    triggerRecordUpdatedEvent: function() {
        $A.get("e.c:DNuggetRecordUpdated").setParams({
            object: 'Attachments'
       	}).fire();
    }
})