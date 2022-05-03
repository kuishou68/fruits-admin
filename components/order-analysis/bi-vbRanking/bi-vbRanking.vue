<template>
	<div class="boxall" style="padding: 0 0.2rem 0.4rem 0.15rem; height: 3.4rem">
		<div class="alltitle">访客/浏览 TOP8</div>
		<div class="allnav" id="vbRanking"></div>
		<div class="boxfoot"></div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			vbRankingDom: null
		};
	},
	mounted() {
		usebi.vbRankingCharts(this, () => {
			usebi.vbRankingData();
		});
	}
};
</script>

<style></style>
