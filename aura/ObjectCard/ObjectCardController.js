({
	recordSelected : function(component, event, helper) {
        var query = 'SELECT ';
        var fields = component.get('v.fieldNames').split(',').map(function(field) {
            return field.trim();
        });
        
        var titleField = component.get('v.titleField');
        fields.push(titleField.trim());
        
        var first = true;
        
        fields.forEach(function(field) {
            if (first) {
                query += field;
                first = false;
            } else {
            	query += ',' + field;
            }
        });
		
        query += ' FROM ' + event.getParam('object');
        query += ' WHERE Id = \'' + event.getParam('id') + '\'';
        
        var action = component.get("c.runQuery");
        DNuggetCommonLibrary.runQuery(action, query, function(result) {
            
            if (result.length > 0) {
                var fieldValues = result[0];
                var action = component.get("c.getMetadataforFields");
                action.setParams({
                    objectName: event.getParam('object'),
                    fieldNamesString: fields.join(',')
                });
                
                DNuggetCommonLibrary.runServerMethod(action, function(metadata) {
                    
                    // Display the card
                    $A.util.removeClass(component.getElement(), 'hidden');
                    
                    // Set the title based on the title field
                    component.set('v.title', fieldValues[titleField]);
                    
                    // Get the fields other than title
                    var fieldsOtherThanTitle = fields.splice(0, fields.length - 1);
                    
                    // Set the fields on the controller
                    component.set('v.fields', fieldsOtherThanTitle.map(function(field) {
                        return {
                            label: metadata[field].split(',')[0],
                            value: fieldValues[field],
                            link: helper.getLink(
                                metadata[field].split(',')[1], fieldValues[field])
                        }; 
                    }));
                });
            }
        });      
	},
    
    initialize: function(component) {
        component.set('v.fields', []);
    }
})