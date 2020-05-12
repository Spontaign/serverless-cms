<template>
  <div class="container mt-3">
        

    <h3>New Asset</h3>

    <div v-show="!entryCreated">
        <div class="form-group">
            <label>Asset Title</label>
            <input type="text" class="form-control" v-model="entry.title" required />
        </div>

        <div class="form-group">
            <button @click="putObject" class="btn" :class="{'btn-danger':!savingChanges,'btn-default':savingChanges}" >{{changesText}}</button>
        </div>
    </div>
    <div v-show="entryCreated" class="alert alert-success">
        Success! Asset created.
        <router-link :to="{ name: 'asset', params: { id: entry.eid } }" tag="a" class="btn btn-sm btn-info" exact>Continue</router-link>  

    </div>

  </div>
</template>

<script>


import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],
  name: 'AssetNew',
  data() {
    return {
      entry: {
            eid: this.newId(),
            ctype:'asset',            
            pendingChanges:false
      },
      pageCreated: false,  
      savingChanges:false,
      entryCreated:false,
      changesText:'Save Changes'      
    };
  }
}


</script>


<style scoped>
</style>
