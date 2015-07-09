({
	recordSelected : function(component, event, helper) {
        
        var thisObject = this;
        
        // Make component visible
		$A.util.removeClass(component.getElement(), 'hidden');
        
        // Generate Aggregation Query
        var query = 'SELECT ' + component.get('v.groupingField'); 
        query += ', ' + component.get('v.aggregateFunction') 
        query += '(' + component.get('v.aggregateField') + ')';
        
        query += ' FROM ' + component.get('v.object'); 
        query += ' WHERE ' + component.get('v.relatedField') + ' = \'' + event.getParam('id') + '\'';
        query += ' GROUP BY ' + component.get('v.groupingField');

        helper.runQuery(component, query);
	}
})