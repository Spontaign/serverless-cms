<template>
  <div class="container mt-3">        

  <div v-show="!loading">

      <router-link :to="{ name: 'product', params: { id: entry.eid } }" tag="button" class="btn btn-primary float-right"  exact>Back to Product</router-link>  
    
    <h3>Product Features</h3>
    <h3>{{parentObject.title}}</h3>
    <h3>{{parentObject.websiteKey}}</h3>

        <h3>e => {{entry.title}}</h3>
    <h3>e => {{entry.websiteKey}}</h3>

    <div v-show="entry.pendingChanges" class="alert alert-danger text-center">
        You have unsaved changes!
        <button @click="putObject" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
    </div>

    <div v-show="changesSaved" class="alert alert-success text-center">
        Changes Saved!
    </div>

    <div class="form-group">
        <label>Product Page ID</label>
        <p class="form-control-static">{{entry.eid}}</p>
    </div>

    <div class="form-group">
        <label>Features</label>
        <ul class="list-group mt-2 mb-3">
            <li class="list-group-item list-group-item-dark" v-for="f in entry.features" :key="f">
                {{f}}
                <button @click="removeFeature(f)" class="float-right btn btn-sm btn-danger ml-3">remove</button>
            </li>
        </ul>
    </div>



    <div class="form-group">
        <label>Add Feature</label>


        <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="newFeature" />
          <div class="input-group-append">
            <button class="btn btn-info" @click="addFeature">Add</button>
          </div>
        </div>

    </div>

    <div v-show="entry.pendingChanges" class="alert alert-danger text-center">
        You have unsaved changes!
        <button @click="putObject" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
    </div>

    <div v-show="changesSaved" class="alert alert-success text-center">
        Changes Saved!
    </div>

  </div>
  <div v-show="loading" class="container">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
    </div>

  </div>
</template>

<script>


import { pageMixin } from '../mixins/pageMixin';
import { dataAccessMixin } from '../mixins/dataAccessMixin';


export default {
  mixins: [pageMixin,dataAccessMixin],
  name: 'ProductFeatures',
  data() {
    return {
        entry: {eid:this.$route.params.id,ctype:"productfeatures",features:[]},
        parentObject:{},
        pendingChanges:false,
        changesSaved:false,
        savingChanges:false,
        newFeature: "",
        changesText:'Save Changes',
        loading:true
    }    
  }, 
  created: function () {
    console.log("...in created...");    
    this.eid = this.$route.params.id;
    this.ctype = 'productfeatures';
    this.parentCtype = "product";
    this.getObject(this.eid,this.parentCtype)

  },
  methods: {
    addFeature() {
        this.entry.features.push(this.newFeature);
        this.newFeature = "";
        this.entry.pendingChanges = true;
        this.updateEntry();
    },
    removeFeature(feature) {
        let i = this.entry.features.indexOf(feature);
        this.entry.features.splice(i,1);
        this.entry.pendingChanges = true;
        this.updateEntry();
    }, 
    updateEntry() {
        this.entry.title = this.parentObject.title;
        this.entry.websiteKey = this.parentObject.websiteKey;
    }    

  }
}
</script>

<style scoped>
</style>
