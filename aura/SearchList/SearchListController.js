({
    initialize: function(component, event, helper) {
  		var INITIAL_FETCH_LIMIT = 10;
        
        // If Salesforce1 then set in context
        if ($A.getContext().getApp() == 'one:one') {
            component.set('v.salesforce1', true);
        }
        
        // Run a basic query to fetch the first 10 records
        var objectName = component.get('v.object');
        var fieldName = component.get('v.field');
        var secondaryFieldName = component.get('v.secondaryField');
        var query = 'SELECT Id, ' + fieldName;
            
        if (secondaryFieldName != '' && secondaryFieldName != undefined) {
            query += ', ' + secondaryFieldName;
        }
        
        query += " FROM " + objectName;
        query += " ORDER BY LastModifiedDate DESC";
        query += " LIMIT " + INITIAL_FETCH_LIMIT;
        
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
    },
    
	searchExpressionChange : function(component, event, helper) {
        helper.searchExpressionChange(component, event, helper);
	},
    
    selectRecord: function(component, event, helper) {
        
        event.stopPropagation();
        event.preventDefault();
        
        // When a record is selected, remove existing highlighted record
        $A.util.removeClass(component.getElement().querySelector('.selected-row'), 'selected-row');
        
        // When a record is selected, then highlight record
        if (event.target.nodeName == 'A') {
            $A.util.addClass(event.target, 'selected-row'); 
        } else {
            $A.util.addClass(event.target.parentNode, 'selected-row'); 
        }
        
        // Get the selected index
        var selectedIndex = event.target.getAttribute('data-list-index');
        
        // Invoke the event to inform other components of the event
        $A.get("e.c:DNuggetSelectedRecord").setParams({
            object: component.get('v.object'),
            id: component.get('v.objects')[selectedIndex].Id
       	}).fire();
    },
    
    navigateToObject: function(component, event, helper) {
        var selectedIndex = event.target.getAttribute('data-list-index');
        
        var navEvt = $A.get("e.force:navigateToSObject");
        
        if (navEvt) {
            navEvt.setParams({
                "recordId": component.get('v.objects')[selectedIndex].Id,
                "slideDevName": "detail"
            });
            
            navEvt.fire();
        }
        
    },
    
    changeSearchString: function(component, event, helper) {
        component.find('searchText').getElement().value = event.getParam('text');
        helper.searchExpressionChange(component, event, helper);
    }
})