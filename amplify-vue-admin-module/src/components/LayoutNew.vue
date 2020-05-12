<template>
  <div class="container mt-3">
        

    <h3>New Layout</h3>

    <div v-show="!entryCreated">
        <div class="form-group">
            <label>Layout Title</label>
            <input type="text" class="form-control" v-model="entry.title" required />
        </div>

        <div class="form-group">
            <button @click="saveNewLayout" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
        </div>
    </div>
    <div v-show="entryCreated" class="alert alert-success">
        Success! Template created.
        <router-link :to="{ name: 'layout', params: { id: entry.eid } }" tag="a" class="btn btn-sm btn-info" exact>Continue</router-link>  

    </div>

  </div>
</template>

<script>


import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],
  name: 'LayoutNew',
  data() {
    return {
      entry: {
            eid: this.newId(),
            ctype:'layout',            
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
    saveNewLayout() {
      
      this.putObject();
      this.parentObject.pageLayouts.push(this.entry.title);  
      this.putParentObject();

    }

  }
}


</script>


<style scoped>
</style>
