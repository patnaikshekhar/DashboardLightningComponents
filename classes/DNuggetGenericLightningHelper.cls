public class DNuggetGenericLightningHelper {
    
    @AuraEnabled
    public static List<sObject> runQuery(String query) {
        return Database.query(query);
    }
    
    @AuraEnabled
    public static Map<String, String> getMetadataforFields(String objectName, String fieldNamesString) {
        Map<String, String> resultMessage = new Map<String, String>();
        
        List<String> fieldNames = fieldNamesString.split(',');
        
        Schema.SObjectType objectType = Schema.getGlobalDescribe().get(objectName);    
        Map<String, Schema.SObjectField> fieldsMap = objectType.getDescribe().fields.getMap();
        
        for (String fieldName : fieldNames) {
            
            String label = fieldsMap.get(fieldName).getDescribe().getLabel();
            String fieldType = fieldsMap.get(fieldName).getDescribe().getType().name();
            resultMessage.put(fieldName, label + ',' + fieldType);
        }
        
        return resultMessage;
    }
    
    @AuraEnabled
    public static Map<String, Integer> getRelationshipCounts(String objectName, String objectId, String types) {
        Map<String, Integer> result = new Map<String, Integer>();
        
        Map<String, String> mapOfObjectToRelationshipName = new Map<String, String>();
        
        Set<String> restrictionTypes = new Set<String>();
        for (String t : types.split(',')) {
            restrictionTypes.add(t.trim());
        }
        
        // Get a list of relationship names
        Schema.SObjectType objectType = Schema.getGlobalDescribe().get(objectName);
        List<Schema.ChildRelationship> relationships = objectType.getDescribe().getChildRelationships();
        for (Schema.ChildRelationship relationship : relationships) {
            String relationshipName = relationship.getRelationshipName();
            String childSObject = relationship.getChildSObject().getDescribe().getLabelPlural();
            
            if (relationshipName != null) {
                if (restrictionTypes.contains(childSObject)) {
                	mapOfObjectToRelationshipName.put(childSObject, relationshipName);        
                }
            }
            
        }
        
        String query = '';
        
        for (String child : mapOfObjectToRelationshipName.keySet()) {
            
            if (query != '') {
                query += ', ';
            }
            
        	query += '(SELECT Id FROM ' + mapOfObjectToRelationshipName.get(child) + ')';
        }
        
        query = 'SELECT ' + query + ' FROM ' + objectName + ' WHERE Id = \'' + objectId + '\'';
        
        sObject resultObject = Database.query(query);
        
        for (String child : mapOfObjectToRelationshipName.keySet()) {
            String childRelationshipName = mapOfObjectToRelationshipName.get(child);
            List<sObject> childObjects = resultObject.getSobjects(childRelationshipName);
            if (childObjects != null) {
            	result.put(child, childObjects.size());    
            } else {
                result.put(child, 0);
            }
            
        }
        
        return result;
    }
    
    @AuraEnabled
    public static Map<String, String> uploadAttachment(String parentId, String fileName, String base64Data, String contentType) {
        
        Map<String, String> result = new Map<String, String>();
        
        try {
        	String utf8base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
            Attachment a = new Attachment();
            a.parentId = parentId;
     
            a.Body = EncodingUtil.base64Decode(utf8base64Data);
            a.Name = fileName;
            a.ContentType = contentType;
            
            insert a;
            
            result.put('Status', 'Success');
            
        } catch(Exception e) {
            result.put('Status', 'Error');
            result.put('ErrorMessage', e.getMessage());
        }
        
        return result;
    }
    
    @AuraEnabled
    public static Map<String, String> deleteAttachment(String idForDelete) {
        
        Map<String, String> result = new Map<String, String>();
        
        try {    	
            Attachment a = [SELECT Id FROM Attachment WHERE Id = :idForDelete];
            delete a;

            result.put('Status', 'Success');
            
        } catch(Exception e) {
            result.put('Status', 'Error');
            result.put('ErrorMessage', e.getMessage());
        }
        
        return result;
    }
}