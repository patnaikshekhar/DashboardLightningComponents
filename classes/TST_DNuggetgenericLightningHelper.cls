@isTest
public class TST_DNuggetgenericLightningHelper {
	
    public static testmethod void runQuery_ShouldRunAQueryAndReturnResults_ReturnsResults() {
        
        Account a = new Account();
        a.Name = 'test';
        insert a;
        
        Test.startTest();
        List<sObject> objects = DNuggetGenericLightningHelper.runQuery('SELECT Id, Name FROM Account');
        System.assertEquals(1, objects.size());
        Test.stopTest();
    }
    
    public static testmethod void getMetadataforFields_ShouldDescribeTheSchemaForFields_ReturnsLabelAndType() {
        
        String fieldNames = 'Name,Phone,Website';
        
        Test.startTest();    
        Map<String, String> message = 
            DNuggetGenericLightningHelper.getMetadataforFields('Account', fieldNames);
        Test.stopTest();
        
        System.assertEquals(3, message.size());
        System.assertEquals('Account Name,STRING', message.get('Name'));
        System.assertEquals('Account Phone,PHONE', message.get('Phone'));
        System.assertEquals('Website,URL', message.get('Website'));
    }
    
    public static testmethod void getRelationshipCounts_WithoutRetrictions_ReturnsTheRecords() {
        
        Account acc = new Account();
        acc.Name = 'Test';
        insert acc;
        
        Contact c1 = new Contact();
        c1.FirstName = 'Test';
        c1.LastName = 'Test';
        c1.AccountId = acc.Id;
        insert c1;
        
        Contact c2 = new Contact();
        c2.FirstName = 'Test';
        c2.LastName = 'Test';
        c2.AccountId = acc.Id;
        insert c2;
        
        Note n1 = new Note();
        n1.parentId = acc.Id;
        n1.body = 'Test';
        n1.title = 'Test';
        insert n1;
        
        Test.startTest();
        Map<String, Integer> result = DNuggetGenericLightningHelper.getRelationshipCounts('Account', acc.Id, 'Contacts,Notes,Cases');
        Test.stopTest();
        
        System.assertEquals(true, result.containsKey('Contacts'));
        System.assertEquals(2, result.get('Contacts'));
        System.assertEquals(true, result.containsKey('Notes'));
        System.assertEquals(1, result.get('Notes'));
    }
}