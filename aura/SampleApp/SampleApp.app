<aura:application >
    
    <!-- Sample Aura Application created with Dashboard Tags -->
    
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
        <c:SimpleChart graphType="bar" />
    </div>
    
</aura:application>