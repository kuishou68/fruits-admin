<template>
	<div class="boxall" style="padding: 0 0.2rem 0.4rem 0.15rem; height: 3.4rem">
		<div class="pos_r">
			<div class="alltitle">日/月会员数</div>
			<div class="pos_a cut_btn dflex">
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: memberCutBtn == '日' }" @click="memberDay" round>日</el-button>
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: memberCutBtn == '月' }" @click="memberMonth" round>月</el-button>
			</div>
		</div>
		<div class="allnav" id="member"></div>
		<div class="boxfoot"></div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			memberCutBtn: '日',
			memberDom: null,
			memberOption: {}
		};
	},
	methods: {
		memberDay() {
			this.memberCutBtn = '日';
			usebi.memberCharts(this, () => {
				usebi.memberDay();
			});
		},
		memberMonth() {
			this.memberCutBtn = '月';
			usebi.memberCharts(this, () => {
				usebi.memberDay();
			});
		}
	},
	mounted() {
		this.memberDay();
	}
};
</script>

<style></style>
