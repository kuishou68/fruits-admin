<template>
	<div>
		<use-table ref="tbl"></use-table>
		<div class="container padding_b_0">
			<div class="dflex_wrap">
				<div class="dflex_vertical_c margin_r_40 margin_b_20">
					<div class="search_name">收货人手机号：</div>
					<el-input v-model="req.mobile" placeholder="请输入" class="search_input"  clearable></el-input>
				</div>
				<div class="dflex_vertical_c margin_r_40 margin_b_20">
					<div class="search_name">收货人名称：</div>
					<el-input v-model="req.consignee" placeholder="请输入" class="search_input" clearable></el-input>
				</div>
				<div class="dflex_vertical_c margin_r_40 margin_b_20">
					<div class="search_name">创建时间：</div>
					<el-date-picker
						v-model="searchTime"
						type="daterange"
						align="right"
						unlink-panels
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						format="yyyy-MM-dd"
						class="search_start_end_time"
					></el-date-picker>
				</div>
				<el-button size="mini" class="search_btn margin_b_20 margin_r_40" @click="loadData">搜索</el-button>
			</div>
		</div>
		<div class="container use-table">
			<!-- <div class="dflex_sb margin_b_15">
				<div><el-button class="batch_btn padding0" @click="removes">删除</el-button></div>
				<el-button class="add_btn pos_r padding0" icon="iconfont iconxinzeng" @click="toAdd">新增</el-button>
			</div> -->
			<el-table :data="tableDatas" highlight-current-row>
				<el-table-column property="create_time" label="创建时间" align="center"></el-table-column>
				<el-table-column property="mobile" label="收货人手机号" align="center"></el-table-column>
				<el-table-column property="consignee" label="收货人名称" align="center"></el-table-column>
				<el-table-column property="address" label="收货地址" align="center"></el-table-column>
				<el-table-column property="addr_detail" label="详细收货地址" align="center"></el-table-column>
				<el-table-column property="remark" label="备注" align="center"></el-table-column>
			</el-table>
			<el-pagination
				:current-page="req.page"
				:page-sizes="[10, 20, 30, 50, 100]"
				:page-size="req.rows"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableTotal"
				@size-change="sizeChange"
				@current-change="currentChange"
			></el-pagination>
		</div>
	</div>
</template>

<script>
const __name = 'usemall-member-address';
export default {
	data() {
		return {
			advancedSearch: false,
			searchTime: [],
			dataId: '',
			req: {
				page: 1,
				rows: 10,
				orderby: 'sort asc',
				mobile: '',
				consignee: '',
				begin_time: '',
				end_time: ''
			},
			tblHeight: 0,
			tableDatas: [],
			tableTotal: 0
		};
	},
	methods: {
		async loadData() {
			this.req.begin_time = '';
			this.req.end_time = '';
			
			if (this.searchTime && this.searchTime.length > 0) {
				this.req.begin_time = this.searchTime[0].getTime();
				this.req.end_time = this.searchTime[1].getTime();
			}
			console.log(this.req)
			await this.$db[__name]
				.whereif(this.req.mobile, { mobile : this.req.mobile })
				.whereif(this.req.consignee, { consignee: new RegExp(this.req.consignee) })
				.whereif(this.searchTime && this.searchTime.length > 0, { create_time: this.$db.$cmd.gte(this.req.begin_time).and(this.$db.$cmd.lte(this.req.end_time)) })
				.totable(this.req).then(res => {
				if (res.code == 200) {
					res.datas.rows.forEach((row, idx) => {
						row.create_time = new Date(row.create_time).format();
					});
					this.tableDatas = res.datas.rows;
					this.tableTotal = res.datas.total;
				}
			});
		},
		sizeChange(size) {
			this.req.rows = size;
			this.loadData();
		},
		currentChange(current) {
			this.req.page = current;
			this.loadData();
		}
	},
	// 新增地址
	toAdd() {
		uni.navigateTo({
			url: `/pages/member/list/member_list_add_edit?tab=添加地址`,
			events: {
				refreshData: () => {
					this.loadData();
				}
			}
		});
	},
	// 删除地址
	removes() {
		if (this.selectDatas.length <= 0) {
			this.$message('请勾选需要删除的数据');
			return;
		}
	
		let ids = this.selectDatas.map(x => x._id);
	
		this.$confirm('此操作将永久删除勾选数据！', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			this.$db[__name]
				.where({
					_id: this.$db.$cmd.in(ids)
				})
				.remove()
				.then(res => {
					if (res.code == 200) {
						this.loadData();
					}
				});
		});
	},
	created() {
		this.dataId = this.$route.query.id || '';
		this.loadData();
	},
	updated() {
		if (!this.tblHeight) {
			this.tblHeight = this.$refs.tbl.tblHeight;
		}
	}
};
</script>

<style></style>
