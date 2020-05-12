<template>
  <tr class="">

    <td class="text-center">
        <router-link :to="{ name: entry.ctype, params: { id: entry.eid } }" tag="a" class="btn btn-warning" exact>{{ entry.title}}</router-link>
    </td>
    <td class="text-center">
        {{ entry.ctype.toUpperCase() }}
    </td>    
    <td class="text-center">
        <button v-show="!published" class="btn btn-sm mr-2" :class="{'btn-outline-warning':!publishing,'btn-outline-light':publishing}" @click="publishEntry('PREVIEW')">{{previewTxt}}</button>
        <button v-show="!published" class="btn btn-sm" :class="{'btn-outline-danger':!publishing,'btn-outline-light':publishing}" @click="publishEntry('PUBLISH')">{{publishTxt}}</button>
        <span class="badge badge-success" v-show="published">Success!</span> 
    </td>
  </tr>
</template>

<script>

  import { API } from "aws-amplify";

  export default {  
    name:'TableRowPublish',
    data() {
        return {
            publishTxt: 'Publish',
            previewTxt: 'Preview',
            publishing: false,
            published: false
        }
    },
    props: ['entry'],
    methods: {
        async publishEntry(pType) {
            let vm = this;            
            this.entry.pType = pType;
            
            if (this.entry.pType === 'PUBLISH') {
                this.publishTxt = 'Saving...';
                this.publishing = true;
                this.published = false;
                this.entry.pushPublish = true;                
            } else if (this.entry.pType === 'PUBLISH') {
                this.previewTxt = 'saving...';
            }


            let apiName = 'AdminModule';
            let path = '/publish';            
            let apiInit = {
                body: this.entry
            };
            API.post(apiName, path, apiInit).then(response => {        
                console.log("response from AWS is... ", response)
                
                if (this.entry.pType === 'PUBLISH') {

                    this.published = true;
                    this.changesText = 'Save Changes';              
                    this.changesSaved = true;

                
                    setTimeout(function(){ 
                        vm.$store.commit(
                            'ENTRY_PUBLISHED',
                            { 
                                eid: vm.entry.eid,
                                title: vm.entry.title,
                                websiteKey: vm.entry.websiteKey
                            }
                        );
                    }, 1500)                     
                
                } else if (this.entry.pType === 'PREVIEW') {
                
                    this.previewTxt =  'Preview';

                    setTimeout(function(){ 
                        vm.$store.commit(
                            'ENTRY_PREVIEWED',
                            { 
                                eid: vm.entry.eid,
                                title: vm.entry.title,
                                websiteKey: vm.entry.websiteKey
                            }
                        );
                    }, 1500)
                }
               
            }).catch(error => {                
                console.log(error.response)
                this.changesText = 'Publish Failed';              
                this.publishing = false;                
            });
        }
    }       
}
</script>

<style scoped>
</style>   

