<template>
	<div class="boxall" style="padding: 0 0.2rem 0.4rem 0.15rem; height: 3.4rem">
		<div class="alltitle">会员性别分布</div>
		<div class="allnav" id="gender"></div>
		<div class="boxfoot"></div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			genderDom: null,
			genderOption: {}
		};
	},
	mounted() {
		usebi.genderCharts(this, () => {
			usebi.genderData();
		});
	}
};
</script>

<style></style>
