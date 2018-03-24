// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import App from './App';
import router from './router';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAzNryT-9QL0-oZVDBhJRBrq3jFk4QHivc',
    libraries: 'places,visualization',
  },
});

Vue.use(VueMaterial);

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
