import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import th from 'vee-validate/dist/locale/th';
import VeeValidate, { Validator } from 'vee-validate';
Vue.use(VeeValidate);
Validator.localize('th', th);

import number from './misc/number';
Vue.use(number);

Vue.config.productionTip = false;

import Datepicker from 'vuejs-datepicker';

Vue.component('form-input', require('./views/components/TextInput.vue').default);
Vue.component('datepicker', Datepicker);

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: 'AIzaSyBGpnytVJXkxJuDm-YZDme8ygODNWp3etc',
	authDomain: 'the45co.firebaseapp.com',
	databaseURL: 'https://the45co.firebaseio.com',
	projectId: 'the45co',
	storageBucket: 'the45co.appspot.com',
	messagingSenderId: '881777534412',
	appId: '1:881777534412:web:da1cf655e7d42760592969'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.prototype.$auth = firebase.auth();
Vue.prototype.$db = firebase.firestore();
Vue.prototype.$addData = function(col, data) {
	if(this.$root.user.uid) {
		this.$root.loading = true
		var self = this
		firebase.firestore().collection('users').doc(this.$root.user.uid).collection(col).add(data).then(() => {
			self.$root.loading = false
		});
	}
}

Vue.prototype.$getData = function(col) {
	if(this.$root.user.uid) {
		this.$root.loading = true
		var self = this
		let results = []
		firebase.firestore()
		.collection("users")
		.doc(this.$root.user.uid)
		.collection(col)
		.get()
		.then(querySnapshot => {
		  querySnapshot.forEach(function(doc) {
			 let data = doc.data()
			 data.id = doc.id
			 results.push(data)
		  });
		  self.$root.loading = false
		});
		return results
	}
}

let app = '';

firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		app = new Vue({
			data() {
				return {
					page: 'dashboard',
					pageTitle: null,
					user: {
						uid: this.$auth.currentUser.uid,
						email: this.$auth.currentUser.email,
						thumbnail: this.$auth.currentUser.photoUrl
					},
					loading: false
				};
			},
			created() {},
			router,
			store,
			render: h => h(App)
		}).$mount('#app');
	}
});
