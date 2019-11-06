import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		authorized: false,
		user: null
	},
	mutations: {
		checkAuth(state, user) {
			if (user) {
				state.authorized = true;
				state.user = user;
			} else {
				state.authorized = false;
			}
		}
	},
	actions: {
		checkAuth({ commit }) {
			Vue.prototype.$auth.onAuthStateChanged(function(user) {
				commit('checkAuth', user);
			});
		}
	}
});
