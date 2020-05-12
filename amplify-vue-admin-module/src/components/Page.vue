<template>
  <div class="container mt-3">        

  <div v-show="!loading">

    <h3> Page: {{entry.title}}</h3>

    <div v-show="entry.pendingChanges" class="alert alert-danger text-center">
        You have unsaved changes!
        <button @click="putObject" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
    </div>

    <div v-show="changesSaved" class="alert alert-success text-center">
        Changes Saved!
    </div>

    <div class="form-group">
        <label>Page ID</label>
        <p class="form-control-static">{{entry.eid}}</p>
    </div>

    <div class="form-group">
        <label>Simple Title</label>
        <input type="text" class="form-control" v-model="entry.title" @input="pendingChanges"/>
    </div>

    <div class="form-group">
        <label>Full SEO Title</label>
        <input type="text" class="form-control" v-model="entry.seoTitle" @input="pendingChanges"/>
    </div>

    <div class="form-group">
        <label>Show on Website</label>
        <div class="clearfix"></div>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button @click="toggleShow" type="button" class="btn btn-sm" :class="{'btn-success':entry.showWebsite,'btn-secondary':!entry.showWebsite}">Yes</button>
          <button @click="toggleShow" type="button" class="btn btn-sm" :class="{'btn-danger':!entry.showWebsite,'btn-secondary':entry.showWebsite}">No</button>
        </div>        
    </div>

    <div class="form-group">
        <label>Website Section</label>
        <select v-model="entry.websiteSection" class="form-control" @change="pendingChanges">
            <option v-for="s in this.$store.state.configuration.websiteSections" :key="s" v-bind:value="s" :selected="s===entry.websiteSection">{{ s }}</option>
        </select>       
    </div>


    <div class="form-group">
        <label>Page Body</label>
        <div v-if="editorImageUploading" class="alert alert-warning align-middle"><div class="spinner-border text-success"></div> Image uploading... </div>
        <vue-editor useCustomImageHandler @image-added="handleImageAdded" v-model="entry.pageBody" @blur="pendingChanges"></vue-editor>           
        <button @click="editRawBody" type="button" class="btn btn-sm btn-warning mt-2" data-toggle="modal" data-target="#editRawBodyModal">
          Edit HTML
        </button>

    </div>   

    <!-- Modal -->
    <div class="modal fade" id="editRawBodyModal" tabindex="-1" role="dialog" aria-labelledby="editRawBodyModal" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Edit HTML</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea rows="15" v-model="rawHTML" class="form-control" @input="pendingChanges"></textarea>
          </div>
          <div class="modal-footer">            
            <button @click="editRawBodySubmit" type="button" class="btn btn-warning" data-dismiss="modal">Change Raw HTML</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>


    <div class="form-group">
        <label>Keywords</label>
        <input type="text" class="form-control" v-model="entry.keywords" @input="pendingChanges"/>
    </div>

    <div class="form-group">
        <label>Description</label>
        <input type="text" class="form-control" v-model="entry.description" @input="pendingChanges"/>
    </div>

    <div class="form-group">
        <label>Page Layout</label>
        <select v-model="entry.pageLayout" class="form-control" @change="pendingChanges">
            <option v-for="s in this.$store.state.configuration.pageLayouts" :key="s" v-bind:value="s" :selected="s===entry.pageTemplate">{{ s }}</option>
        </select>       
    </div>

    <div class="form-group">
        <label>
            Website Path
        </label>
        <input type="text" class="form-control" v-model="entry.websiteKey" @input="pendingChanges"/>
        <small id="emailHelp" class="form-text text-muted">Don't edit unless you need to. Can inlcude "/" or  "-". Extensions like ".html" are optional.</small>
    </div>

 
    <div class="form-group">
        <label>Header CSS</label>
        <textarea rows="4" v-model="entry.headerCss" class="form-control" @input="pendingChanges"></textarea>
        <small id="emailHelp" class="form-text text-muted">Don't touch unless you know what you are doing.</small>
    </div>   

    <div class="form-group">
        <label>Header JS</label>
        <textarea rows="4" v-model="entry.headerJs" class="form-control" @input="pendingChanges"></textarea>
        <small id="emailHelp" class="form-text text-muted">Don't touch unless you know what you are doing.</small>
    </div>       

    <div class="form-group">
        <label>Footer JS</label>
        <textarea rows="4" v-model="entry.footerJs" class="form-control" @input="pendingChanges"></textarea>
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

import { VueEditor } from "vue2-editor";
import { pageMixin } from '../mixins/pageMixin';
import { dataAccessMixin } from '../mixins/dataAccessMixin';
import { fileUploadMixin } from '../mixins/fileUploadMixin';

export default {
  mixins: [pageMixin,dataAccessMixin,fileUploadMixin],
  name: 'Page',
  data() {
    return {
        entry: {},
        changesSaved:false,
        savingChanges:false,
        changesText:'Save Changes',
        loading:true,
        rawHTML: "",
        uploadedImagePrefix: "uploadedImages/",
        editorImageUploading: false
    }    
  }, 
  computed: {
    stageWebBase: {
        get() {
            return this.$store.state.configuration.stageWebBase
        }
    }
  },   
  components: {
    VueEditor
  },
  created: function () {
    console.log("...in created...");    
    this.eid = this.$route.params.id;
    this.ctype = 'page';
    this.getObject(this.eid)
  },
  methods: {}
}
</script>

<style scoped>
</style>
