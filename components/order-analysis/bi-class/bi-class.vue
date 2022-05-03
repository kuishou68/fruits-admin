<template>
	<div class="boxall" style="padding: 0 0.2rem 0.4rem 0.15rem; height: 3.4rem">
		<div class="alltitle" style="font-fail">水果分类</div>
		<div class="allnav" id="class"></div>
		<div class="boxfoot"></div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			classDom: null,
			classOption: {}
		};
	},
	mounted() {
		usebi.classCharts(this, () => {
			usebi.classData();
		});
	}
};
</script>

<style></style>
