<template>
  <div class="container mt-3">
      
      <router-link to="/layout-new" tag="button" class="btn btn-primary float-right"  exact>New Layout</router-link>      
      <h3>Layouts ({{this.entries.length}})</h3>
  
        <p class="lead">
            Layouts are base HTML pages used when building pages. When building pages, a Layout
            is combined with templates and the content for the page to produce the final HTML.
            All pages need to be assigned a Layout.
            Layouts are not published but instead stored in the database and used when 
            building HTML pages.
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
                        Layout Title
                        &nbsp;
                        <span v-show="sortKey === 'title-asc'">&uarr;</span>
                        <span v-show="sortKey === 'title-dsc'">&darr;</span>                    
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
    name: 'Templates',
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
        
        // GET LAYOUTS
        this.getObjects('layout');
        
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
