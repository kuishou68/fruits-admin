<template>
	<div class="boxall" style="padding: 0 0.2rem 0.4rem 0.15rem; height: 3.4rem">
		<div class="alltitle">水果订单 TOP8</div>
		<div class="allnav" id="orderRanking"></div>
		<div class="boxfoot"></div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			orderRankingDom: null,
			orderRankingOption: {}
		};
	},
	mounted() {
		usebi.orderRankingCharts(this, () => {
			usebi.orderRankingData();
		});
	}
};
</script>

<style></style>
