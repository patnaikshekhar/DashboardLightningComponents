({
	searchExpressionChange : function(component, event, helper) {
		// Search again when the expression changes
		var searchTextElement = component.find('searchText').getElement();
        var searchText = searchTextElement.value;
        
        if (searchText.length > 0) {
        	var objectName = component.get('v.object');
            var fieldName = component.get('v.field');
            var secondaryFieldName = component.get('v.secondaryField');
            
            var query = 'SELECT Id, ' + fieldName;
            
            if (secondaryFieldName != '' && secondaryFieldName != undefined) {
            	query += ', ' + secondaryFieldName;
            }
            
            query += " FROM " + objectName; 
            query += " WHERE " + fieldName + " LIKE '%" + searchText + "%'";
            
            var action = component.get("c.runQuery");
            
            DNuggetCommonLibrary.runQuery(action, query, function(result) {
                component.set('v.objects', result);
                component.set('v.results', result.map(function(obj) {
                    return {
                        field: obj[fieldName],
                        secondaryField: obj[secondaryFieldName]
                    }    
                }));
            });
        }	
	}
})