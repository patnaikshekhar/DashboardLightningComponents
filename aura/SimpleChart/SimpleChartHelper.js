({
	runQuery : function(component, query) {
        
        var action = component.get('c.runQuery');
        var thisObject = this;
        
        DNuggetCommonLibrary.runQuery(action, query, function(result) {
        	// After query is run then get labels
        	thisObject.getLabels(component, result);    
        });
    },
    
    getLabels: function(component, aggregateResult) {
        // Get labels for fields
        var fieldList = component.get('v.groupingField') + ',' + component.get('v.aggregateField');
        var action = component.get("c.getMetadataforFields");
        var thisObject = this;
        
        action.setParams({
            objectName: component.get('v.object'),
            fieldNamesString: fieldList
        });
        
        DNuggetCommonLibrary.runServerMethod(action, function(metadata) {
            
            var labelLookup = {};
            
            Object.keys(metadata).forEach(function(key, index) {
           		labelLookup[key] = metadata[key].split(',')[0];
            });
            
            if (component.get('v.graphType') == 'Bar') {
                thisObject.generateGraphBar(component, aggregateResult, labelLookup);
            } else {
            	thisObject.generateGraphPie(component, aggregateResult, labelLookup, component.get('v.graphType'));    
            }
            
        });
        
    },
    
    generateGraphBar: function(component, aggregateResult, labels) {
        
        var data = aggregateResult.map(function(obj) {
            return obj['expr0'];
        });
            
        data.unshift(labels[component.get('v.groupingField')]);
        
        var initialData = aggregateResult.map(function(obj) {
            return 0;
        });
        
        initialData.unshift(labels[component.get('v.groupingField')]);
        
        var graph = c3.generate({
            bindto: component.getElement().querySelector('.chart-canvas'),
            data: {
                columns: [
                    initialData    
                ],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category',
                    categories: aggregateResult.map(function(obj) {
                        return obj[component.get('v.groupingField')];
                    })
                }
            },
            color: {
                pattern: ['#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f', '#2e6da4', '#4cae4c', '#46b8da', '#eea236', '#d43f3a']
            }
        });
        
        
    },
    
    generateGraphPie: function(component, aggregateResult, labels, type) {
        var data = aggregateResult.map(function(obj) {
            return [obj[component.get('v.groupingField')], obj['expr0']];
        });
		
        var initialData = aggregateResult.map(function(obj) {
            return [obj[component.get('v.groupingField')], 0];
        });
        
        var graph = c3.generate({
            bindto: component.getElement().querySelector('.chart-canvas'),
            data: {
                columns: initialData,
            	type: type.toLowerCase()
            },
            color: {
                pattern: ['#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f', '#2e6da4', '#4cae4c', '#46b8da', '#eea236', '#d43f3a']
            }      
        });
        
        setTimeout(function() {
            if (graph) {
                graph.load({
                    columns: data
                });
            }
        } , 500);
    }
})