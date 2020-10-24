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
import { directive as onClickaway } from 'vue-clickaway';

Vue.component('form-input', require('./views/components/TextInput.vue').default);
Vue.component('service-form', require('./views/components/ServiceForm.vue').default);
Vue.component('create-client', require('./views/client/CreateClient.vue').default);
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
	return new Promise((resolve, reject) => {
		if (this.$root.user.uid) {
			this.$root.loading = true;
			var self = this;
			firebase
				.firestore()
				.collection('users')
				.doc(this.$root.user.uid)
				.collection(col)
				.add(data)
				.then(docRef => {
					console.log(data);
					console.log(docRef);

					let item = JSON.parse(localStorage.getItem(col));
					// add doc id to data
					data.id = docRef.id;
					// push data to local data
					item.push(data);
					// set local storage data
					localStorage.setItem(col, JSON.stringify(item));

					resolve('success');
				});
		} else {
			reject('login first');
		}
	});
};

Vue.prototype.$removeData = function(col, id, index) {
	return new Promise((resolve, reject) => {
		if (this.$root.user.uid) {
			this.$root.loading = true;
			var self = this;
			firebase
				.firestore()
				.collection('users')
				.doc(this.$root.user.uid)
				.collection(col)
				.doc(id)
				.delete()
				.then(() => {
					// localStorage.removeItem(col)
					let item = JSON.parse(localStorage.getItem(col));

					item.splice(index, 1);

					localStorage.setItem(col, JSON.stringify(item));

					self.$root.loading = false;
					resolve('success');
				});
		} else {
			reject('login first');
		}
	});
};

Vue.prototype.$updateData = function(col, id, data, index, loading) {
	return new Promise((resolve, reject) => {
		if (this.$root.user.uid) {
			if(loading) {
				this.$root.loading = true;
			}
			var self = this;
			firebase
				.firestore()
				.collection('users')
				.doc(this.$root.user.uid)
				.collection(col)
				.doc(id)
				.update(data)
				.then(() => {
					let item = JSON.parse(localStorage.getItem(col));
					item[index] = data
					localStorage.setItem(col, JSON.stringify(item));
					console.log(item)
					self.$root.loading = false;
					self.$root.updateTimer = null;
					resolve('success');
				});
		} else {
			reject('login first');
		}
	});
};

Vue.prototype.$getData = function(col) {
	// Return a promise to wait for firestore to complete
	return new Promise((resolve, reject) => {
		if (this.$root.user.uid) {
			this.$root.loading = true;
			// Check local storage first
			if (localStorage.getItem(col) === null) {
				var self = this;
				let results = [];
				firebase
					.firestore()
					.collection('users')
					.doc(this.$root.user.uid)
					.collection(col)
					.get()
					.then(querySnapshot => {
						querySnapshot.forEach(function(doc) {
							let data = doc.data();
							data.id = doc.id;
							results.push(data);
						});
						
						// store in local storage
						var parsedObj = JSON.stringify(results);
						localStorage.setItem(col, parsedObj);
						self.$root.loading = false;
						resolve(results);
					});
			} else {
				try {
					// return parsed data from local storage
					this.$root.loading = false;
					resolve(JSON.parse(localStorage.getItem(col)));
				} catch (e) {
					this.$root.loading = false;
					localStorage.removeItem(col);
					reject('error');
				}
			}
		} else {
			reject('login first');
		}
	});
};

Vue.prototype.$getDataById = function(col, id) {
	// Return a promise to wait for firestore to complete
	return new Promise((resolve, reject) => {
		if (this.$root.user.uid) {
			this.$root.loading = true;
			// Check local storage first
			var self = this;
			firebase
				.firestore()
				.collection('users')
				.doc(this.$root.user.uid)
				.collection(col)
				.doc(id)
				.get()
				.then(doc => {
					if (doc.exists) {
						self.$root.loading = false;
						console.log(doc.data())
						resolve(doc.data());
					} else {
						// doc.data() will be undefined in this case
						console.log('No such document!');
					}
				})
				.catch(error => {
					console.log('Error getting document:', error);
				});
		} else {
			reject('login first');
		}
	});
};

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
					loading: false,
					updateTimer: null
				};
			},
			created() {},
			router,
			store,
			render: h => h(App)
		}).$mount('#app');
	}
});
