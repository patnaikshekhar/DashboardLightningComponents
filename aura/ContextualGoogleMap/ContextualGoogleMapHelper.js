({
    // This function gets the map url based on the params passed
	getPlaceURL: function(key, q) {
		var maps_url = 'https://www.google.com/maps/embed/v1/place?';
        
        if (key != null) {
        	maps_url += 'key=' + key;   
        }
        
        if (q != null) {
            maps_url += '&q=' + q;
        }
        
        return maps_url;
	},
	
    getDirectionsURL: function(key, origin, destination) {
		var maps_url = 'https://www.google.com/maps/embed/v1/directions?';
        
        if (key != null) {
        	maps_url += 'key=' + key;   
        }
        
        if (origin != null && origin != undefined) {
            maps_url += '&origin=' + origin;
        }
        
        if (destination != null && destination != undefined) {
            maps_url += '&destination=' + destination;
        }
        
        return maps_url;
	},
    
    getCurrentLocation: function(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(callback);
        } else {
            callback(null);
        }
    }
})