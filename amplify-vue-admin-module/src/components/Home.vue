<template>
  <div class="container mt-3">
    <div class="row" v-show="!signedIn" >
      <div class="col-md-6 offset-md-3">
        <amplify-authenticator ></amplify-authenticator>
      </div>
    </div>
    
    <div v-show="signedIn" >

      <h3>
        A Content Management System build with AWS serverless technologies.
        All content is published as static content to CloudFront, the AWS content delivery network.
        This system has maximimum flexibilty with industry leading response time for end users for
        minimum cost (as low as a few dollars per month).
      </h3>

      <div class="list-group list-group-flush">

        <router-link v-show="changedEntries.length > 0" to="/publish" tag="a" class="list-group-item list-group-item-action list-group-item-danger">Publish ({{changedEntries.length}})</router-link>   

        <router-link to="/pages" tag="a" class="list-group-item list-group-item-action">Pages</router-link>

        <router-link to="/products" tag="a" class="list-group-item list-group-item-action">Products</router-link>

        <router-link to="/assets" tag="a" class="list-group-item list-group-item-action">Assets</router-link>

        <router-link to="/snippets" tag="a" class="list-group-item list-group-item-action">Snippets</router-link>

        <router-link to="/layouts" tag="a" class="list-group-item list-group-item-action">Layouts</router-link>
        
      </div>

    </div>    

  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
import { dataAccessMixin } from '../mixins/dataAccessMixin';

export default {
  mixins: [dataAccessMixin],

  name: 'Home',
  data() {
    return {
      signedIn: false,
      entry: {}
    }
  },
  computed: {
    changedEntries: {
      get() {
        return this.$store.state.changedEntries
      }
    } 
  },  
  async beforeCreate() {
    try {
      await this.$Amplify.Auth.currentAuthenticatedUser();
      this.signedIn = true;
    } catch (err) {
      this.signedIn = false;
    }
    AmplifyEventBus.$on("authState", info => {
      this.signedIn = info === "signedIn";
    });
  },
  async created() {       
    if (JSON.stringify(this.$store.state.configuration) === '{}') {
      this.eid = "configuration";
      this.ctype = "configuration";
      console.log("==========> GET CONFIGURATION OBJECT");
      await this.getObject(this.eid);
    }    
  }
}
</script>


<style scoped>
</style>
