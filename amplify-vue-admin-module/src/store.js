import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
 
 state: {
   user: null,
   signedIn: false,
   configuration: {},
   changedEntries: [],
   recentlyPublished: [],
   recentlyPreviewed: []
 },
 mutations: {
   setUser(state, user) {
     console.log("mutations setUser user is... ", user)
     state.user = user;
   },
   setSignedIn(state, signedIn) {
     console.log("mutations setSignedIn amd signedIn is... ", signedIn)
     state.signedIn = signedIn;
   },  
   UPDATE_CONFIGURATION(state,c) {
      console.log("Updating configuraiton... ")
      state.configuration = c;

   },
   PUSH_CHANGED_ENTRY(state,eObj) {
      console.log("mutations PUSH_CHANGED_ENTRY... ", eObj.eid);
      if (state.changedEntries.some(entry => entry.eid === eObj.eid)) {
        console.log("Already in changed... ", eObj.eid);
      } else {
        state.changedEntries.push(eObj);
      }
   },   
   ENTRY_PUBLISHED(state,obj) {
      
      const isId = (eid) => eid === obj.eid;
      
      let i = state.changedEntries.findIndex(isId);
      
      state.changedEntries.splice(i,1);

      let o = {
        eid:obj.eid,
        u:state.configuration.prodWebBase+obj.websiteKey,
        title:obj.title,
        pushPublish:false
      };      

      let x = state.recentlyPublished.findIndex( ({title}) => title === o.title);
      if(x === -1) {
        state.recentlyPublished.push(o);
      } else {
        console.log("Has recently been published so not pushing...");
      }

      // CHECK IF IN PREVIEW...
      let p = state.recentlyPreviewed.findIndex( ({title}) => title === o.title);
      if(p > -1) {
        state.recentlyPreviewed.splice(p,1);
      }
   },
   ENTRY_PREVIEWED(state,obj) {
      //console.log("ENTRY_PREVIEWED => ", obj.eid);
      //console.log("ENTRY_PREVIEWED => ", obj.title);
      //console.log("ENTRY_PREVIEWED => ", obj.websiteKey);
      
      let o = {
        u:state.configuration.stageWebBase+obj.websiteKey,
        title:obj.title
      };      

      let x = state.recentlyPreviewed.findIndex( ({title}) => title === o.title);
      if(x === -1) {
        state.recentlyPreviewed.push(o);
      } else {
        console.log("Has recently been previewed so not pushing...");
      }

   },

   CLEAR_RECENTLY_PUBLISHED(state) {
      console.log("mutations CLEAR_RECENTLY_LOADED... ");
        state.recentlyPublished = [];
   },    
   CLEAR_RECENTLY_PREVIEWED(state) {
      console.log("mutations CLEAR_RECENTLY_PREVIEWED... ");
        state.recentlyPreviewed = [];
   }           
 }, 
  actions: {
    clearRecentlyPublished(context) {
      context.commit('CLEAR_RECENTLY_PUBLISHED')
    },
    clearRecentlyPreviewed(context) {
      context.commit('CLEAR_RECENTLY_PREVIEWED')
    }    
  }
});




