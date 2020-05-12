<template>
  <div class="container mt-3">
      
      <router-link to="/asset-new" tag="button" class="btn btn-primary float-right"  exact>New Asset</router-link>      
      <h3>Assets ({{this.entries.length}})</h3>
  
        <p class="lead">
            Assets are supporting text, files typically javascript or css that 
            are used to support your HTML pages. These pages need to be published to the
            website along with HTML pages.
        </p>

    <div class="alert alert-warning text-center">
        This page is for administrators!
    </div>
    
    <div v-show="!loading"  class="mt-3">

      <table class="table table-striped">
        <thead>
            <tr class="thead-dark">
                <th class="text-center">
                    <a href="#" class="btn btn-sm btn-light" @click.prevent="changeItemSort('title')" title="Sort by Title">
                        Asset Title
                        &nbsp;
                        <span v-show="sortKey === 'title-asc'">&uarr;</span>
                        <span v-show="sortKey === 'title-dsc'">&darr;</span>                    
                    </a>
                </th>       
                <th class="text-center">
                    <a href="#" class="btn btn-sm btn-light" @click.prevent="changeItemSort('websiteKey')" title="Sort by Website Path">
                        Website Path
                        &nbsp;
                        <span v-show="sortKey === 'websiteKey-asc'">&uarr;</span>
                        <span v-show="sortKey === 'websitekey-dsc'">&darr;</span>                    
                    </a>
                </th>                             
                
            </tr>
        </thead>        
        <tbody>
            <app-table-row v-for="entry in this.entries" :key="entry.eid" :entry="entry"></app-table-row>  
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

import TableRow from './TableRow.vue';
import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
    mixins: [dataAccessMixin],
    name: 'Assets',
        data() {
            return {
                entries: [],
                loading:true,
                itemSortAsc:false,
                sortKey:''                
        };
    },
    components: {
        appTableRow: TableRow
    },
    async created() {
        
        // GET TEMPLATES
        this.getObjects('asset');
        
        // MAKE SURE CONFIGURATION OBJECT HAS BEEN POPULATED
        if (JSON.stringify(this.$store.state.configuration) === '{}') {
          this.eid = "configuration";
          this.ctype = "configuration";
          console.log("==========> GET CONFIGURATION OBJECT");
          await this.getObject(this.eid);
        }  
          
    },    
    methods: {    
        changeItemSort(k) {
            
            console.log("changeItemSort and k is... ", k);

            if (this.itemSortAsc) {
                this.entries.sort((a, b) => (a[k] > b[k]) ? 1 : -1)      
                this.sortKey = k + '-asc'                  
            } else {
                this.entries.sort((a, b) => (a[k] > b[k]) ? -1 : 1)                          
                this.sortKey = k + '-dsc'
            }               

            this.itemSortAsc = !this.itemSortAsc;
        }        
    }
}
</script>


<style scoped>
</style>
