<template>
	<div class="page-container">
		<span class="fas" :class="[$root.updateTimer ? 'fa-pen' : 'fa-check']"></span>
		<button class="button is-primary">สร้างใบเสนอราคา</button>
		<button class="button is-primary">สร้างใบแจ้งหนี้</button>
		<div class="dashboard-wrapper limit-small-panel">
			<div class="dashboard-row">
				<div class="dashboard-bar">
					<h2 v-show="toggled !== 1" class="dashboard-title">{{ project.name }}</h2>

					<div class="field" v-show="toggled == 1">
						<div class="control">
							<input class="input" type="text" placeholder="ชื่อโปรเจค" v-model="project.name" />
						</div>
					</div>

					<button
						class="fas"
						:class="{ 'fa-pen': !toggled, 'fa-times': toggled == 1 }"
						@click="toggleEdit(1)"
					>
						{{ toggled == 1 ? 'ยกเลิก' : 'แก้ไข' }}
					</button>
				</div>
			</div>

			<div class="dashboard-row">
				<div class="dashboard-bar">
					<p class="dashboard-subtitle">ระยะเวลาโปรเจค</p>
					<button class="fas fa-pen">แก้ไข</button>
				</div>

				<p><span class="dashboard-span">เริ่ม</span>{{ $format.date(project.start) }}</p>
				<p><span class="dashboard-span">จบ</span>{{ $format.date(project.end) }}</p>
			</div>

			<div class="dashboard-row">
				<div class="dashboard-bar">
					<p class="dashboard-subtitle">รายการงาน</p>
					<button class="fas fa-pen" @click="toggleEdit(3)">แก้ไข</button>
				</div>

				<div div v-if="toggled !== 3">
					<p style="margin-bottom: 20px"><span class="dashboard-span">คิดราคาแบบ</span>{{billingTypeConvert}}</p>
					<div class="columns is-multiline services" v-for="(item, index) in project.items">
						<div class="column is-8">{{ item.name}}</div>
						<div class="column" v-show="item.rate">{{ item.qty}}</div>
						<div class="column">{{ $format.price(item.price) }}&nbsp;บาท</div>
						<div class="column is-12" v-show="item.due">วันเรียกชำระ : {{ $format.date(item.due) }}</div>
					</div>
				</div>
				<!-- SERVICES FORM -->
				<div v-else>
					<service-form
						:services="project.items"
						:diposit="project.diposit"
						:pricing="project.pricingRule"
						:rate="project.rate"
						@diposit-input="project.diposit = $event"
						@pricing-input="project.pricingRule = $event"
						@rate-input="project.rate = $event"
					></service-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			project: [],
			toggled: null,
			loaded: false,
			projectIndex: null,
			pricingRulesData: {
				fixed: "เหมาจ่ายครั้งเดียว",
				rate: "ตามระยะเวลา (ชั่วโมง, สัปดาห์, เดือน, ปี)",
				item: "ตามจำนวน (คำ, ชิ้นงาน, หน่วย)",
				milestone: "แบ่งจ่ายเป็นงวด"
			}
		};
	},
	computed: {
		billingTypeConvert () {
			// convert pricing rule to readable string
			return this.pricingRulesData[this.project.pricingRule]
		}
	},
	methods: {
		get() {
			this.$getDataById('projects', this.$route.params.id).then(res => {
				this.project = res;
				this.project.id = this.$route.params.id;
				this.convertDate()
				setTimeout(() => (this.loaded = true), 2000);
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
		update(key, val) {
			let data = {};
			data[key] = val;
			this.$updateData('projects', this.$route.params.id, data, true).then(res => {
				console.log(res);
			});
		},
		// update the entire data set by autosaving
		updateAll() {
			this.$updateData(
				'projects',
				this.$route.params.id,
				this.project,
				this.projectIndex,
				false
			).then(res => {
				console.log(res);
			});
		},
		getIndex() {
			let item = JSON.parse(localStorage.getItem('projects'));
			var index = item.findIndex(element => element.id == this.$route.params.id);
			this.projectIndex = index
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
		},
		toggleEdit(field) {
			if (this.toggled) {
				this.toggled = null;
			} else {
				this.toggled = field;
			}
		},
		convertDate() {
			//convert start and end time
			if(this.project.start || this.project.end) {
				this.project.start = this.project.start.toDate()
				this.project.end = this.project.end.toDate()
			}

			// convert if service has due date
			if(this.project.pricingRule == 'milestone') {
			this.project.items.forEach(item => {
				if(item.due) {
					item.due = item.due.toDate()
				}
			});
			}

		}
	},
	watch: {
		project: {
			deep: true,
			handler() {
				if (this.loaded) {
					clearTimeout(this.$root.updateTimer);
					// set update timer
					this.$root.updateTimer = setTimeout(() => {
						this.updateAll();
					}, 3000);
					console.log('changed');
				}
			}
		}
	},
	mounted() {
		this.$root.page = 'dashboard';
		this.$root.pageTitle = 'โปรเจค';
		this.get();
		this.getIndex();
		this.convertDate();
	}
};
</script>

<style lang="sass">
.dashboard-wrapper
   margin-top: 1.75rem
   box-shadow: 0px 5px 33px -1px #ddd
   border-radius: 8px
   > div
      padding: .75rem 1.25rem
   > div:not(:first-child)
      padding: .75rem 1.25rem
   > div:not(:last-child)
      border-bottom: 1px solid #eee
.limit-small-panel
	max-width: 750px
.limit-medium-panel
	max-width: 1200px
.dashboard-row
   > *
      padding: .5rem 0
.dashboard-bar
   display: flex
   justify-content: space-between
   align-items: center
   .dashboard-subtitle
      margin-bottom: 0
   button
      color: #999
      padding: 10px
      background: none
      cursor: pointer
      border: none
      font-weight: normal
      &::before
         font-weight: 600
         margin-right: 4px
      &:hover
         color: #00dbb1
.dashboard-title
   font-size: 1.75rem
.dashboard-subtitle
   font-weight: bold
.dashboard-span
   width: 100px
   font-weight: bold
   padding-right: 15px
.columns.services
	padding: .5rem
	border-bottom: 1px solid #eee
</style>
