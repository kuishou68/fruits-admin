<template>
	<div class="boxall c_bottom w100 bs_bb" style="padding: 0 0.2rem 0.4rem 0.15rem; height: 3.4rem">
		<div class="pos_r">
			<div class="alltitle">日/月订单数</div>
			<div class="pos_a cut_btn dflex">
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: orderCutBtn == '日' }" @click="orderDay" round>日</el-button>
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: orderCutBtn == '月' }" @click="orderMonth" round>月</el-button>
			</div>
		</div>
		<div class="allnav" id="order"></div>
		<div class="boxfoot"></div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			orderCutBtn: '日',
			orderDom: null,
			orderOption: {}
		};
	},
	methods:{
		orderDay(){
			this.orderCutBtn = '日';
			usebi.orderCharts(this, () => {
				usebi.orderDay();
			});
		},
		orderMonth(){
			this.orderCutBtn = '月';
			usebi.orderCharts(this, () => {
				usebi.orderMonth();
			});
		}
	},
	mounted() {
		this.orderDay();
	}
};
</script>

<style></style>
