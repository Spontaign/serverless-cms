<template>
  <div class="container mt-3">
        

    <h3>New Snippet</h3>

    <div v-show="!entryCreated">
        <div class="form-group">
            <label>Snippet Title</label>
            <input type="text" class="form-control" v-model="entry.title" required />
        </div>

        <div class="form-group">
            <button @click="saveNewSnippet" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
        </div>
    </div>
    <div v-show="entryCreated" class="alert alert-success">
        Success! Snippet created.
        <router-link :to="{ name: 'snippet', params: { id: entry.eid } }" tag="a" class="btn btn-sm btn-info" exact>Continue</router-link>  

    </div>

  </div>
</template>

<script>


import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],
  name: 'SnippetNew',
  data() {
    return {
      entry: {
            eid: this.newId(),
            ctype:'snippet',            
            pendingChanges:false
      },
      pageCreated: false,  
      savingChanges:false,
      entryCreated:false,
      changesText:'Save Changes'      
    };
  },
  computed: {
    parentObject: {
      get() {
        return this.$store.state.configuration
      }
    } 
  },    
  methods: {
    saveNewSnippet() {
      
      this.putObject();
      this.parentObject.pageSnippets.push(this.entry.title);  
      this.putParentObject();

    }
  }  
}


</script>


<style scoped>
</style>
