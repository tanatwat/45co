<template>
	<form @submit.prevent="submit()" :class="{ 'form-panel': !parent }">
		<h3 class="form-title" v-show="!parent">เพิ่มลูกค้า</h3>
		<div class="form-wrapper">
			<form-input
				:required="true"
				name="name"
				placeholder="ชื่อลูกค้า หรือ ชื่อบริษัท"
				validate="required"
				validate-as="ชื่อลูกค้า"
				v-model="name"
				input-class="line-input"
			></form-input>
		</div>
		<div class="form-wrapper">
			<div class="field-body">
				<form-input
					:required="true"
					name="email"
					placeholder="อีเมลลูกค้า"
					validate="required|email"
					validate-as="อีเมลลูกค้า"
					v-model="email"
					type="email"
					input-class="line-input"
				></form-input>
			</div>
		</div>
		<h4 class="form-heading">ที่อยู่ของลูกค้า</h4>
		<div class="form-wrapper">
			<div class="field is-horizontal field-wrapper">
				<div class="field-body">
					<form-input
						name="project"
						placeholder="บ้านเลขที่ หมู่ ถนน"
						validate="required"
						validate-as="ที่อยู่"
						v-model="address.street"
					></form-input>
				</div>
			</div>
			<div class="field is-horizontal field-wrapper">
				<div class="field-body">
					<form-input
						name="project"
						placeholder="อาคาร/หมู่บ้าน"
						v-model="address.building"
					></form-input>
					<form-input
						name="project"
						placeholder="แขวง/ตำบล"
						validate="required"
						validate-as="แขวง/ตำบล"
						v-model="address.sub_district"
					></form-input>
					<form-input
						name="project"
						placeholder="เขต/อำเภอ"
						validate="required"
						validate-as="เขต/อำเภอ"
						v-model="address.district"
					></form-input>
				</div>
			</div>
			<div class="field is-horizontal field-wrapper">
				<div class="field-body">
					<form-input
						name="project"
						placeholder="จังหวัด"
						validate="required"
						validate-as="จังหวัด"
						v-model="address.province"
					></form-input>
					<form-input
						name="project"
						placeholder="รหัสไปรษณีย์"
						validate="required"
						validate-as="รหัสไปรษณีย์"
						v-model="address.zip"
					></form-input>
				</div>
			</div>
		</div>
		<div :class="parent ? 'level' : 'has-text-right'">
			<button
				class="button is-primary is-outlined"
				type="button"
				@click="$emit('new-client')"
				v-if="parent == 'projects'"
			>
				เลือกลูกค้าเก่า
			</button>
			<button class="button is-primary" type="submit">{{ submitButton }}</button>
		</div>
	</form>
</template>

<script>
export default {
	data() {
		return {
			name: null,
			email: null,
			address: {
				street: null,
				building: null,
				sub_district: null,
				district: null,
				province: null,
				zip: null
			}
		};
	},
	props: {
		parent: {
			default: null
		},
		submitButton: {
			default: 'เพิ่มลูกค้า'
		}
	},
	methods: {
		submit() {
			let data = {
				name: this.name,
				email: this.email,
				address: this.address
			};
			if (!this.parent) {
				this.$addData('clients', data).then(() => {
					this.$router.replace('/clients');
				});
			} else {
				this.$emit('submit', data);
			}
			// COMMENTED ALTERNATIVE OPTIONS WHICH ADDS NEW CLIENT IN NEW PROJECT PAGE
			// this.$addData('clients', data).then(() => {
			// 	if (!this.parent) {
			// 		// redirect if parent prop is null
			// 		this.$router.replace('/clients');
			// 	} else {
			// 		// emit data if this is used in other components
			// 		this.$root.loading = false;
			// 		this.$emit('submit', data);
			// 	}
			// });
		}
	},
	created() {
		this.$root.page = 'create';
	}
};
</script>

