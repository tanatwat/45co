<template>
	<div class="page-container">
		<router-link to="/projects/create" class="button is-primary">
			<span>สร้างโปรเจค</span>
			<span class="icon is-small">
				<i class="fas fa-plus"></i>
			</span>
		</router-link>
		<div class="columns filter-wrapper">
			<div class="column">
				<div class="field">
					<div class="control">
						<div class="select is-fullwidth">
							<select>
								<option>Select dropdown</option>
								<option>With options</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="column">
				<div class="field">
					<div class="control">
						<div class="select is-fullwidth">
							<select>
								<option>Select dropdown</option>
								<option>With options</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="column">
				<div class="field">
					<div class="control">
						<div class="select is-fullwidth">
							<select>
								<option>Select dropdown</option>
								<option>With options</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="table">
			<div class="columns thead is-multiline">
				<div class="column is-4">โปรเจค</div>
				<div class="column is-2">ลูกค้า</div>
				<div class="column is-2">สถานะ</div>
				<div class="column">เริ่ม</div>
				<div class="column">จบ</div>
				<div class="column"></div>
			</div>
			<div class="columns is-multiline" v-for="(project, index) in projects">
				<div class="column is-4">
					<a :href="'/projects/' + project.id">{{ project.name }}</a>
				</div>
				<div class="column is-2">{{ project.client.name }}</div>
				<div class="column is-2">
					<span class="tag is-warning">Warning</span>
				</div>
				<div class="column">{{ $format.date(project.start) }}</div>
				<div class="column">{{ $format.date(project.end) }}</div>
				<div class="column has-text-right">
					<div class="dropdown-wrapper">
						<button
							class="table-button fas"
							:class="toggled == index ? 'fa-times-circle has-text-primary' : 'fa-ellipsis-v'"
							@click="toggleDropdown(index)"
						></button>
						<transition name="fade">
							<div class="table-dropdown" v-show="toggled == index">
								<router-link :to="'/projects/' + project.id" class="table-dropdown-option"
									>แก้ไข</router-link
								>
								<a @click.prevent="remove(project.id, index)" class="table-dropdown-option">ลบ</a>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			projects: [],
			toggled: null
		};
	},
	methods: {
		get() {
			this.$getData('projects').then(res => {
				this.projects = res;
			});
		},
		remove(id, index) {
			if (confirm('คุณแน่ใจหรือไม่ว่าจะลบโปรเจคนี้?')) {
				this.$removeData('projects', id, index).then(() => {
					this.projects.splice(index, 1);
					this.toggled = null;
				});
			}
		},
		toggleDropdown(index) {
			if (this.toggled == index) {
				this.toggled = null;
			} else {
				this.toggled = index;
			}
		},
		clickaway(index) {
			if (this.toggled !== null) {
				this.toggled = null;
			}
		}
	},
	mounted() {
		this.$root.page = 'dashboard';
		this.$root.pageTitle = 'โปรเจค';
		this.get();
	}
};
</script>

<style lang="sass">
.page-container
   padding: 0 2.75rem
.page-title
   font-size: 1.75rem
   color: #00dbb1
</style>
