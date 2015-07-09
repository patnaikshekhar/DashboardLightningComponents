({
	recordSelected : function(component, event, helper) {
		var query = 'SELECT ' 
        query += component.get('v.addressStreetField') + ',';
        query += component.get('v.addressCityField') + ',';
        query += component.get('v.addressStateField') + ',';
        query += component.get('v.addressPostCodeField') + ',';
        query += component.get('v.addressCountryField');
        query += ' FROM ' + event.getParam('object');
        query += ' WHERE Id = \'' + event.getParam('id') + '\'';	
        
        DNuggetCommonLibrary.runQuery(component.get("c.runQuery"), query, function(result) {
            
            var destination = '';
            
            result.forEach(function(obj) {
                if (obj[component.get('v.addressStreetField')] !== undefined)
                	destination += obj[component.get('v.addressStreetField')].replace(/\r?\n|\r/g, '') + ',';
                if (obj[component.get('v.addressCityField')] !== undefined)
                	destination += obj[component.get('v.addressCityField')].replace(/\r?\n|\r/g, '') + ',';
                if (obj[component.get('v.addressStateField')] !== undefined)
                	destination += obj[component.get('v.addressStateField')].replace(/\r?\n|\r/g, '') + ',';
                if (obj[component.get('v.addressPostCodeField')] !== undefined)
                	destination += obj[component.get('v.addressPostCodeField')].replace(/\r?\n|\r/g, '') + ',';
                if (obj[component.get('v.addressCountryField')] !== undefined)
                	destination += obj[component.get('v.addressCountryField')].replace(/\r?\n|\r/g, '');
            });
            
            if (component.get('v.directions')) {
                helper.getCurrentLocation(function(position) {
                    if (position != null) {
                    	var origin = position.coords.latitude + ',' + position.coords.longitude;
            			component.set('v.mapURL', helper.getDirectionsURL(component.get('v.apiKey'), origin, destination));            
                    } else {
                    	component.set('v.mapURL', helper.getPlaceURL(component.get('v.apiKey'), destination));    
                    }
                });
            } else {
                component.set('v.mapURL', helper.getPlaceURL(component.get('v.apiKey'), destination));        
            }
        });
	},
    
    initialize: function(component, event, helper) {   
        // Show current coordinates if Geo Location can be found
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                if (position != null) {
                    var q = position.coords.latitude + ',' + position.coords.longitude;
                    component.set('v.mapURL', helper.getPlaceURL(component.get('v.apiKey'), q));    
                } else {
                    component.set('v.mapURL', helper.getPlaceURL(component.get('v.apiKey'), ''));    
                }
            });
        }
	}
})