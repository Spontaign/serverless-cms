<template>
  <div class="container mt-3">
      
      <router-link to="/product-new" tag="button" class="btn btn-primary float-right"  exact>New Product</router-link>      
      <h3>Products ({{this.entries.length}})</h3>
  
    <div v-show="!loading"  class="mt-3">

      <table class="table table-striped">
        <thead>
            <tr class="thead-dark">
                <th class="text-center">
                    <a href="#" class="btn btn-sm btn-light" @click.prevent="changeItemSort('title')" title="Sort by Title">
                        Title
                        &nbsp;
                        <span v-show="sortKey === 'title-asc'">&uarr;</span>
                        <span v-show="sortKey === 'title-dsc'">&darr;</span>                    
                    </a>
                </th>    
                <th class="text-center">
                    <a href="#" class="btn btn-sm btn-light" @click.prevent="changeItemSort('websiteSection')" title="Sort by Website Section">
                        Website Section
                        &nbsp;
                        <span v-show="sortKey === 'websiteSection-asc'">&uarr;</span>
                        <span v-show="sortKey === 'websiteSection-dsc'">&darr;</span>                    
                    </a>
                </th>                                                                               
                <th class="text-center">
                    <a href="#" class="btn btn-sm btn-light" @click.prevent="changeItemSort('websiteKey')" title="Sort by Website Key">
                        Website Path
                        &nbsp;
                        <span v-show="sortKey === 'websiteKey-asc'">&uarr;</span>
                        <span v-show="sortKey === 'websiteKey-dsc'">&darr;</span>                    
                    </a>
                </th>                   
            </tr>
        </thead>        
        <tbody>
            <app-table-row v-for="entry in this.entries" :key="entry.eid" :entry="entry"></app-table-row>  
        </tbody>      
      </table>

      <p class="text-right">
        <button v-show="!needPublish" @click="needPublish = true" class="btn btn-sm btn-link">Need to Publish all?</button>
        <router-link  v-show="publishAll" to="/publish" tag="button" class="btn  btn-sm btn-danger" exact>Publish Queue</router-link>      
        <button v-show="needPublish && !publishAll" @click="updateAll" class="btn  btn-sm btn-warning">Submit all to Publish Queue</button>
        <button v-show="needPublish" @click="clearPublish" class="ml-2 btn  btn-sm btn-light">Cancel</button>
      </p>

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
    name: 'Products',
        data() {
            return {
                entries: [],
                loading:true,
                itemSortAsc:false,
                sortKey:'',
                needPublish: false,
                publishAll: false

        };
    },
    components: {
        appTableRow: TableRow
    },
    async created() {
        
        // GET PAGES
        this.getObjects('product');
        
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
        },       
        updateAll() {
            this.entries.forEach(entry => {
                this.$store.commit('PUSH_CHANGED_ENTRY',{"eid":entry.eid,"ctype":entry.ctype,"title":entry.title,"websiteKey":entry.websiteKey,"pushPublish":false});
                this.publishAll = true;

            });
        },
        clearPublish() {
            this.needPublish = false;
            this.publishAll = false;
        }        
    }
}
</script>


<style scoped>
</style>
