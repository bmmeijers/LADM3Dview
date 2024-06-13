
import Vue from 'vue'
import App from './App'
import VueBus from 'vue-bus';
Vue.use(VueBus);
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
Vue.use(ElementUI, {locale});
//*******************************
//*******************************
import axios from "axios";
window.axios = axios;
window.LegalInfoList = new Map();
window.VacantRooms = new Map();
window.IDmap = new Map();
window.ModelListParking = new Map();

window.ModelListAll = new Map();
window.ModelListC = new Map();
window.ModelListF = new Map();
window.BaimolList = new Map();

import InitCesium from "./Main/InitCesium.js";
new InitCesium({id:"Container"}).InitEarth();


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App}
})
