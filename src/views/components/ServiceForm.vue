<template>
	<div>
		<div class="form-wrapper">
			<div class="field is-horizontal field-wrapper">
				<div class="field-label align-self-center">
					<label class="label">คิดราคาแบบไหน</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<div class="select is-fullwidth">
								<select v-model="pricingRule" @change="resetService(), $emit('pricing-input', $event.target.value)">
									<option value="fixed">เหมาจ่ายครั้งเดียว</option>
									<option value="rate">ตามระยะเวลา (ชั่วโมง, สัปดาห์, เดือน, ปี)</option>
									<option value="item">ตามจำนวน (คำ, ชิ้นงาน, หน่วย)</option>
									<option value="milestone">แบ่งจ่ายเป็นงวด</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="field is-horizontal field-wrapper" v-if="pricingRule == 'rate'">
				<div class="field-label align-self-center">
					<label class="label">กำหนดเวลาตายตัว</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control">
							<label class="radio" @click="resetQty()">
								<input type="radio" v-model="rateQty" id="yes" :value="true" @input="$emit('rate-input', $event.target.value)" />
								ใช่
							</label>
							<label class="radio" @click="resetQty()" style="margin-left: 30px">
								<input type="radio" v-model="rateQty" id="no" :value="false" @input="$emit('rate-input', $event.target.value)" />
								ไม่
							</label>
						</div>
					</div>
				</div>
			</div>

			<!-- Services field lists -->
			<div class="service-wrapper" v-for="(service, index) in items">
				<a
					class="fas fa-times-circle service-cancle"
					:class="{ disabled: items.length == 1 }"
					@click="removeService(index)"
				></a>
				<div class style="width:100%">
					<div class="field is-grouped service-input">
						<p class="control is-expanded">
							<input
								class="input"
								type="text"
								placeholder="เช่น ออกแบบโลโก้"
								v-model="service.name"
							/>
						</p>
						<p
							class="control is-expanded"
							v-if="rateQty || pricingRule == 'item'"
							style="max-width:50px"
						>
							<input
								class="input has-text-centered"
								type="text"
								placeholder="จำนวน"
								v-model="service.qty"
							/>
						</p>
						<div class="field has-addons">
							<div class="control" style="max-width: 120px">
								<input placeholder="ราคา" type="number" class="input" v-model="service.price" />
							</div>
							<p class="control">
								<a class="button is-static">บาท</a>
							</p>
							<div class="control" v-if="pricingRule == 'rate'">
								<div class="select">
									<select name="rates" v-model="service.rate">
										<option value="hourly">ต่อชั่วโมง</option>
										<option value="daily">ต่อวัน</option>
										<option value="weekly">ต่อสัปดาห์</option>
										<option value="monthly">ต่อเดือน</option>
										<option value="yearly">ต่อปี</option>
									</select>
								</div>
							</div>
							<div class="control" v-if="pricingRule == 'item'">
								<div class="select">
									<select name="items" v-model="service.rate">
										<option value="word">ต่อคำ</option>
										<option value="item">ต่อชิ้น</option>
										<option value="unit">ต่อหน่วย</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					<datepicker
						input-class="input date-input"
						placeholder="วันเรียกชำระ"
						wrapper-class
						:clear-button="true"
						ref="dateInput"
						v-if="pricingRule == 'milestone'"
                  v-model="service.due"
					></datepicker>
				</div>
			</div>
			<div class="form-wrapper">
				<a class="icon-button-flat" @click="addService()">
					<i class="fas fa-plus-circle"></i>เพิ่มบริการ
				</a>
			</div>

			<div class="form-wrapper">
				<a
					class="checkbox-button"
					:class="{ checked: dipositRequired }"
					@click="(dipositRequired = !dipositRequired), (dipositAmount = null)"
				>
					<i :class="{ 'fas fa-check-square': dipositRequired, 'far fa-square': !dipositRequired }"></i
					>เรียกเก็บเงินมัดจำหรือไม่?
				</a>
			</div>

			<div class="field is-horizontal field-wrapper" v-show="dipositRequired">
				<div class="field-label align-self-center">
					<label class="label">เงินมัดจำ</label>
				</div>
				<div class="field-body">
					<div class="field has-addons">
						<div class="control">
							<div class="field">
								<p class="control">
									<input
                              @input="$emit('diposit-input', $event.target.value)"
										v-model="dipositAmount"
										placeholder="เงินมัดจำ"
										type="number"
										class="input"
									/>
								</p>
							</div>
						</div>
						<p class="control">
							<a class="button is-static">บาท</a>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="total-wrapper">
			<div>รวมทั้งสิ้น</div>
			<div>
				<span v-if="pricingRule !== 'rate'">{{ $format.price(priceCalc) }}</span>
				<div class="rate-total" v-else>
					<span v-show="rateQty">{{ $format.price(priceCalc) }}&nbsp;บาท</span>
					<span v-show="priceCalc.totalHourly"
						>{{ $format.price(priceCalc.totalHourly) }}&nbsp;บาท/ชั่วโมง</span
					>
					<span v-show="priceCalc.totalDaily"
						>{{ $format.price(priceCalc.totalDaily) }}&nbsp;บาท/วัน</span
					>
					<span v-show="priceCalc.totalWeekly"
						>{{ $format.price(priceCalc.totalWeekly) }}&nbsp;บาท/สัปดาห์</span
					>
					<span v-show="priceCalc.totalMonthly"
						>{{ $format.price(priceCalc.totalMonthly) }}&nbsp;บาท/เดือน</span
					>
					<span v-show="priceCalc.totalYearly"
						>{{ $format.price(priceCalc.totalYearly) }}&nbsp;บาท/ปี</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			billingRule: 'fixed',
			pricingRule: 'fixed',
			rateQty: false,
			dipositRequired: false,
			dipositAmount: null,
			items: [
				{
					name: null,
					price: null,
					qty: 1,
					rate: null,
					due: null
				}
			],
			totalCost: null
		};
   },
   props: ['services', 'diposit', 'pricing', 'rate'],
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
		},
		priceCalc: function() {
			if (this.pricingRule == 'rate') {
				let hourlyPrice = [];
				let dailyPrice = [];
				let weeklyPrice = [];
				let monthlyPrice = [];
				let yearlyPrice = [];
				for (const item of this.items) {
					if (item.rate == 'hourly') {
						var fee = item.price * item.qty;
						hourlyPrice.push(fee);
					} else if (item.rate == 'daily') {
						var fee = item.price * item.qty;
						dailyPrice.push(fee);
					} else if (item.rate == 'weekly') {
						var fee = item.price * item.qty;
						weeklyPrice.push(fee);
					} else if (item.rate == 'monthly') {
						var fee = item.price * item.qty;
						monthlyPrice.push(fee);
					} else if (item.rate == 'yearly') {
						var fee = item.price * item.qty;
						yearlyPrice.push(fee);
					}
				}
				var totalHourly = hourlyPrice.reduce(function(total, num) {
					return total + num;
				}, 0);
				var totalDaily = dailyPrice.reduce(function(total, num) {
					return total + num;
				}, 0);
				var totalWeekly = weeklyPrice.reduce(function(total, num) {
					return total + num;
				}, 0);
				var totalMonthly = monthlyPrice.reduce(function(total, num) {
					return total + num;
				}, 0);
				var totalYearly = yearlyPrice.reduce(function(total, num) {
					return total + num;
				}, 0);
				var totalSum = {
					totalHourly,
					totalDaily,
					totalWeekly,
					totalMonthly,
					totalYearly
				};
				if (this.rateQty) {
					return Object.values(totalSum).reduce((a, b) => a + b) || '0';
				} else {
					return totalSum;
				}
			} else {
				let totalPrice = [];
				for (const item of this.items) {
					var serviceFee = item.price * item.qty;
					totalPrice.push(serviceFee);
				}
				var total = totalPrice.reduce(function(total, num) {
					return total + num;
				}, 0);
				return total || '0';
			}
		}
	},
	methods: {
      initComponent() {
         if(this.services) {
            this.items = this.services
            
         }
         if (this.diposit) {
            this.dipositRequired = true
            this.dipositAmount = this.diposit
         }
         if (this.pricing) {
            this.pricingRule = this.pricing
         }
         if (this.rate) {
            this.rateQty = this.rate
         }
      },
		addService() {
			if (this.pricingRule == 'rate') {
				this.items.push({
					name: null,
					price: null,
					qty: 1,
					rate: 'hourly',
					due: null
				});
			} else {
				this.items.push({
					name: null,
					price: null,
					qty: 1,
					rate: null,
					due: null
				});
			}
		},
		removeService(index) {
			if (this.items.length > 1) {
				this.items.splice(index, 1);
			}
		},
		resetService() {
			if (this.pricingRule == 'rate') {
				for (const item of this.items) {
					item.qty = 1;
					item.due = null;
					item.rate = 'hourly';
				}
			} else if (this.pricingRule == 'item') {
				for (const item of this.items) {
					item.qty = 1;
					item.due = null;
					item.rate = 'item';
				}
				this.rateQty = false;
			} else {
				for (const item of this.items) {
					item.qty = 1;
					item.due = null;
					item.rate = null;
				}
            this.rateQty = false;
            this.$emit('rate-input', false)
			}
		},
		resetQty() {
			for (const item of this.items) {
				item.qty = 1;
			}
      },
      saveData() {

      }
   },
   mounted() {
      this.initComponent()
   }
};
</script>
