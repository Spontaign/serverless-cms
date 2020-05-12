<template>
  <div class="container mt-3"> 

     <router-link to="/image-new" tag="button" class="btn btn-primary float-right"  exact>New Image</router-link>      
      <h3>Images ({{this.entry.images.length}})</h3>
  
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
                <th class="text-center">&nbsp;</th>                   
            </tr>
        </thead>        
        <tbody>
            <tr v-for="image in this.entry.images" :key="image.path">
              <td class="text-center">
                {{image.title}}
                <p class="mt-3">
                  <button @click="showPath(imageBase+image.path)" class="btn btn-info btn-sm">Path</button>
                </p>
              </td>              
              <td class="text-center"><img class="responsive" style="max-width:300px;max-height:200px;" v-bind:src="imageBase+image.path" /></td>              
            </tr>              
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

import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],
  name: 'Images',
  computed: {
    imageBase: {
      get() {
        return this.$store.state.configuration.prodWebBase
      }
    } 
  },
  data() {
    return {
      entry: {
        images:[]
      },
      loading:true,
      itemSortAsc:false,
      sortKey:''
    };
  }, 
  compu: {

  },
  created: function () {
    console.log("...in created...");    
    this.eid = "images";
    this.ctype = 'images';
    this.getObject(this.eid)
  },
  methods: {
    changeItemSort(k) {
        
        console.log("changeItemSort and k is... ", k);

        if (this.itemSortAsc) {
            this.entry.images.sort((a, b) => (a[k] > b[k]) ? 1 : -1)      
            this.sortKey = k + '-asc'                  
        } else {
            this.entry.images.sort((a, b) => (a[k] > b[k]) ? -1 : 1)                          
            this.sortKey = k + '-dsc'
        }               

        this.itemSortAsc = !this.itemSortAsc;
    },
    showPath(path) {
      alert("Relative path: " + path);
    }
  }
}
</script>

<style scoped>
</style>
