<template>
  <div class="container mt-3">        

  <div v-show="!loading">

    <h3>Snippet: {{entry.title}}</h3>

    <div class="alert alert-warning text-center">
        This page is for administrators!
    </div>

    <div v-show="entry.pendingChanges" class="alert alert-danger text-center">
        You have unsaved changes!
        <button @click="putObject" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
    </div>

    <div v-show="changesSaved" class="alert alert-success text-center">
        Changes Saved! Be sure to publish!
    </div>

    <div class="form-group">
        <label>Snippet ID</label>
        <p class="form-control-static">{{entry.eid}}</p>
    </div>

    <div class="form-group">
        <label>Title</label>
        <input type="text" class="form-control" v-model="entry.title" @input="pendingChanges"/>
    </div>

    <div class="form-group">
        <label>Snippet Body</label>
        <textarea rows="15" v-model="entry.snippetBody" class="form-control" @input="pendingChanges"></textarea>        
        <small id="emailHelp" class="form-text text-muted">Don't touch unless you know what you are doing.</small>
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

import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],
  name: 'Snippet',
  data() {
    return {
      entry: {},
      changesSaved:false,
      savingChanges:false,
      changesText:'Save Changes',
      loading:true
    };
  }, 
  components: {
  },
  created: function () {
    console.log("...in created...");    
    this.eid = this.$route.params.id;
    this.ctype = 'snippet';
    this.getObject(this.eid)
  },
  methods: {
        toggleShow() {
            this.entry.show = !this.entry.show;
            this.entry.pendingChanges = true;
        },         
        pendingChanges() {
            this.entry.pendingChanges = true
        }       
  }
}
</script>

<style scoped>
</style>
