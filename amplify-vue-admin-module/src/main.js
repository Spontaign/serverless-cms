import Vue from "vue";

import App from "./App.vue";
import store from "./store";

import { router } from './routes';

import Amplify, * as AmplifyModules from "aws-amplify";
import { Auth, Logger } from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";

import { AmplifyEventBus } from "aws-amplify-vue";

import VueCurrencyFilter from 'vue-currency-filter'
Vue.use(VueCurrencyFilter,
{
  symbol : '$',
  thousandsSeparator: ',',
  fractionCount: 0,
  fractionSeparator: ',',
  symbolSpacing:false
  
})

import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

Vue.use(Auth);

Vue.use(AmplifyPlugin, AmplifyModules);

Amplify.Logger.LOG_LEVEL = "DEBUG";

const logger = new Logger("main");
Auth.currentAuthenticatedUser()
 .then(user => logger.debug(user))
 .catch(err => logger.debug(err));

Vue.config.productionTip = false;

AmplifyEventBus.$on("authState", info => {
 console.log(`AUTH: event emitted by an Amplify component: ${info}`);
 if (info === "signedIn") {
   store.commit("setSignedIn", true);

   Auth.currentAuthenticatedUser()
     .then(data => {
       if (data && data.signInUserSession) {
         store.commit("setUser", data);
       }
     })
     .catch(e => {
       console.log(e);
     });
 } else if (info === 'signedOut') {
    console.log(`SIGNED OUT, sending to HOME PAGE`);
    router.push("home")
 }
});

new Vue({
 router,
 store,
 render: h => h(App)
}).$mount("#app");