<template>
  <div class="container mt-3">

    <div v-show="!loading"> 
    
      <h3>Publish Changes</h3>
        
      <p class="lead">
        Content accessed by end users on the website need to be published. You can either
        <span class="badge badge-warning">PREVIEW</span> 
        the pages first in the staging environment, or you can 
        <span class="badge badge-danger">PUBLISH</span>
        to them to the end user website to make then publically accessible.        
      </p>

      <div class="clearfix"></div>

<p>

    <p class="text-right mt-5" v-show="this.$store.state.changedEntries.length > 1">
        <button v-show="!updateAll && !allUpdated" @click="prepareUpdateAll" class="btn btn-sm btn-light">Need to Update the entire Queue?</button>
        <button v-show="updateAll && !updatingAll && !allUpdated" @click="execUpdateAll" class="btn btn-sm btn-danger">Update Everything</button>
        <span v-show="updatingAll" class="badge badge-warning">Working...</span>
        <span v-show="allUpdated" class="badge badge-success">Everything in Queue Updated!</span>
    </p>

      <div v-show="this.$store.state.recentlyPreviewed.length > 0">
          <h4>
            Recently Previewed
                <small>(<a href="#" @click.prevent="clearRecentlyPreviewed">clear</a>)</small>
            </h4>
          <div class="list-group mb-2">
            <a target="_blank" class="list-group-item list-group-item-warning" v-for="l in this.$store.state.recentlyPreviewed" :key="l.title" :href="l.u">{{l.title}}</a>
          </div>
      </div>

      <div v-show="this.$store.state.recentlyPublished.length > 0">
          <h4>
            Recently Published
                <small>(<a href="#" @click.prevent="clearRecentlyPublished">clear</a>)</small>
            </h4>
          <div class="list-group">
            <a target="_blank" class="list-group-item list-group-item-success" v-for="l in this.$store.state.recentlyPublished" :key="l.title" :href="l.u">{{l.title}}</a>
          </div>
      </div>
      

      <table class="table table-hover mt-3">
        <thead>
            <tr class="thead-light">
                <th class="text-center">Title</th>
                <th class="text-center">Type</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody>
            <app-table-row-publish v-for="entry in this.$store.state.changedEntries" ref="publishTableRows" :key="entry.eid" :entry.sync="entry"></app-table-row-publish>  
        </tbody>      
      </table>


    </div>

    <div v-show="loading" class="container">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
    </div>


  </div>
</template>

<script>

import TableRowPublish from './TableRowPublish.vue';
import { mapActions } from 'vuex'

export default {
    name: 'Publish',
    data() {
        return {                
            loading:true,
            updateAll:false,
            updatingAll:false,
            allUpdated: false,
            batchPublish: []
        };
    },
    components: {
        appTableRowPublish: TableRowPublish
    },
    created: function () {
        this.loading = false;
    },
    methods: {
        ...mapActions([
            'clearRecentlyPublished',
            'clearRecentlyPreviewed'
        ]),            
        prepareUpdateAll() {
            this.updateAll = true;
            this.batchPublish = [...this.$store.state.changedEntries];
        },
        execUpdateAll() {
              
            console.log("===> execUpdateAll called...");    

            this.updatingAll = true;                                                     

            let d = true; //done            
            
            let i;
            
            for ( i = 0; i < this.batchPublish.length; i++) {                
                if (this.batchPublish[i].pushPublish === false) {
                    this.callPublish(this.batchPublish[i].eid);
                    d = false;
                    break;
                }
            }

            this.batchPublish.splice(i,1);

            if ( d ) {
                console.log("Looped through all of them!");
                this.updatingAll = false;
                this.allUpdated = true;
            } else {
                console.log("Still more...");
            }         

        },
        callPublish(eid) {
            let vm = this;            
            for (let i = 0 ; i < this.$refs.publishTableRows.length; i++) {
                if (this.$refs.publishTableRows[i].entry.eid === eid) {
                    console.log("Calling publish on... => ",eid);
                    this.$refs.publishTableRows[i].publishEntry("PUBLISH");
                    break;
                }                
            }        

            setTimeout( function() {
                console.log("waiting before calling execUpdateAll again...");
                vm.execUpdateAll();
            }, 1000);
        }  
    }  
}
</script>

<style scoped>
</style>
