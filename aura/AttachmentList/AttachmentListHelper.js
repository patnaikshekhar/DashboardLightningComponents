({
	refresh : function(component, id) {
        component.set('v.isLoading', true);
        
		var action = component.get('c.runQuery');
        var query = 'SELECT Id, Name, Description, ContentType';
        query += ' FROM Attachment';
        query += ' WHERE ParentId = \'' + id + '\'';
        
        DNuggetCommonLibrary.runQuery(action, query, function(results) {
            component.set('v.isLoading', false);
            component.set('v.attachments', results);
        });
	},
    
    uploadToServer: function(component, file, contents) {
        var action = component.get("c.uploadAttachment");
        var thishelper = this;
        
        action.setParams({
            parentId: component.get('v.objectId'),
            fileName: file.name,
            base64Data: encodeURIComponent(contents), 
            contentType: file.type
        });
        
        DNuggetCommonLibrary.runServerMethod(action, function(result) {
            component.set('v.isLoading', false);
            thishelper.triggerRecordUpdatedEvent();
        });
    },
    
    upload: function(component, element) {
        component.set('v.isLoading', true);
        
        var fileInput = component.find(element).getElement();
        var file = fileInput.files[0];
        var reader = new FileReader();
        var thishelper = this;
        
        reader.onload = function() {
            var contents = reader.result;
            var base64Mark = 'base64,';
            var dataStart = contents.indexOf(base64Mark) + base64Mark.length;
            contents = contents.substring(dataStart);
            
            thishelper.uploadToServer(component, file, contents);
        };
            
        reader.readAsDataURL(file);  
    },
    
    deleteFile: function(component, index) {
        component.set('v.isLoading', true);
        
        var action = component.get("c.deleteAttachment");
        var thishelper = this;
        
        action.setParams({
            idForDelete: component.get('v.attachments')[index].Id,
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