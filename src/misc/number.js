export default {
	install: Vue => {
		Vue.prototype.$format = {
			price(amount) {
				if (amount) {
					return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				}
			},
			date(date) {
				if (date instanceof Date) {
					if (date) {
						return date.toLocaleDateString('th');
					} else {
						return '---';
					}
				} else {
					// convert stored data from Firestore
					var data = JSON.parse(JSON.stringify(date));

					// Check if data is object
					if (typeof data === 'object' && data !== null) {
						let d = new Date(data.seconds * 1000);
						return d.toLocaleDateString('th');
					} else if (data !== null) {
						let d = new Date(data);
						return d.toLocaleDateString('th');
					} else {
						return '---';
					}
				}
			}
		};
	}
};
