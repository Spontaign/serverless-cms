<template>
  <div class="container mt-3">        

  <div v-show="!loading">

    <h3>Settings</h3>

    <div class="alert alert-warning text-center">
        This page is for administrators!
    </div>

    <div v-show="entry.pendingChanges" class="alert alert-danger text-center">
        You have unsaved changes!
        <button @click="putObject" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
    </div>


    <div class="form-group">
        <label>Layouts</label>
        <p class="form-control-static">
          {{entry.pageLayouts}}
          <button v-show="!layoutsChange" @click="changeLayouts" class="btn btn-sm btn-light">Edit</button>
        </p>        
    </div>

    <div class="form-group" v-show="layoutsChange" >
      <label>Change Layouts</label>
      <div class="input-group">
          <input type="text" class="form-control" v-model="layoutsString" />
          <div class="input-group-append">
            <button class="btn btn-warning" @click="changeLayoutsSubmit">Change</button>
          </div>                
      </div>
      <small class="form-text text-muted">Edit the array as a string (comma delimited and no spaces by commas). Spaces in Layout Title are OK.</small>
    </div>

    <div class="form-group">
        <label>Snippets</label>
        <p class="form-control-static">
          {{entry.pageSnippets}}
          <button v-show="!snippetsChange" @click="changeSnippets" class="btn btn-sm btn-light">Edit</button>
        </p>        
    </div>

    <div class="form-group" v-show="snippetsChange" >
      <label>Change Snippets</label>
      <div class="input-group">
          <input type="text" class="form-control" v-model="snippetsString" />
          <div class="input-group-append">
            <button class="btn btn-warning" @click="changeSnippetsSubmit">Change</button>
          </div>                
      </div>
      <small class="form-text text-muted">Edit the array as a string (comma delimited and no spaces by commas). Spaces in Snippet Title are OK.</small>
    </div>

    <div class="form-group">
        <label>Sections</label>
        <p class="form-control-static">
          {{entry.websiteSections}}
          <button v-show="!sectionsChange" @click="changeSections" class="btn btn-sm btn-light">Edit</button>
        </p>        
    </div>

    <div class="form-group" v-show="sectionsChange" >
      <label>Change Sections</label>
      <div class="input-group">
          <input type="text" class="form-control" v-model="sectionsString" />
          <div class="input-group-append">
            <button class="btn btn-warning" @click="changeSectionsSubmit">Change</button>
          </div>                
      </div>
      <small class="form-text text-muted">Edit the array as a string (comma delimited and no spaces by commas). Spaces in Snippet Title are OK.</small>
    </div>

    <div class="form-group">
        <label>
            Stage Website Base Url
        </label>
        <input type="text" class="form-control" v-model="entry.stageWebBase" @input="pendingChanges"/>
        <small class="form-text text-muted">Staring website base (end with /).</small>
    </div>

    <div class="form-group">
        <label>
            Production Website Base Url
        </label>
        <input type="text" class="form-control" v-model="entry.prodWebBase" @input="pendingChanges"/>
        <small class="form-text text-muted">Production website base (end with /).</small>
    </div>

    <div v-show="entry.pendingChanges" class="alert alert-danger text-center">
        You have unsaved changes!
        <button @click="saveSettings" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
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

import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],
  name: 'Settings',
  data() {
    return {
      entry: {},
      changesSaved:false,
      savingChanges:false,
      changesText:'Save Changes',
      loading:true,
      layoutsString:'',      
      layoutsChange:false,
      snippetsString:'',      
      snippetsChange:false,      
      sectionsString:'',      
      sectionsChange:false       
    };
  }, 
  compu: {

  },
  created: function () {
    console.log("...in created...");    
    this.eid = "configuration";
    this.ctype = 'configuration';
    this.getObject(this.eid)
  },
  methods: {
    saveSettings() {
      let vm = this;
      this.putObject();
      // Refresh settings object in store
      setTimeout(function() { vm.getObject(vm.eid); }, 1500);
    },
    toggleShow() {
        this.entry.show = !this.entry.show;
        this.entry.pendingChanges = true;
    },         
    pendingChanges() {
        this.entry.pendingChanges = true
    },
    changeLayouts() {
      this.layoutsString = this.entry.pageLayouts.toString();
      this.layoutsChange = true;
    },
    changeLayoutsSubmit() {
      this.entry.pageLayouts = this.layoutsString.split(',');
      this.layoutsChange = false;
      this.pendingChanges();
    },             
    changeSnippets() {
      this.snippetsString = this.entry.pageSnippets.toString();
      this.snippetsChange = true;
    },
    changeSnippetsSubmit() {
      this.entry.pageSnippets = this.snippetsString.split(',');
      this.snippetsChange = false;
      this.pendingChanges();
    },      
    changeSections() {
      this.sectionsString = this.entry.websiteSections.toString();
      this.sectionsChange = true;
    },
    changeSectionsSubmit() {
      this.entry.websiteSections = this.sectionsString.split(',');
      this.sectionsChange = false;
      this.pendingChanges();
    }
  }
}
</script>

<style scoped>
</style>
