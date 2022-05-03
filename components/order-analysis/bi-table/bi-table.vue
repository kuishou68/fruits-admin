<template>
	<div class="boxall" style="padding: 0 0.2rem 0.4rem 0.15rem; height: 3.4rem">
		<div class="pos_r">
			<div class="pos_a cut_btn dflex">
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: alarmState == '待付款' }" @click="alarmBtn('待付款')" round>待付款</el-button>
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: alarmState == '待发货' }" @click="alarmBtn('待发货')" round>待发货</el-button>
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: alarmState == '待收货' }" @click="alarmBtn('待收货')" round>待收货</el-button>
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: alarmState == '待评价' }" @click="alarmBtn('待评价')" round>待评价</el-button>
				<el-button size="mini" class="h100 dflex_vertical_c" :class="{ active: alarmState == '已完成' }" @click="alarmBtn('已完成')" round>已完成</el-button>
			</div>
		</div>
		<div class="allnav" style="margin-top: 0.5rem;">
			<table class="w100" cellspacing="0">
				<tr>
					<td>名称</td>
					<td>金额</td>
					<td>状态</td>
					<td>时间</td>
				</tr>
			</table>

			<div
				style="
	                overflow: hidden;
	                overflow-y: auto;
	                height: 2.3rem;
	            "
			>
				<table v-show="tableData && tableData.length > 0" class="w100 inner_table" ref="alarmTable" cellspacing="0">
					<tr v-for="(item, i) in tableData" :key="i">
						<td>
							<div>{{ item.name }}</div>
						</td>
						<td>{{ item.money }}</td>
						<td>{{ item.state }}</td>
						<td>{{ item.time }}</td>
					</tr>
				</table>

				<div v-show="!(tableData && tableData.length > 0)" class="dflex_c h100"><div class="fff">无报警数据</div></div>
			</div>
		</div>
		<div class="boxfoot"></div>
	</div>
</template>

<script>
import usebi from '@/js_sdk/Usecloud-UseBI-bi.js';
export default {
	data() {
		return {
			alarmTable: null,
			parentHeight: 0,
			tdHeight: 0,
			marginTop: 0,
			alarm_type: '',
			alarmState: '',
			tableData: []
		};
	},
	methods: {
		table() {
			if (this.alarmTable) return;
			this.alarmTable = document.querySelector('.inner_table');
			this.parentHeight = this.alarmTable.parentElement.clientHeight;
			this.tdHeight = this.alarmTable.querySelector('tr').clientHeight;
			let mouseIn = false;

			this.alarmTable.onmouseover = () => {
				mouseIn = true;
			};
			this.alarmTable.onmouseout = () => {
				mouseIn = false;
			};
			setInterval(() => {
				if (mouseIn) return;

				this.alarmTable.style.marginTop = this.marginTop + 'px';

				if (Math.abs(this.marginTop) > this.alarmTable.clientHeight - this.parentHeight) {
					this.marginTop = 0;
				} else {
					this.marginTop -= this.tdHeight;
				}
			}, 2000);
		},
		alarmBtn(data) {
			this.alarmState = data == this.alarmState ? '' : data;
			this.tableData = usebi.getTable(data || '待发货');
		}
	},
	mounted() {
		window.addEventListener('resize', () => {
			this.marginTop = 0;
		
			this.alarm_table = document.querySelector('.inner_table');
			this.parentHeight = this.alarm_table.parentElement.clientHeight;
			if (this.alarm_table.querySelector('tr')) {
				this.tdHeight = this.alarm_table.querySelector('tr').clientHeight;
			}
		});

		this.tableData = usebi.getTable('待发货');
	}
};
</script>

<style></style>
