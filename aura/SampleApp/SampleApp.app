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
        <c:SignaturePad />
    </div>
    
</aura:application>