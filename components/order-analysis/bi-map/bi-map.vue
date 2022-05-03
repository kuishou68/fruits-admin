<template>
	<div class="map">
		<div class="map1"><img src="../../static/bi/lbx.png" /></div>
		<div class="map2"><img src="../../static/bi/jt.png" /></div>
		<div class="map3" id="map"></div>
	</div>
</template>

<script>
import echarts from 'echarts';
import china from 'echarts/map/json/china.json';
echarts.registerMap('china', china);
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			geoData: {},
			mapDom: null,
			mapOption: {}
		};
	},
	mounted() {
		usebi.mapCharts(this, () => {
			usebi.mapData();
		});
	}
};
</script>

<style></style>
