<template>
	<div class="bar">
		<div class="barbox dflex_c">
			<div class="iotfont"><v-countup start-value="0" :end-value="dataSta.member_cnt" :options="countupOptions"></v-countup></div>
			<span class="line"></span>
			<div class="iotfont"><v-countup start-value="0" :end-value="dataSta.member_cnt_7" :options="countupOptions"></v-countup></div>
			<span class="line"></span>
			<div class="iotfont"><v-countup start-value="0" :end-value="dataSta.member_cnt_yesterday" :options="countupOptions"></v-countup></div>
			<span class="line"></span>
			<div class="iotfont"><v-countup start-value="0" :end-value="dataSta.order_cnt" :options="countupOptions"></v-countup></div>
			<span class="line"></span>
			<div class="iotfont"><v-countup start-value="0" :end-value="dataSta.pay_cnt" :options="countupOptions"></v-countup></div>
			<span class="line"></span>
			<div class="iotfont"><v-countup start-value="0" :end-value="dataSta.pay_money" :options="countupOptions"></v-countup></div>
		</div>
		<div class="barbox2 dflex">
			<div>总会员数</div>
			<div>近周活跃</div>
			<div>昨日新增</div>
			<div>昨日订单</div>
			<div>今日订单</div>
			<div>今日付款</div>
		</div>
	</div>
</template>

<script>
import vCountup from 'vue-countupjs';
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	components: { vCountup },
	data() {
		return {
			countupOptions: {
				separator: ''
			},
			dataSta: {}
		};
	},
	mounted() {
		this.dataSta = usebi.sta((res)=>{
			this.dataSta = res;
		});
	}
};
</script>

<style></style>
