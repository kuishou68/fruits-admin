<template>
	<div>
		<use-table ref="tbl"></use-table>
		<div class="container container_status dflex_vertical_c">
			<div class="item_interval" v-for="(item, i) in stateDatas" :key="i">
				<el-button class="badge_txt" :class="{ active: item.name == state }" size="small" @click="cutSta(item)">{{ item.name }}</el-button>
				<v-countup class="badge" start-value="0" :end-value="item.cnt"></v-countup>
			</div>
		</div>
		<div class="container padding_b_0">
			<div class="dflex_wrap">
				<div class="dflex_vertical_c margin_r_40 margin_b_20">
					<div class="search_name">水果名称：</div>
					<el-input v-model="req.name" placeholder="请输入" @input="loadData" class="search_input"></el-input>
				</div>
				<el-button size="mini" class="search_btn margin_b_20 margin_r_40" @click="loadData">搜索</el-button>
			</div>
		</div>
		<div class="container use-table">
			<div class="dflex_sb margin_b_15">
				<div><el-button class="batch_btn padding0" @click="removes">删除</el-button></div>
				<el-button class="add_btn pos_r padding0" icon="iconfont iconxinzeng" @click="toAdd">新增</el-button>
			</div>
			<el-table :height="tblHeight" :data="tableDatas" @selection-change="selectionChange" highlight-current-row>
				<el-table-column type="selection"></el-table-column>
				<!-- <el-table-column label="排序" width="200" align="center">
					<template slot-scope="scope">
						<el-input-number size="small" :min="1" v-model="scope.row.sort" @change="sortChange(scope.row)" @blur="sortChange(scope.row)"></el-input-number>
					</template>
				</el-table-column> -->
				<el-table-column label="水果" width="330" align="center">
					<template slot-scope="scope">
						<div class="dflex_vertical_c">
							<el-image style="width: 100px;height: 80px;" :src="scope.row.img" :preview-src-list="scope.row.imgs" fit="contain"></el-image>
							<div class="left_just margin_l_10">
								<div class="ellipsis">{{ scope.row.name }}</div>
								<div class="ellipsis">{{ scope.row.name_pw }}</div>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="价格" align="center">
					<template slot-scope="scope">
						<div class="price">{{ scope.row.market_price / 100}}</div>
						<!-- <div class="m_price">{{ scope.row.price / 100 }}</div> -->
					</template>
				</el-table-column>
				<el-table-column label="限时精选" align="center">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.limited == '1' ? '取消限时精选' : '启用限时精选'" placement="top" :hide-after="1000" :enterable="false" effect="light">
							<el-switch
								v-model="scope.row.limited"
								active-color="#ff6a6c"
								inactive-color="#bbb"
								active-value="1"
								inactive-value="0"
								@change="limitedChang(scope.row)"
							></el-switch>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="热门推荐" align="center">
					<template slot-scope="scope">
						<el-tooltip :content="scope.row.hot == '1' ? '取消热门推荐' : '启用热门推荐'" placement="top" :hide-after="1000" :enterable="false" effect="light">
							<el-switch
								v-model="scope.row.hot"
								active-color="#ff6a6c"
								inactive-color="#bbb"
								active-value="1"
								inactive-value="0"
								@change="hotChang(scope.row)"
							></el-switch>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column property="state" label="状态" align="center"></el-table-column>
				<el-table-column label="数据统计" align="left" width="150">
					<template slot-scope="scope">
						<div class="left_just">
							<div>已售数:{{ scope.row.sale_cnt }}</div>
							<div>访问数:{{ scope.row.visit_cnt }}</div>
							<div>收藏数:{{ scope.row.collect_cnt }}</div>
							<div>分享数:{{ scope.row.share_cnt }}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="120">
					<template slot-scope="scope">
						<div>
							<el-tooltip content="上架" placement="top" :hide-after="1000" :enterable="false" effect="light" v-if="scope.row.state == '待审核'">
								<el-button icon="iconfont iconshangjia" circle @click="staUp(scope.row._id)"></el-button>
							</el-tooltip>
							<el-tooltip content="下架" placement="top" :hide-after="1000" :enterable="false" effect="light" v-if="scope.row.state == '销售中'">
								<el-button icon="iconfont iconxiajia1" circle @click="staOut(scope.row._id)"></el-button>
							</el-tooltip>
							<el-tooltip content="编辑" placement="top" :hide-after="1000" :enterable="false" effect="light">
								<el-button icon="iconfont iconbianji" circle @click="toEdit(scope.row._id)"></el-button>
							</el-tooltip>
							<el-tooltip content="删除" placement="top" :hide-after="1000" :enterable="false" effect="light" v-if="scope.row.state == '已下架' || scope.row.state == '待审核'">
								<el-button icon="iconfont iconshanchu" circle @click="remove(scope.row._id)"></el-button>
							</el-tooltip>
						</div>
						<!-- <div class="margin_t_10"> -->
							
							<!-- <el-tooltip content="评价" placement="top" :hide-after="1000" :enterable="false" effect="light" v-if="scope.row.state == '销售中'">
								<el-button icon="iconfont iconpingjia1" circle @click="toEvaluate(scope.row._id)"></el-button>
							</el-tooltip>
							<el-tooltip content="二维码" placement="top" :hide-after="1000" :enterable="false" effect="light" v-if="scope.row.state == '销售中'"><el-button icon="iconfont iconerweima" circle @click="qrCode"></el-button></el-tooltip>
							<el-tooltip content="预览" placement="top" :hide-after="1000" :enterable="false" effect="light" v-if="scope.row.state == '待审核'">
								<el-button icon="el-icon-view" circle @click="preview(scope.row._id)"></el-button>
							</el-tooltip> -->
						<!-- </div> -->
					</template>
				</el-table-column>
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
import vCountup from 'vue-countupjs';
import {fruitInfo} from '@/common/fruit';

const __name = 'usemall-goods';
const __goodsCategory = 'usemall-goods-category';
export default {
	components: { vCountup },
	data() {
		return {
			state: '全部',
			classOptions: [],
			stateObj: {
				待审核: 0,
				销售中: 0,
				已下架: 0,
				全部: 0
			},
			stateDatas: [],
			req: {
				page: 1,
				rows: 10,
				orderby: 'sort asc',
				name: '',
				state: ''
			},
			tblHeight: 0,
			tableDatas: [],
			tableTotal: 0,
			selectDatas: [],
			fruitInfo: fruitInfo
		};
	},
	methods: {
		async loadData() {
			this.stateDatas = [];
			for (let key in this.stateObj) {
				this.stateDatas.push({
					name: key,
					cnt: this.stateObj[key]
				});
			}

			await this.$db[__name]
				.whereif(this.req.state && this.req.state != '全部', { state: this.req.state })
				.whereif(this.req.name, { name: new RegExp(this.req.name) })
				.withgroup({ field: 'state', obj: this.stateObj })
				.totable(this.req)
				.then(res => {
					if (res.code == 200) {
						if (res.datas.group && res.datas.group.datas) {
							this.stateDatas = res.datas.group.datas;
						}
						console.log(res)
						res.datas.rows.forEach((row, idx) => {
							row.imgs = [row.img];
							row.limited = row.limited + '';
							row.hot = row.hot + '';
						});
						this.tableDatas = res.datas.rows;
						this.tableTotal = res.datas.total;
					}
				});
			this.fruitInfoFilter();
		},
		fruitInfoFilter(){
			// console.log(this.fruitInfo);
			// console.log(this.classOptions)
			// 遍历水果分类信息，给水果添加新属性
			this.classOptions.map((item) => {
				for (let i = 0; i < this.fruitInfo.length; i++){
					// 去除不用的数据
					if (this.fruitInfo[i].price === 0.00 || this.fruitInfo[i].price > 100.00 ) this.fruitInfo.splice(i, 1);
					// 给不同类水果添加分类id
					if (this.fruitInfo[i].name === item.name){
						this.fruitInfo[i].cids = item._id; // 水果分类id
						this.fruitInfo[i].img = item.img; // 缩略图
						this.fruitInfo[i].profit_margin = 0.2; // 毛利率
						this.fruitInfo[i].imgs = [{}]; // 水果详情图
						this.fruitInfo[i].imgs[0].name = item.name; // 详情图名称
						this.fruitInfo[i].imgs[0].image = item.img; // 详情图格式
						this.fruitInfo[i].imgs[0].size = 117874; // 详情图大小
						this.fruitInfo[i].imgs[0].path = item.img; // 详情图地址
						this.fruitInfo[i].imgs[0].url = item.img; // 详情图url 
					}
				}
			});
			// console.log(imgs)
			// console.log(this.fruitInfo)
			const new_fruit = this.fruitInfo.map((item, index) => {
				return {
						    "cid": "625ae0925a5bf000011" + index,
						    "cids": item.cids,
						    "sort": index,
						    "name": item.name,
						    "name_pw": item.name,
						    "limited": 0,
						    "hot": 0,
						    "tags": [],
						    "price": item.price * 100, // 进货价
						    "profit_margin": item.profit_margin, // 毛利率
						    "market_price": item.price / (1 - item.profit_margin) * 100, // 销售价
						    "limit": 0, // 限购量
						    "stock_num": 100, // 库存
						    "sale_cnt": 0,
						    "sale": 0,
						    "visit_cnt": 0,
						    "visit": 0,
						    "collect_cnt": 0,
						    "collect": 0,
						    "share_cnt": 0,
						    "share": 0,
						    "sold_out_time": item.date,
						    "state": "销售中",
						    "source_city": item.city, // 产地
						    "share_title": item.name,
						    "share_img": item.img,
						    "share_desc":item.name,
						    "skus": "{\"spec_s\":\"规格\",\"spec\":[]}",
						    "img": item.img,
						    "imgs": item.imgs,
						    "last_modify_uname": "kuishou",
						    "last_modify_uid": "617faa5f9ec22f00013cee88",
					}
			});
			console.log(new_fruit);
			let obj = {...new_fruit}; // 将数组对象结构
			// this.saveJSON(obj, 'new_fruitInfo.json');
		},
		// 生成json文件
		saveJSON(data, filename){
			if(!filename) filename = 'json.json'
			if(typeof data === 'object'){
				data = JSON.stringify(data, undefined, 4)
			}
			var blob = new Blob([data], {type: 'text/json'}),
			e = document.createEvent('MouseEvents'), // 创建一个鼠标事件
			a = document.createElement('a') // 创建一个 a 连接
			a.download = filename; // 设置a连接下载文件的名称
			a.href = window.URL.createObjectURL(blob) // 创建下载的URL对象
			a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
			// 初始化事件
			e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
			// 触发事件
			a.dispatchEvent(e)
		},
		cutSta(item) {
			this.state = item.name;
			this.req.state = item.name;

			this.loadData();
		},
		// 添加水果
		toAdd() {
			uni.navigateTo({
				url: `/pages/goods/list/goods_list_add_edit?tab=添加水果`,
				events: {
					refreshData: () => {
						this.loadData();
					}
				}
			});
		},
		// 水果上架
		staUp(id) {
			this.$confirm('此操作将上架此水果!', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$db[__name].update(id, { state: '销售中' }).then(res => {
					if (res.code == 200) this.loadData();
				});
			});
		},
		// 水果下架
		staOut(id) {
			this.$confirm('此操作将下架此水果!', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$db[__name].update(id, { state: '已下架' }).then(res => {
					if (res.code == 200) this.loadData();
				});
			});
		},
		// 编辑水果
		toEdit(id) {
			uni.navigateTo({
				url: `/pages/goods/list/goods_list_add_edit?id=${id}&tab=编辑水果`,
				events: {
					refreshData: () => {
						this.loadData();
					}
				}
			});
		},
		// 添加评价
		toEvaluate(id) {
			uni.navigateTo({
				url: `/pages/goods/list/evaluate_add?id=${id}&tab=添加评价`
			});
		},
		qrCode() {
			this.$message('正在开发中...');
		},
		preview() {
			this.$notify.info({
				title: '消息',
				message: '正在开发中...'
			});
		},
		// 删除水果信息
		remove(id) {
			this.$confirm('此操作将永久删除该数据！', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$db[__name].remove(id).then(res => {
					if (res.code == 200) {
						this.loadData();
					}
				});
			});
		},
		selectionChange(datas) {
			this.selectDatas = datas;
		},
		// 多选删除
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
		// 排序
		sortChange(row) {
			if (row.sort == '') {
				return;
			}

			this.$db[__name].update(row._id, { sort: row.sort }).then(res => {
				if (res.code == 200) this.loadData();
			});
		},
		// 限时精选
		limitedChang(row) {
			this.$db[__name].update(row._id, { limited: parseInt(row.limited) }).then(res => {
				if (res.code == 200) this.loadData();
			});
		},
		// 热门推荐
		hotChang(row) {
			this.$db[__name].update(row._id, { hot: parseInt(row.hot) }).then(res => {
				if (res.code == 200) this.loadData();
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
	created() {
		this.$db[__goodsCategory].totree({ orderby: 'sort asc', startWith: 'pid == ""', loadding: false }).then(res => {
			if (res.code == 200) {
				console.log(res);
				this.classOptions = res.datas;
			}
		});

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
