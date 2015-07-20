/**
 * This is a Helper class for all the dashboard lightning components
 * @version 1.1
 * @author Shekhar Patnaik
 **/
public class DNuggetGenericLightningHelper {
    
    
    /**
     * This method runs a query and returns the result as a list
     * if a error occurs then it is thrown back to the client
     * @param query string to be passed
     * @return List of sObjects returned as a result of running the query
     **/
    @AuraEnabled
    public static List<sObject> runQuery(String query) {
        return Database.query(query);
    }
    
    /**
     * This method returns the labels and types of the fields passed to it
     * Note: The reason that a comma seperated String is used instead of a more
     * appropriate object is because the Aura engine is not able to de-serialize those objects
     * @param objectName the name of the object where the fields are present
     * @param fieldNamesString a comma seperated list of fields for which metadata should be queried
     * @return a map containing the fieldName and comma seperated label and field type
     **/
    @AuraEnabled
    public static Map<String, String> getMetadataforFields(String objectName, String fieldNamesString) {
        Map<String, String> resultMessage = new Map<String, String>();
        
        // Get the list of fields
        List<String> fieldNames = fieldNamesString.split(',');
        
        // Describe the schema and get a map of the fields
        Schema.SObjectType objectType = Schema.getGlobalDescribe().get(objectName);    
        Map<String, Schema.SObjectField> fieldsMap = objectType.getDescribe().fields.getMap();
        
        // Iterate through the list of fields passed to the method and get the label and type
        for (String fieldName : fieldNames) {
            
            String label = fieldsMap.get(fieldName).getDescribe().getLabel();
            String fieldType = fieldsMap.get(fieldName).getDescribe().getType().name();
            resultMessage.put(fieldName, label + ',' + fieldType);
        }
        
        return resultMessage;
    }
    
    /**
     * This method returns count of related objects to the passed object and also
     * the count of records in those objects
     * Note: The reason that a comma seperated String is used instead of a more
     * appropriate object is because the Aura engine is not able to de-serialize those objects
     * @param objectName the name of the object for which the child objects need to be retrieved
     * @param objectId The Id of the object to be used
     * @param types the names of the related lists that should be queried
     * @return a map containing child relationship name and the count of records in the
     * relationship
     **/
    @AuraEnabled
    public static Map<String, Integer> getRelationshipCounts(String objectName, String objectId, String types) {
        Map<String, Integer> result = new Map<String, Integer>();
        
        // This is a map of the Relationship label to the API Name
        Map<String, String> mapOfObjectToRelationshipName = new Map<String, String>();
        
        // Split the list of objects passed
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
        
        // Construct the subquery which will query all the child records.
        String query = '';
        
        for (String child : mapOfObjectToRelationshipName.keySet()) {
            
            if (query != '') {
                query += ', ';
            }
            
        	query += '(SELECT Id FROM ' + mapOfObjectToRelationshipName.get(child) + ')';
        }
        
        // Run the sub query to get the counts
        query = 'SELECT ' + query + ' FROM ' + objectName + ' WHERE Id = \'' + objectId + '\'';
        
        sObject resultObject = Database.query(query);
        
        // Get all the relationship names returned and count the size of records
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
    
    /**
     * This method uploads an attachment passed to it
     * Note: This method cannot currenty handle large attachments.
     * @param parentId the Id of the parent component to which the attachment should be attached
     * @param fileName the name of the file
     * @param base64Data the body of the attachment in base64 format
     * @param contentType the content type of the attachment
     * @return a map containing whether the attachment was successfully created
     **/
    @AuraEnabled
    public static Map<String, String> uploadAttachment(String parentId, String fileName, String base64Data, String contentType) {
        
        Map<String, String> result = new Map<String, String>();
        
        try {
        	String utf8base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
        
            Attachment a = new Attachment();
            a.parentId = parentId;
     	
            // Decode the data and put it in the body
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
    
    /**
     * This method deletes an attachment passed to it
     * @param idForDelete the Id of the attachment which should be deleted
     * @return a map containing whether the attachment was successfully created
     **/
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