<template>

  <nav class="navbar  nav-pills navbar-expand-md navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Serverless CMS Admin</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div v-if="signedIn" class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav">

        <router-link v-show="changedEntries.length > 0" to="/publish" tag="li" class="nav-item active"><a class="nav-link btn btn-danger">Publish  ({{changedEntries.length}})</a></router-link>

        <router-link to="/" tag="li" class="nav-item" active-class="active" exact><a class="nav-link">Home</a></router-link>              

        <router-link to="/pages" tag="li" class="nav-item" active-class="active"><a class="nav-link">Pages</a></router-link>

        <router-link to="/products" tag="li" class="nav-item" active-class="active"><a class="nav-link">Products</a></router-link>

        <router-link to="/images" tag="li" class="nav-item" active-class="active"><a class="nav-link">Images</a></router-link>

        <router-link to="/assets" tag="li" class="nav-item" active-class="active"><a class="nav-link">Assets</a></router-link>

        <router-link to="/snippets" tag="li" class="nav-item" active-class="active"><a class="nav-link">Snippets</a></router-link>

        <router-link to="/layouts" tag="li" class="nav-item" active-class="active"><a class="nav-link">Layouts</a></router-link>

        <router-link to="/settings" tag="li" class="nav-item" active-class="active"><a class="nav-link">Settings</a></router-link>        

      </ul>
    </div>
  


    <div v-else class="collapse navbar-collapse" >
      <ul class="navbar-nav mr-auto">
        <router-link to="/" tag="li" class="nav-item" active-class="active" exact><a>Home</a></router-link>      
      </ul>
    </div>


    <form v-if="signedIn" class="form-inline my-2 my-lg-0">
      <amplify-sign-out></amplify-sign-out>        
    </form>

  </nav>

</template>

<script>

import { AmplifyEventBus } from "aws-amplify-vue";

export default {
  name: "Header",
  computed: {
    changedEntries: {
      get() {
        return this.$store.state.changedEntries
      }
    } 
  },
  data() {
    return {
      signedIn: false
    };
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
  }
}; 
</script>

