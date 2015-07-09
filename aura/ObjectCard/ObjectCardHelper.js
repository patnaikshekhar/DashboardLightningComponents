({
    // Function to get formatted link
	getLink: function(type, value) {

		var result = '';

		if (type === 'URL') {
			result = value;
		} else if (type === 'PHONE') {
			result = 'tel://' + value;
        } else if (type === 'EMAIL') {
            result = 'mailto://' + value;
        }

		return result;
	}
})