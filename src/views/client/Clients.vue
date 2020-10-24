<template>
	<div class="page-container">
		<router-link to="/clients/create" class="button is-primary">
			<span>เพิ่มลูกค้า</span>
			<span class="icon is-small">
				<i class="fas fa-plus"></i>
			</span>
		</router-link>
		<div class="table">
			<div class="columns thead is-multiline">
				<div class="column is-4">NAME</div>
				<div class="column"></div>
			</div>
			<div class="columns is-multiline" v-for="(client, index) in clients">
				<div class="column">
					<a @click.prevent="toggleList(index)">{{ client.name }}</a>
					<transition name="fade">
						<div v-show="current == index">
							{{ client.address }}
						</div>
					</transition>
				</div>
				<div class="column has-text-right is-relative">
					<button class="table-button fas fa-pen"></button>
					<button class="table-button fas fa-trash" @click="remove(client.id, index)"></button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			clients: null,
			current: null
		};
	},
	methods: {
		get() {
			this.$getData('clients').then(res => {
				this.clients = res;
			});
		},
		remove(id, index) {
			if (confirm('คุณแน่ใจหรือไม่ว่าจะลบ?')) {
				this.$removeData('clients', id, index).then(() => {
					this.clients.splice(index, 1);
				});
			}
		},
		toggleList(index) {
			if (this.current == index) {
				this.current = null;
			} else {
				this.current = index;
			}
		}
	},
	created() {
		this.$root.page = 'dashboard';
		this.$root.pageTitle = 'ลูกค้าของคุณ';
		this.get();
	}
};
</script>
