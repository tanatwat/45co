<template>
	<div>
		<div class="form-panel" v-if="step == 1">
			<h3 class="form-title">สร้างโปรเจค</h3>
			<!-- SELECT CLIENT FROM LIST -->
			<form @submit.prevent="step = 2" v-show="!newClient">
				<div class="form-wrapper">
					<h4 class="label">เลือกลูกค้าสำหรับโปรเจคนี้</h4>
					<div class="control">
						<div class="select is-fullwidth">
							<select required v-model="client">
								<option :value="client" v-for="client in clients">{{ client.name }}</option>
							</select>
						</div>
					</div>
				</div>
				<div class="level">
					<button class="button is-primary is-outlined" type="button" @click="newClient = true">
						เพิ่มลูกค้าใหม่
					</button>
					<button class="button is-primary" type="submit">ต่อไป</button>
				</div>
			</form>
			<!-- ADD NEW CLIENT -->
			<div v-show="newClient">
				<create-client
					submit-button="ต่อไป"
					parent="projects"
					v-on:new-client="newClient = false"
					v-on:submit="(client = $event), (step = 2)"
				></create-client>
				<div class="content submit-wrapper">
					<p>
						<i class="fas fa-info-circle"></i> หากต้องการบันทึกข้อมูลลูกค้าไว้ใช้ภายหลัง โปรด
						<router-link class="has-text-primary" to="/clients"
							>เพิ่มลูกค้าใหม่ที่บัญชีของคุณ</router-link
						>
					</p>
				</div>
			</div>
		</div>

		<form @submit.prevent="submit()" class="form-panel" v-if="step == 2">
			<h3 class="form-title">สร้างโปรเจค</h3>
			<div class="form-wrapper">
				<form-input
					name="project"
					placeholder="ชื่อโปรเจค"
					validate="required"
					validate-as="ชื่อโปรเจค"
					v-model="projectName"
					input-class="line-input"
					:required="true"
				></form-input>
			</div>
			<h4 class="form-heading">ระยะเวลาการทำงาน</h4>
			<div class="form-wrapper">
				<div class="field is-horizontal field-wrapper">
					<div class="field-body">
						<datepicker
							v-model="startDate"
							placeholder="วันเริ่่มงาน"
							ref="startDateInput"
							@selected="$refs.endDateInput.clearDate()"
						></datepicker>
						<datepicker
							v-model="endDate"
							placeholder="วันจบงาน"
							ref="endDateInput"
							:disabled-dates="disableDates"
						></datepicker>
					</div>
				</div>
				<!-- <div class="field is-horizontal field-wrapper">
        <div class="field-label align-self-center">
          <label class="label">เงื่อนไขการชำระเงิน</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="billingRule">
                  <option value="fixed">เหมาจ่ายครั้งเดียว</option>
                  <option value="milestone">แบ่งชำระตามขั้นตอนการทำงาน</option>
                  <option value="fixed">ชำระรายเดือน</option>
                  <option value="fixed">ชำระรายสัปดาห์</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        </div>-->
				<!-- <div class="field is-horizontal field-wrapper">
        <div class="field-label align-self-center">
          <label class="label">วันส่งใบแจ้งหนี้</label>
        </div>
        <div class="field-body">
          <datepicker
            input-class="input date-input"
            wrapper-class
            :clear-button="true"
            ref="dateInput"
          ></datepicker>
        </div>
        </div>-->
			</div>
			<h4 class="form-heading">ตั้งราคางานของคุณ</h4>
			<service-form
				:services="items"
				@diposit-input="dipositAmount = $event"
        @pricing-input="pricingRule = $event"
        @rate-input="rateQty = $event"
			></service-form>
			<div class="has-text-right submit-wrapper">
				<button class="button is-primary is-medium" type="submit">สร้างโปรเจค</button>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			step: 1,
			newClient: false,
			clients: [],
			client: null,
			projectName: null,
			startDate: null,
			endDate: null,
			pricingRule: null,
			rateQty: null,
			items: [
				{
					name: null,
					price: null,
					qty: 1,
					rate: null,
					due: null
				}
			],
			dipositAmount: null
		};
	},
	// watch: {
	//   billingRule : function(val) {
	//     if(val == 'milestone') {
	//       this.pricingRule = 'milestone'
	//     } else {
	//       this.pricingRule = 'fixed'
	//     }
	//   },
	//   pricingRule : function(val) {
	//     if(val == 'milestone') {
	//       this.billingRule = 'milestone'
	//     } else {
	//       this.billingRule = 'fixed'
	//     }
	//   }
	// },
	computed: {
		disableDates: function() {
			if (this.startDate) {
				return {
					to: this.startDate
				};
			} else {
				return {
					to: null
				};
			}
		}
	},
	methods: {
		resetEndDate() {
			(this.endDate = null), this.$refs.endDateInput.reset();
		},
		submit() {
			let data = {
				name: this.projectName,
				client: {
					name: this.client.name,
					address: Object.values(this.client.address).join(' '),
					email: this.client.email
				},
				start: this.startDate,
				end: this.endDate,
				pricingRule: this.pricingRule,
				rate: this.rateQty,
				diposit: this.dipositAmount,
				items: this.items
			};
			this.$addData('projects', data).then(() => {
				this.$router.replace('/projects');
			});
		},
		getClient() {
			this.$getData('clients').then(res => {
				this.clients = res;
			});
		}
	},
	created() {
		this.$root.page = 'create';
		this.getClient();
	}
};
</script>
