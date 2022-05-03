<template>
	<div class="head pos_r">
		<el-tooltip content="动画开关" placement="bottom" :hide-after="1000" :enterable="false" effect="light">
			<el-switch v-model="animateBtn" active-color="#df7f7f" active-text="循坏播放动画" inactive-color="#bbb" class="pos_a animate_btn" @change="animateChange"></el-switch>
		</el-tooltip>
		<h1>用云BI</h1>
		<div class="iotfont pos_a time">{{ biTime }}</div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			animateBtn: true,
			biTime: ''
		};
	},
	methods: {
		getTime() {
			setInterval(() => {
				this.biTime = new Date().format('yyyy-MM-dd hh:mm:ss');
			}, 1000);
		},
		animateChange(res) {
			usebi.animateChange(res);
		}
	},
	mounted() {
		this.getTime();
	}
};
</script>

<style></style>
