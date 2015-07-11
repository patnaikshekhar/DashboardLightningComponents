<aura:application >
    <style>
        .full-width {
        	width:100%;
        }
        
        body {
        	padding: 0px;
        }
        
        li {
        	margin: 0px;
        }
    </style>
    <div class="full-width">
        <c:SearchList object="Account" secondaryField="Phone" />
        <!--<c:ObjectCard fieldNames="Title,Phone,MobilePhone,Email" />-->
        <!--<c:RelatedListSummary />-->
        <!--<c:ContextualGoogleMap apiKey="AIzaSyBe1qJ7xMRxPm6MhwyFS_tRKCInkphy-Sw" directions="false" />-->
        <!--<c:SimpleChart graphType="Donut" />-->
        <!--<c:HierarchyVisualizer />-->
        <!--<c:AttachmentList />-->
        <c:SignaturePad />
    </div>
    
</aura:application>