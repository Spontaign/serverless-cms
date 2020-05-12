import { API } from "aws-amplify";

export const dataAccessMixin = {

	methods: {

        newId() {
            return Math.floor(Date.now() / 1000).toString() + Math.random().toString(36).substring(2, 15);
        },

        async getObjects(ctype) {                        

            let apiName = 'AdminModule';
            let path = '/entries';
            let apiInit = {
                queryStringParameters: {  
                    ctype: ctype            
                }
            };
            
            API.get(apiName, path, apiInit).then(response => {        
                console.log("response from AWS is... ", response)
                this.entries = response;
                this.loading = false;
            }).catch(error => {
                console.log(error.response)
            });
        },

        async getObject(eid,parentCtype) {                        

            let apiName = 'AdminModule';
            let path = '/entry';
            let apiInit = {
                queryStringParameters: {  
                    eid: eid        	
                }
            };

            API.get(apiName, path, apiInit).then(response => {        
                
                console.log("response from AWS is... ", response)
                
                let returnedEntry = response.find( ({ctype}) => ctype === this.ctype);
                if (returnedEntry !== null && returnedEntry !== undefined) {
                    this.entry = returnedEntry;    
                }

                // Optionally pull parent object if this is a child
                if(parentCtype !== null && parentCtype !== undefined) {
                    let parentEntry = response.find( ({ctype}) => ctype === parentCtype);
                    if (parentEntry !== null && parentEntry !== undefined) {
                        this.parentObject = parentEntry;    
                    }                    
                }
                
                this.loading = false;

                if (this.entry.eid === "configuration") {
                    this.$store.commit('UPDATE_CONFIGURATION',response[0]);   
                }

            }).catch(error => {
                console.log(error.response)

            });
        },


        async putObject() {
            console.log("in saveChanges... ");            
            let vm = this;
            this.savingChanges = true;
            this.changesText = 'Saving...';
            this.entry.pendingChanges = false;
            let apiName = 'AdminModule';
            let path = '/entry';
            let apiInit = {
                body: this.entry
            };
            
            API.put(apiName, path, apiInit).then(response => {        
                console.log("response from AWS is... ", response)
                this.savingChanges = false;
                this.changesText = 'Save Changes';              
                this.changesSaved = true;        
                this.entryCreated = true;                                
                setTimeout(function(){ vm.changesSaved = false; }, 3000);
                if( vm.ctype === 'page' || vm.ctype === 'product' || vm.ctype === 'productfeatures' || vm.ctype === 'asset' ) {
                    let ctype = (vm.ctype === 'productfeatures') ? 'product' : vm.ctype
                    this.$store.commit('PUSH_CHANGED_ENTRY',{"eid":vm.eid,"ctype":ctype,"title":vm.entry.title,"websiteKey":vm.entry.websiteKey,"pushPublish":false});
                }
                
            }).catch(error => {
                this.entry.pendingChanges = true;
                console.log(error.response)
            });
        },   

        async putParentObject() {
            console.log("in saveChanges... ");            
            //let vm = this;
            let apiName = 'AdminModule';
            let path = '/entry';
            let apiInit = {
                body: this.parentObject
            };
            
            API.put(apiName, path, apiInit).then(response => {        
                console.log("Configuration Object Updated... ", response)                
            }).catch(error => {
                this.entry.pendingChanges = true;
                console.log(error.response)
            });
        },   

	}

};
