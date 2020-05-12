<template>
  <div class="container mt-3">
        

    <h3>New Product</h3>

    <div v-show="!entryCreated">
        <div class="form-group">
            <label>Title</label>
            <input type="text" class="form-control" v-model="entry.title" required @input="setSeoTitle" />
            <input type="hidden" class="form-control" v-model="entry.seoTitle"  />
        </div>


        <div class="form-group">
            <label>Website Section</label>
            <select v-model="entry.websiteSection" class="form-control">
                <option v-for="s in this.$store.state.configuration.websiteSections" :key="s" v-bind:value="s" :selected="s===entry.websiteSection">{{ s }}</option>
            </select>       
        </div>

        <div class="form-group">
            <label>
                Website Path &amp; Key             
            </label>
            <input type="text" class="form-control" v-model="entry.websiteKey" />            
        </div>

        <div class="form-group">
            <label>Page Template</label>
            <select v-model="entry.pageLayout" class="form-control" >
                <option v-for="s in this.$store.state.configuration.pageLayouts" :key="s" v-bind:value="s" :selected="s===entry.pageLayout">{{ s }}</option>
            </select>       
        </div>


        <div class="form-group">
            <button @click="putObject" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
        </div>

    </div>
    <div v-show="entryCreated" class="alert alert-success">
        Success! Product added.
        <router-link :to="{ name: 'product', params: { id: entry.eid } }" tag="a" class="btn btn-sm btn-info" exact>Continue</router-link>  

    </div>

  </div>
</template>

<script>

import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],
  name: 'PageNew',
  data() {
    return {
      entry: {
            eid: this.newId(),
            ctype:'product',            
            pendingChanges:false,showWebsite:true
      },
      pageCreated: false,  
      savingChanges:false,
      entryCreated:false,
      changesText:'Save Changes'      
    };      
  },
  methods: {
    setSeoTitle() {
      this.entry.seoTitle = this.entry.title;  
    }
  }

}
</script>

<style scoped>
</style>
