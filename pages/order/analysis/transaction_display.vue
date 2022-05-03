<template>
	<div class="box">
		<div class="headerbox">
			<h1>水果交易查询、分析及展示平台</h1>
			<!-- <div class="showTime">curTime</div> -->
		</div>
		<div class="mainbox">
			<div class="column">
				<div class="panel line">
					<div class="dflex_sb">
						<h3>日/月/年毛利额</h3>
						<div>
							<el-button size="mini" :class="{ active: daysBar == '日' }" @click="dayBar" round>日
							</el-button>
							<el-button size="mini" :class="{ active: daysBar == '月' }" @click="monthBar" round>月
							</el-button>
							<el-button size="mini" :class="{ active: daysBar == '年' }" @click="yearBar" round>年
							</el-button>
						</div>
					</div>
					<div id="create-bar" class="chart"></div>
				</div>
				<div class="panel line">
					<h3>春季销售Top5类水果</h3>
					<div id="create-spring-pie" class="chart"></div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel pie">
					<h3>夏季销售Top5类水果</h3>
					<div id="create-summer-pie" class="chart"></div>
					<div class="panel-footer"></div>
				</div>
			</div>
			<div class="column">
				<div class="no">
					<div class="no-hd">
						<ul>
							<li>{{ fruitStock }}</li>
							<li>{{ orderNum }}</li>
						</ul>
					</div>
					<div class="no-bd">
						<ul>
							<li>水果库存</li>
							<li>水果订单量</li>
						</ul>
					</div>
				</div>
				<div class="map">
					<!-- <div class="chart"></div> -->
					<div id="create-map" class="chart"></div>
					<div class="map1"></div>
					<div class="map2"></div>
					<div class="map3"></div>
				</div>
			</div>
			<div class="column">
				<div class="panel bar1">
					<div class="dflex_sb">
						<h3>日/月/年订单数</h3>
						<div>
							<el-button size="mini" :class="{ active: days == '日' }" @click="day" round>日</el-button>
							<el-button size="mini" :class="{ active: days == '月' }" @click="month" round>月</el-button>
							<el-button size="mini" :class="{ active: days == '年' }" @click="year" round>年</el-button>
						</div>
					</div>
					<div id="create-line-line" class="chart"></div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel pie1">
					<h3>秋季销售Top5类水果</h3>
					<div id="create-autumn-pie" class="chart"></div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel pie1">
					<h3>冬季销售Top5类水果</h3>
					<div id="create-winter-pie" class="chart"></div>
					<div class="panel-footer"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// import vCountup from 'vue-countupjs';
	import echarts from 'echarts';
	import china from 'echarts/map/json/china.json';
	import {
		area_format_user
	} from '@/common/china.js';

	const __name = 'usemall-goods';
	const __goodsCategory = 'usemall-goods-category';
	const __order = 'usemall-order';
	echarts.registerMap('china', china);
	export default {
		components: {

		},
		data() {
			return {
				start: 0,
				classOptions: [], // 水果分类信息
				fruitData: [], // 水果信息
				orderData: [], // 订单信息
				orderList: [], // 整理后的所有订单列表
				profitData: [], // 毛利信息
				profitList: [], // 整理后的所有毛利列表
				searchTime: [], // 搜索时间
				stateDatas: [], // 订单状态
				fruitStock: '', // 水果库存
				orderNum: '', // 水果订单量
				areaFormatUser: area_format_user, // 中国省市区信息
				req: {
					page: 0,
					rows: 0,
					orderby: 'sort asc',
					name: '',
					state: ''
				},
				reqOrder: {
					page: 1,
					rows: 0,
					orderby: 'sort asc',
					order_id: '',
					begin_time: '',
					end_time: '',
					state: ''
				},
				options: {
					useEasing: true, // 缓动动画 easing
					useGrouping: true, // 1,000,000 vs 1000000
					separator: ',', // 数字分隔符
					decimal: '.', // 小数分隔符
					prefix: '', // 前缀
					suffix: '' // 后缀
				},
				options_price: {
					useEasing: true, // 缓动动画 easing
					useGrouping: true, // 1,000,000 vs 1000000
					separator: ',', // 数字分隔符
					decimal: '.', // 小数分隔符
					prefix: '￥', // 前缀
					suffix: '' // 后缀
				},
				member_sta: {},
				order_sta: {},
				options_line_line: [],
				options_bar: [],
				options_spring_pie: [],
				options_summer_pie: [],
				options_autumn_pie: [],
				options_winter_pie: [],
				echart_line_line: null,
				echart_bar: null,
				days: '日',
				daysBar: '日',
				tableData_visit: [],
				tableData_sale: [],
				stateObj: {
					全部: 0,
					待审核: 0,
					销售中: 0,
					已下架: 0
				},
				stateOrderObj: {
					待付款: 0,
					待发货: 0,
					待评价: 0,
					已完成: 0,
					已取消: 0,
					全部: 0
				},
				options_state: [{
						value: '全部',
						label: '全部'
					},
					{
						value: '待审核',
						label: '待审核'
					},
					{
						value: '销售中',
						label: '销售中'
					},
					{
						value: '已下架',
						label: '已下架'
					}
				],
				visit_state_search: '全部',
				sale_state_search: '全部'
			};
		},
		methods: {
			async getFruitCategoryInfo() {
				// 获取水果分类
				await this.$db[__goodsCategory].totree({
					orderby: 'sort asc',
					startWith: 'pid == ""',
					loadding: false
				}).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.classOptions = res.datas;
					}
				});
			},
			async getFruitInfo() {
				// 获取水果信息
				await this.$db[__name]
					.whereif(this.req.state && this.req.state != '全部', {
						state: this.req.state
					})
					.whereif(this.req.name, {
						name: new RegExp(this.req.name)
					})
					.withgroup({
						field: 'state',
						obj: this.stateObj
					})
					.totable(this.req)
					.then(res => {
						if (res.code == 200) {
							console.log(res)
							this.fruitData = res.datas.rows;
							this.fruitStock = res.datas.total;
							this.create_map(); // 水果产地分布
							this.create_pie(); // 水果分类饼状图

						}
					});
			},
			async getOrderInfo() {
				this.stateDatas = [];
				for (let key in this.stateOrderObj) {
					this.stateDatas.push({
						name: key,
						cnt: this.stateOrderObj[key]
					});
				}

				this.reqOrder.begin_time = '';
				this.reqOrder.end_time = '';

				if (this.searchTime && this.searchTime.length > 0) {
					this.reqOrder.begin_time = this.searchTime[0].getTime();
					this.reqOrder.end_time = this.searchTime[1].getTime() + (60 * 60 * 24 - 1) * 1000;
				}

				await this.$db[__order]
					.where({
						is_delete: 0
					})
					.whereif(this.reqOrder.state && this.reqOrder.state != '全部', {
						state: this.reqOrder.state
					})
					.whereif(this.reqOrder.order_id, {
						order_id: new RegExp(this.reqOrder.order_id)
					})
					.whereif(this.searchTime && this.searchTime.length > 0, {
						create_time: this.$db.$cmd.gte(this.reqOrder.begin_time).and(this.$db.$cmd.lte(this
							.reqOrder.end_time))
					})
					.withgroup({
						field: 'state',
						obj: this.stateOrderObj
					})
					.totable(this.reqOrder)
					.then(res => {
						if (res.code == 200) {
							if (res.datas.group && res.datas.group.datas) {
								this.stateDatas = res.datas.group.datas;
							}

							res.datas.rows.forEach((row, idx) => {
								row.imgs = [row.order_member_headimg ||
									'https://mall-os-api.use-cloud.com/files/upload/image/20201024/201024115813649391.jpg'
								];
								row.create_time = new Date(row.create_time).format();
							});

							this.orderData = res.datas.rows;
							this.orderNum = res.datas.total; 
							this.profitData = res.datas.rows;
						}
					});

				let order_num = [];
				let order_list = [];
				let order_mlist = []; // 全部订单数

				let pay_num = [];
				let pay_order_list = [];
				let pay_order_mlist = []; // 支付数

				let cancel_num = [];
				let cancel_order_list = [];
				let cancel_order_mlist = []; // 取消数
				// console.log(this.orderData);
				// 从水果交易订单信息中提取需要的字段
				this.orderData.forEach((item) => {
					// if (item.create_time.substring(0, 10) > '2021-01-01' && item.create_time.substring(0, 10) < '2021-03-31') {
					// 	// console.log('春季')
					// 	// console.log(item)
					// } else if (item.create_time.substring(0, 10) > '2021-04-01' && item.create_time.substring(0, 10) < '2021-06-31') {
					// 	// console.log('夏季')

					// } else if (item.create_time.substring(0, 10) > '2021-07-01' && item.create_time.substring(0, 10) < '2021-09-31') {
					// 	// console.log('秋季')

					// } else if (item.create_time.substring(0, 10) > '2021-10-01' && item.create_time.substring(0, 10) < '2021-12-31') {
					// 	// console.log('冬季')

					// }
					order_num.push({
						time: item.create_time.substring(0, 10),
						name: item.order_info, // 订单水果名称
						state: item.order_pay_state, // 订单状态
						order_cnt: 1, // 初始化水果订单数
					});
					if (item.state === '已完成'){
						console.log(item)
					}
					if (item.order_pay_state === '已完成' || item.order_pay_state === '待发货') {
						pay_num.push({
							time: item.create_time.substring(0, 10),
							state: item.order_pay_state, // 订单状态
							pay_cnt: 1, // 初始化水果订单数
						});
					} else if (item.order_pay_state === '已取消') {
						cancel_num.push({
							time: item.create_time.substring(0, 10),
							state: item.order_pay_state, // 订单状态
							cancel_cnt: 1, // 初始化水果订单数
						});
					}
				});

				// 全部订单数
				let newOrderList = [...new Set(order_num.map(i => i.time))];
				let newOrderInfo = [...new Set(order_num.map(i => i.name))];
				newOrderList.forEach((i) => {
					order_list.push(order_num.filter(t => t.time === i));
				});
				order_list.forEach((item, index) => {
					order_mlist.push({
						time: newOrderList[index],
						name: newOrderInfo[index], // 订单水果名称
						order_cnt: item.length,
						pay_cnt: 0,
						cancel_cnt: 0
					});
				});

				// 支付数
				let newPayOrderList = [...new Set(pay_num.map(i => i.time))];
				newPayOrderList.forEach((i) => {
					pay_order_list.push(pay_num.filter(t => t.time === i));
				});
				pay_order_list.forEach((item, index) => {
					pay_order_mlist.push({
						time: newPayOrderList[index],
						pay_cnt: item.length
					});
				});

				// 取消数
				let newCancelOrderList = [...new Set(cancel_num.map(i => i.time))];
				newCancelOrderList.forEach((i) => {
					cancel_order_list.push(cancel_num.filter(t => t.time === i));
				});
				cancel_order_list.forEach((item, index) => {
					cancel_order_mlist.push({
						time: newCancelOrderList[index],
						cancel_cnt: item.length
					});
				});

				// console.log( this.orderList); // 全部订单数
				// console.log(pay_order_mlist); // 支付数
				// console.log(cancel_order_mlist); // 取消数

				// 合并同一天的订单数、字符数、取消数
				order_mlist.forEach((item) => {
					pay_order_mlist.forEach((i) => {
						if (i.time === item.time) {
							item.pay_cnt = i.pay_cnt
						}
					});
					cancel_order_mlist.forEach((i) => {
						if (i.time === item.time) {
							item.cancel_cnt = i.cancel_cnt
						}
					});
				});

				this.orderList = order_mlist;
				// console.log(this.orderList)
				// 日月年订单 折线图
				this.create_line_line(() => {
					this.day();
				});

				// 统计日月年毛利额
				this.profitData.forEach((item) => {
					if(item.order_total_money){
						this.profitList.push({
							time: item.create_time.substring(0, 10),
							profit: item.order_total_money
						})
					}
				});
				// console.log(this.profitList)
				// 日月年毛利额 柱状图
				this.create_bar(() => {
					this.dayBar();
				});

				// 不同季节top5类水果销售情况
				this.seasons_fruit_sales();
			},
			// 绘制水果分类饼图
			create_pie() {
				const myChart = this.$echarts.init(document.getElementById('create-pie'));
				const state = {
					datas: [{
						state: '待审核',
						cnt: 0
					}, {
						state: '已下架',
						cnt: 0
					}, {
						state: '销售中',
						cnt: 0
					}]
				};
				const category = {
					datas: []
				};
				let new_category_date = [];

				let to_be_reviewed = []; // 待审核水果
				let to_be_reviewed_list = []; // 水果名称数组
				let to_be_reviewed_mlist = []; // 统计完后水果列表

				let lower_shelf = []; // 已下架水果
				let lower_shelf_list = []; // 水果名称数组
				let lower_shelf_mlist = []; // 统计完后水果列表

				let in_sale = []; // 销售中水果
				let in_sale_list = []; // 水果名称数组
				let in_sale_mlist = []; // 统计完后水果列表

				this.fruitData.forEach((item) => {
					for (let i = 0; i < this.classOptions.length; i++) {
						// 统计 水果不同状态数量
						if (item.name_pw === this.classOptions[i].name) {
							if (state.datas[0].state === item.state) {
								// 统计 待审核 水果数
								state.datas[0].cnt++;
							} else if (state.datas[1].state === item.state) {
								// 统计 已下架 水果数
								state.datas[1].cnt++;
								// count ++;
							} else if (state.datas[2].state === item.state) {
								// 统计 销售中 水果数
								state.datas[2].cnt++;
							}
						}
						// 统计某一类水果在 不同状态下的数量
						if (item.name_pw === this.classOptions[i].name && item.state === '待审核') {
							to_be_reviewed.push({
								name: item.name_pw,
								state: item.state,
								cnt: 1
							});
						} else if (item.name_pw === this.classOptions[i].name && item.state === '已下架') {
							lower_shelf.push({
								name: item.name_pw,
								state: item.state,
								cnt: 1
							});
						} else if (item.name_pw === this.classOptions[i].name && item.state === '销售中') {
							in_sale.push({
								name: item.name_pw,
								state: item.state,
								cnt: 1
							});
						}
					}
				});
				// console.log(in_sale)
				// 统计同商品同类型出现了多少次
				let newReviewedNameArr = [...new Set(to_be_reviewed.map(i => i.name))];
				newReviewedNameArr.forEach((i) => {
					to_be_reviewed_list.push(to_be_reviewed.filter(t => t.name === i));
				});
				to_be_reviewed_list.forEach((item, index) => {
					to_be_reviewed_mlist.push({
						name: newReviewedNameArr[index],
						state: '待审核',
						cnt: item.length
					})
				});
				let newLowerShelfNameArr = [...new Set(lower_shelf.map(i => i.name))];
				newLowerShelfNameArr.forEach((i) => {
					lower_shelf_list.push(lower_shelf.filter(t => t.name === i));
				});
				lower_shelf_list.forEach((item, index) => {
					lower_shelf_mlist.push({
						name: newLowerShelfNameArr[index],
						state: '已下架',
						cnt: item.length
					})
				});
				let newinSaleNameArr = [...new Set(in_sale.map(i => i.name))];
				newinSaleNameArr.forEach((i) => {
					in_sale_list.push(in_sale.filter(t => t.name === i));
				});
				in_sale_list.forEach((item, index) => {
					in_sale_mlist.push({
						name: newinSaleNameArr[index],
						state: '销售中',
						cnt: item.length
					})
				});
				// 合并各类统计数据
				category.datas = [...in_sale_mlist, ...lower_shelf_mlist, ...to_be_reviewed_mlist]
				// console.log(state)
				// console.log(category)
				let echartData = {
					inner: [],
					outer: []
				};
				echartData.inner = [];
				echartData.outer = [];
				state.datas.forEach(_ => {
					echartData.inner.push({
						value: _.cnt,
						name: _.state
					});
				});
				category.datas.forEach(_ => {
					echartData.outer.push({
						value: _.cnt,
						name: _.name
					});
				});

				const option = {
					backgroundColor: '',
					color: [
						'#2ec7c9',
						'#b6a2de',
						'#5ab1ef',
						'#ffb980',
						'#d87a80',
						'#8d98b3',
						'#FFEA01',
						'#B8D07C',
						'#fca4bb',
						'#dc69aa',
						'#07a2a4',
						'#9a7fd1',
						'#588dd5',
						'#f5994e',
						'#c05050',
						'#59678c',
						'#c9ab00',
						'#7eb00a',
						'#6f5553',
						'#c14089'
					],
					tooltip: {
						trigger: 'item',
						formatter: '{a} \n{b}: {c} ({d}%)'
					},
					series: [{
							name: '水果状态',
							type: 'pie',
							radius: [0, '35%'],
							itemStyle: {
								normal: {
									borderColor: '#fff',
									borderWidth: 2
								}
							},
							label: {
								normal: {
									position: 'inner'
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: echartData.inner
						},
						{
							name: '水果分类',
							type: 'pie',
							radius: ['45%', '55%'],
							data: echartData.outer,
							labelLine: {
								normal: {
									length: 20,
									length2: 140,
									lineStyle: {
										color: '#e6e6e6'
									}
								}
							},
							label: {
								normal: {
									formatter: params => {
										return '{icon|●}{name|' + params.name + '}{percent|' + params.percent
											.toFixed(1) + '%}{value|' + params.value + '}';
									},
									padding: [0, -130, 25, -130],
									rich: {
										color: '#333',
										icon: {
											fontSize: 16
										},
										name: {
											fontSize: 14,
											padding: [0, 5, 0, 5],
											color: '#666666'
										},
										percent: {
											color: '#333',
											padding: [0, 5, 0, 0]
										},
										value: {
											fontSize: 16,
											fontWeight: 'bold',
											color: '#333333'
										}
									}
								}
							}
						}
					]
				};

				myChart.setOption(option);
				window.addEventListener('resize', function() {
					myChart.resize();
				});
			},
			// 绘制水果产地分布地图
			create_map() {
				const myChart = this.$echarts.init(document.getElementById('create-map'));
				let areaFormatList = []; // 水果包含城市集
				// 统计查询出来的城市名
				let area_format_list = [];
				let area_format_mlist = [];
				// console.log(this.areaFormatUser); // 中国省市区数据
				// 遍历查询同场地的水果数量
				this.fruitData.forEach((item) => {
					for (let j = 0; j < this.areaFormatUser.length; j++) {
						if (item.city === this.areaFormatUser[j].ext_name) {
							// console.log(item)
						} else {
							for (let i = 0; i < this.areaFormatUser[j].childs.length; i++) {
								if (item.city === this.areaFormatUser[j].childs[i].ext_name) {
									// console.log(item)
									areaFormatList.push({
										city: this.areaFormatUser[j].ext_name,
										cnt: 1
									})
								}
							}
						}
					}
				});
				// console.log(areaFormatList);
				// 统计同地区的商品数
				let newList = [...new Set(areaFormatList.map(i => i.city))];
				newList.forEach((i) => {
					area_format_list.push(areaFormatList.filter(t => t.city === i));
				});
				area_format_list.forEach((item, index) => {
					area_format_mlist.push({
						name: newList[index],
						value: item.length
					})
				});
				// console.log(area_format_mlist);

				const option = {
					background: '',
					tooltip: {
						show: true,
						formatter: function(e) {
							return 0 == e.value ? e.name + '：暂未在该地区进货水果' : e.seriesName + '\n' + e.name + '：' + e
								.value;
						}
					},
					visualMap: {
						min: 0,
						max: 1000,
						left: 10,
						bottom: 40,
						showLabel: !0,
						text: ['高', '低'],
						pieces: [{
								gt: 100,
								label: '> 100',
								color: '#7f1100'
							},
							{
								gte: 10,
								lte: 100,
								label: '10 - 100',
								color: '#ff5428'
							},
							{
								gte: 1,
								lt: 10,
								label: '1 - 9',
								color: '#ff8c71'
							},
							{
								gt: 0,
								lt: 1,
								label: '0 - 1',
								color: '#ffd768'
							},
							{
								value: 0,
								color: '#ffffff'
							}
						],
						show: false
					},
					geo: {
						map: 'china',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 2
						},
						zoom: 1,
						top: 60,
						label: {
							normal: {
								show: !0,
								fontSize: '14',
								color: '#fff'
							}
						},
						itemStyle: {
							normal: {
							    areaColor: "rgba(43, 196, 243, 0.42)",
							    borderColor: "rgba(43, 196, 243, 1)",
								borderWidth: 1
							},
							emphasis: {
								areaColor: "#2B91B7"
							}
						}
						// itemStyle: {
						// 	normal: {
						// 		// 地图阴影
						// 		shadowBlur: 30,
						// 		shadowColor: 'rgba(0, 0, 0, 0.2)',
						// 		borderColor: 'rgba(0, 0, 0, 0.2)'
						// 	},
						// 	emphasis: {
						// 		areaColor: '#f2d5ad',
						// 		shadowOffsetX: 0,
						// 		shadowOffsetY: 0,
						// 		borderWidth: 0
						// 	}
						// }
					},
					series: [{
						name: '水果产地',
						type: 'map',
						geoIndex: 0,
						data: area_format_mlist
					}]
				};

				myChart.setOption(option);
				window.addEventListener('resize', function() {
					myChart.resize();
				});
			},
			// 绘制水果订单折线图
			create_line_line(callback) {
				let _this = this;
				this.echart_line_line = this.$echarts.init(document.getElementById('create-line-line'));

				//对话框图片
				var uploadedDataURL = '/asset/get/s/data-1547533200844-7eBMgp66l.png';

				this.options_line_line = {
					grid: {
						top: "20%",
						left: "3%",
						right: "4%",
						bottom: "3%",
						show: true,
						borderColor: "#012f4a",
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						label: {
							show: true
						},
						formatter: function(params) {
							let str = '';

							str += params[0].data.name + '\n';
							params.forEach(item => {
								if (item.seriesName === '订单数') {
									str += item.seriesName + ' : ' + item.data.value + '' + '\n';
								} else if (item.seriesName === '支付数') {
									str += item.seriesName + ' : ' + item.data.value + '' + '\n';
								} else if (item.seriesName === '取消数') {
									str += item.seriesName + ' : ' + item.data.value + '' + '\n';
								}
							});
							return str;
						}
					},
					legend: {
						data: ['订单数', '支付数', '取消数'],
						top: '0%',
						// 修饰图例文字的颜色
						textStyle: {
							color: "#fff"
						}
					},
					xAxis: {
						type: "category",
						boundaryGap: false, //默认，坐标轴留白策略
						// 去除刻度
						axisTick: {
							show: false
						},
						// 修饰刻度标签的颜色
						axisLabel: {
							color: "rgba(255,255,255,.7)"
						},
						// 去除x坐标轴的颜色
						axisLine: {
							show: false
						},
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					},
					yAxis: {
						type: "value",
						// 去除刻度
						axisTick: {
							show: false
						},
						// 修饰刻度标签的颜色
						axisLabel: {
							color: "rgba(255,255,255,.7)"
						},
						// 修改y轴分割线的颜色
						splitLine: {
							lineStyle: {
								color: "#012f4a"
							}
						}
					},
					series: [{
							smooth: true, //是否平滑曲线显示
							name: '取消数',
							type: 'line',
							symbol: 'circle',
							symbolSize: 7,
							lineStyle: {
								color: '#FFB980',
								shadowBlur: 12,
								shadowColor: '#FFB980',
								shadowOffsetX: 1,
								shadowOffsetY: 1
							},
							itemStyle: {
								color: '#FFB980',
								borderWidth: 1,
								borderColor: '#FFB980'
							},
							data: [600, 1000, 800, 1300, 1250, 1400, 1500, 1400, 1250, 1400, 1500, 2000]
						},
						{
							smooth: true, //是否平滑曲线显示
							name: '订单数',
							type: 'line',
							symbol: 'circle',
							symbolSize: 7,
							lineStyle: {
								color: '#fd6b6c',
								shadowBlur: 12,
								shadowColor: '#fd6b6c',
								shadowOffsetX: 1,
								shadowOffsetY: 1
							},
							itemStyle: {
								color: '#fd6b6c',
								borderWidth: 1,
								borderColor: '#fd6b6c'
							},
							data: [600, 1000, 800, 1300, 1250, 1400, 1500, 1400, 1250, 1400, 1500, 2000]
						},
						{
							smooth: true, //是否平滑曲线显示
							name: '支付数',
							type: 'line',
							symbol: 'circle',
							symbolSize: 7,
							lineStyle: {
								color: '#00aaff',
								shadowBlur: 12,
								shadowColor: '#00aaff',
								shadowOffsetX: 1,
								shadowOffsetY: 1
							},
							itemStyle: {
								color: '#00aaff',
								borderWidth: 1,
								borderColor: '#00aaff'
							},
							data: [600, 1000, 800, 1300, 1250, 1400, 1500, 1400, 1250, 1400, 1500, 2000]
						}

					]
				};

				window.addEventListener('resize', () => {
					_this.echart_line_line.resize();
				});

				if (typeof callback === 'function') {
					callback();
				}
			},
			// 绘制水果订单毛利柱状图
			create_bar(callback) {
				let _this = this;
				this.echart_bar = this.$echarts.init(document.getElementById('create-bar'));

				//对话框图片
				var uploadedDataURL = '/asset/get/s/data-1547533200844-7eBMgp66l.png';

				this.options_bar = {
					color: ["#2f89cf"],
					grid: {
						left: "0%",
						top: "10px",
						right: "0%",
						bottom: "4%",
						containLabel: true
					},
					tooltip: {
						trigger: 'axis',
						label: {
							show: true
						},
						formatter: function(params) {
							let str = '';

							str += params[0].data.name + '\n';
							params.forEach(item => {
								if (item.seriesName === '毛利额') {
									str += item.seriesName + ' : ' + item.data.value + '' + '\n';
								}
							});
							return str;
						}
					},
					legend: {
						data: ['毛利额'],
						top: '0%',
						textStyle: {
							color: '#fff'
						}
					},
					xAxis: {
						type: "category",
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisTick: {
							show: true,
							// alignWithLabel: true
						},
						axisLabel: {
							textStyle: {
								color: "rgba(255,255,255,.6)",
								fontSize: "12"
							}
						},
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					},
					yAxis: {
						type: "value",
						axisLabel: {
							textStyle: {
								color: "rgba(255,255,255,.6)",
								fontSize: "12"
							}
						},
						axisLine: {
							lineStyle: {
								color: "rgba(255,255,255,.1)"
								// width: 1,
								// type: "solid"
							}
						},
						splitLine: {
							lineStyle: {
								color: "rgba(255,255,255,.1)"
							}
						}
					},
					series: [{
						smooth: true, //是否平滑曲线显示
						name: '毛利额',
						type: 'bar',
						symbol: 'circle',
						symbolSize: 7,
						itemStyle: {
							barBorderRadius: 5
						},
						data: [600, 1000, 800, 1300, 1250, 1400, 1500, 1400, 1250, 1400, 1500, 2000]
					}]
				};

				window.addEventListener('resize', () => {
					_this.echart_bar.resize();
				});

				if (typeof callback === 'function') {
					callback();
				}
			},
			// 绘制不同季节top5类水果销售情况 南丁格尔玫瑰图
			seasons_fruit_sales() {
				// console.log(this.classOptions);
				// console.log(this.orderList);
				let _this = this;
				const springChart = this.$echarts.init(document.getElementById('create-spring-pie'));
				const summerChart = this.$echarts.init(document.getElementById('create-summer-pie'));
				const autumnChart = this.$echarts.init(document.getElementById('create-autumn-pie'));
				const winterChart = this.$echarts.init(document.getElementById('create-winter-pie'));
				let springData = []; // 春季订单
				let summerData = []; // 夏季订单
				let autumnData = []; // 秋季订单
				let winterData = []; // 冬季订单
				// console.log(this.orderData)
				this.orderList.forEach((item) => {
					// 三个月期间，相同名称水果的订单数最多的
					var d = new Date(item.time);
					var month = parseInt(d.getMonth()) + 1;
					var year = d.getFullYear();
					var quarter = this.getQuarterStartMonth(month);
					if (item.name && quarter != 0) {
						// 取季度第一天
						var fristDay = new Date(year, quarter, 1);
						// 获取季度最后一天
						var lastDay = new Date(year, quarter + 2, 0);
						var beginWhereTheTime = year + "-" + this.formatDate(quarter) + "-" + this.formatDate(
							fristDay.getDate());
						var endWhereTheTime = year + "-" + this.formatDate(quarter + 2) + "-" + this.formatDate(
							lastDay.getDate());
						// 开始按季节分类
						if (item.time > '2021-01-01' && item.time < '2021-03-31') {
							// console.log('春季')
							this.classOptions.forEach((i) => {
								if (i.name === item.name) {
									springData.push(item)
								}
							});
						} else if (item.time > '2021-04-01' && item.time < '2021-06-31') {
							// console.log('夏季')
							this.classOptions.forEach((i) => {
								if (i.name === item.name) {
									summerData.push(item)
								}
							});
						} else if (item.time > '2021-07-01' && item.time < '2021-09-31') {
							// console.log('秋季')
							this.classOptions.forEach((i) => {
								if (i.name === item.name) {
									autumnData.push(item)
								}
							});
						} else if (item.time > '2021-10-01' && item.time < '2021-12-31') {
							// console.log('冬季')
							// 冬季同类水果的数据
							this.classOptions.forEach((i) => {
								if (i.name === item.name) {
									winterData.push(item)
								}
							});
						}
					}
				});
				// console.log(winterData)
				// console.log(springData)
				
				// 根据水果分类名称统计订单数
				let sptingOrderData = springData.reduce((obj, item) => {
					let find = obj.find(i => i.name === item.name);
					let count = {
						...item,
						frequency: 1
					};
					find ? (find.order_cnt += item.order_cnt, find.frequency++) : obj.push(count);
					return obj
				}, []);
				let summerOrderData = summerData.reduce((obj, item) => {
					let find = obj.find(i => i.name === item.name);
					let count = {
						...item,
						frequency: 1
					};
					find ? (find.order_cnt += item.order_cnt, find.frequency++) : obj.push(count);
					return obj
				}, []);
				let autumnOrderData = autumnData.reduce((obj, item) => {
					let find = obj.find(i => i.name === item.name);
					let count = {
						...item,
						frequency: 1
					};
					find ? (find.order_cnt += item.order_cnt, find.frequency++) : obj.push(count);
					return obj
				}, []);
				let winterOrderData = winterData.reduce((obj, item) => {
					let find = obj.find(i => i.name === item.name);
					let count = {
						...item,
						frequency: 1
					};
					find ? (find.order_cnt += item.order_cnt, find.frequency++) : obj.push(count);
					return obj
				}, []);
				// console.log(summerOrderData);
				// console.log(winterOrderData)

				// 对订单数进行排序,统计销售top5的水果种类
				sptingOrderData.sort((a, b) => {
					return b.order_cnt - a.order_cnt
				});
				summerOrderData.sort((a, b) => {
					return b.order_cnt - a.order_cnt
				});
				autumnOrderData.sort((a, b) => {
					return b.order_cnt - a.order_cnt
				});
				winterOrderData.sort((a, b) => {
					return b.order_cnt - a.order_cnt
				});

				// 整理成echats需要的字段
				let spring = sptingOrderData.map((item) => {
					return {
						name: item.name,
						value: item.order_cnt
					}
				});
				let summer = summerOrderData.map((item) => {
					return {
						name: item.name,
						value: item.order_cnt
					}
				});
				let autumn = autumnOrderData.map((item) => {
					return {
						name: item.name,
						value: item.order_cnt
					}
				});
				let winter = winterOrderData.map((item) => {
					return {
						name: item.name,
						value: item.order_cnt
					}
				});
				// console.log(winter)

				// 春季
				const options_spring_pie = {
					legend: {
						top: "90%",
						itemWidth: 10,
						itemHeight: 10,
						textStyle: {
							color: "rgba(255,255,255,.5)",
							fontSize: "12"
						}
					},
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					// 注意颜色写的位置
					color: [
						"#55aaff",
						"#60cda0",
						"#ed8884",
						"#ff9f7f",
						"#0096ff",
						"#9fe6b8",
						"#32c5e9",
						"#1d9dff"
					],
					series: [{
						name: "点位统计",
						type: "pie",
						// 如果radius是百分比则必须加引号
						radius: ["10%", "70%"],
						center: ["50%", "42%"],
						roseType: "radius",
						data: spring,
						// 修饰饼形图文字相关的样式 label对象
						label: {
							fontSize: 10
						},
						// 修饰引导线样式
						labelLine: {
							// 连接到图形的线长度
							length: 10,
							// 连接到文字的线长度
							length2: 10
						}
					}]
				};
				// 夏季
				const options_summer_pie = {
					legend: {
						top: "90%",
						itemWidth: 10,
						itemHeight: 10,
						textStyle: {
							color: "rgba(255,255,255,.5)",
							fontSize: "12"
						}
					},
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					// 注意颜色写的位置
					color: [
						"#55aaff",
						"#60cda0",
						"#ed8884",
						"#ff9f7f",
						"#0096ff",
						"#9fe6b8",
						"#32c5e9",
						"#1d9dff"
					],
					series: [{
						name: "点位统计",
						type: "pie",
						// 如果radius是百分比则必须加引号
						radius: ["10%", "70%"],
						center: ["50%", "42%"],
						roseType: "radius",
						data: summer,
						// 修饰饼形图文字相关的样式 label对象
						label: {
							fontSize: 10
						},
						// 修饰引导线样式
						labelLine: {
							// 连接到图形的线长度
							length: 10,
							// 连接到文字的线长度
							length2: 10
						}
					}]
				};
				// 秋季
				const options_autumn_pie = {
					legend: {
						top: "90%",
						itemWidth: 10,
						itemHeight: 10,
						textStyle: {
							color: "rgba(255,255,255,.5)",
							fontSize: "12"
						}
					},
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					// 注意颜色写的位置
					color: [
						"#55aaff",
						"#60cda0",
						"#ed8884",
						"#ff9f7f",
						"#0096ff",
						"#9fe6b8",
						"#32c5e9",
						"#1d9dff"
					],
					series: [{
						name: "点位统计",
						type: "pie",
						// 如果radius是百分比则必须加引号
						radius: ["10%", "70%"],
						center: ["50%", "42%"],
						roseType: "radius",
						data: autumn,
						// 修饰饼形图文字相关的样式 label对象
						label: {
							fontSize: 10
						},
						// 修饰引导线样式
						labelLine: {
							// 连接到图形的线长度
							length: 10,
							// 连接到文字的线长度
							length2: 10
						}
					}]
				};
				// 冬季
				const options_winter_pie = {
					legend: {
						top: "90%",
						itemWidth: 10,
						itemHeight: 10,
						textStyle: {
							color: "rgba(255,255,255,.5)",
							fontSize: "12"
						}
					},
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					// 注意颜色写的位置
					color: [
						"#55aaff",
						"#60cda0",
						"#ed8884",
						"#ff9f7f",
						"#0096ff",
						"#9fe6b8",
						"#32c5e9",
						"#1d9dff"
					],
					series: [{
						name: "点位统计",
						type: "pie",
						// 如果radius是百分比则必须加引号
						radius: ["10%", "70%"],
						center: ["50%", "42%"],
						roseType: "radius",
						data: winter,
						// 修饰饼形图文字相关的样式 label对象
						label: {
							fontSize: 10
						},
						// 修饰引导线样式
						labelLine: {
							// 连接到图形的线长度
							length: 10,
							// 连接到文字的线长度
							length2: 10
						}
					}]
				};

				// 春季
				springChart.setOption(options_spring_pie);
				window.addEventListener('resize', function() {
					springChart.resize();
				});
				// 夏季
				summerChart.setOption(options_summer_pie);
				window.addEventListener('resize', function() {
					summerChart.resize();
				})
				// 秋季
				autumnChart.setOption(options_autumn_pie);
				window.addEventListener('resize', function() {
					autumnChart.resize();
				});
				// 冬季
				winterChart.setOption(options_winter_pie);
				window.addEventListener('resize', function() {
					winterChart.resize();
				});
			},

			//格式化月和日为MM、dd
			formatDate(value) {
				if (value < 10) {
					value = "0" + value;
				}
				return value;
			},
			//获取当前月所在季度的开始月
			getQuarterStartMonth(month) {
				var quarterStartMonth = 0;
				if (month < 4) {
					quarterStartMonth = 1;
				}
				if (3 < month && month < 7) {
					quarterStartMonth = 4;
				}
				if (6 < month && month < 10) {
					quarterStartMonth = 7;
				}
				if (month > 9) {
					quarterStartMonth = 10;
				}
				return quarterStartMonth;
			},
			day() {
				this.days = '日';

				// console.log(this.orderList);

				this.options_line_line.xAxis.data = [];
				this.options_line_line.series[0].data = []; // 取消数
				this.options_line_line.series[1].data = []; // 订单数
				this.options_line_line.series[2].data = []; // 支付数

				let today = new Date();
				// 近一个月订单数
				for (let i = 30; i > -1; i--) {
					today = new Date();
					today.setTime(today.getTime() - 1000 * 60 * 60 * 24 * i);
					this.options_line_line.series[0].data.push({
						value: 0,
						name: today.format('yyyy年MM月dd日')
					});
					this.options_line_line.series[1].data.push({
						value: 0,
						name: today.format('yyyy年MM月dd日')
					});
					this.options_line_line.series[2].data.push({
						value: 0,
						name: today.format('yyyy年MM月dd日')
					});
					this.options_line_line.xAxis.data.push({
						value: today.format('dd'),
						time: today.format('yyyy-MM-dd')
					});
				}
				this.options_line_line.xAxis.data.forEach((x, i) => {
					let data = this.orderList.find(d => d.time.split(' ')[0] == x.time);
					if (data) {
						this.options_line_line.series[0].data[i].value = data.cancel_cnt;
						this.options_line_line.series[1].data[i].value = data.order_cnt;
						this.options_line_line.series[2].data[i].value = data.pay_cnt;
					}
				});
				this.echart_line_line.setOption(this.options_line_line);

			},
			month() {
				this.days = '月';
				// console.log(this.orderList);

				let monthData = [];
				let monthOrderData = []; // 每月订单数
				let monthPayData = []; // 每月支付数
				let monthCancelData = []; // 每月取消数

				// 按月统计订单数、支付数、取消数
				this.orderList.forEach((item) => {
					if (item.order_cnt) {
						monthOrderData.push({
							month: item.time.substring(0, 7),
							order_cnt: item.order_cnt,
						});
					}
					if (item.pay_cnt) {
						monthPayData.push({
							month: item.time.substring(0, 7),
							pay_cnt: item.pay_cnt,
						});
					}
					if (item.cancel_cnt) {
						monthCancelData.push({
							month: item.time.substring(0, 7),
							cancel_cnt: item.cancel_cnt,
						});
					}
				});

				// 统计每个月的订单数
				monthOrderData = monthOrderData.reduce((obj, item) => {
					let find = obj.find(i => i.month === item.month);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.order_cnt += item.order_cnt, find.frequency++) : obj.push(d);
					return obj
				}, []);

				// 统计每个月的支付数
				monthPayData = monthPayData.reduce((obj, item) => {
					let find = obj.find(i => i.month === item.month);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.pay_cnt += item.pay_cnt, find.frequency++) : obj.push(d);
					return obj
				}, []);

				// 统计每个月的取消数
				monthCancelData = monthCancelData.reduce((obj, item) => {
					let find = obj.find(i => i.month === item.month);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.cancel_cnt += item.cancel_cnt, find.frequency++) : obj.push(d);
					return obj
				}, []);

				// console.log(monthOrderData);
				// console.log(monthPayData);
				// console.log(monthCancelData);

				// 合并同月的订单数、字符数、取消数
				monthOrderData.forEach((item) => {
					monthPayData.forEach((i) => {
						if (i.month === item.month) {
							item.pay_cnt = i.pay_cnt
						} else {
							item.pay_cnt = 0
						}
					});
					monthCancelData.forEach((i) => {
						if (i.month === item.month) {
							item.cancel_cnt = i.cancel_cnt
						} else {
							item.cancel_cnt = 0
						}
					});
				});
				// console.log(monthOrderData)

				this.options_line_line.xAxis.data = [];
				this.options_line_line.series[0].data = []; // 取消数
				this.options_line_line.series[1].data = []; // 订单数
				this.options_line_line.series[2].data = []; // 支付数

				let today = new Date();
				for (let i = 12; i > -1; i--) {
					today = new Date();
					today.setMonth(today.getMonth() - i);
					this.options_line_line.series[0].data.push({
						value: 0,
						name: today.format('yyyy年MM月')
					});
					this.options_line_line.series[1].data.push({
						value: 0,
						name: today.format('yyyy年MM月')
					});
					this.options_line_line.series[2].data.push({
						value: 0,
						name: today.format('yyyy年MM月')
					});
					this.options_line_line.xAxis.data.push({
						value: today.format('yyyy-MM'),
						month: today.format('yyyy-MM')
					});
				}

				this.options_line_line.xAxis.data.forEach((x, i) => {
					let data = monthOrderData.find(d => d.month.split(' ')[0] == x.month);
					if (data) {
						this.options_line_line.series[0].data[i].value = data.cancel_cnt;
						this.options_line_line.series[1].data[i].value = data.order_cnt;
						this.options_line_line.series[2].data[i].value = data.pay_cnt;
					}
				});
				this.echart_line_line.setOption(this.options_line_line);

			},
			year() {
				this.days = '年';
				// console.log(this.orderList);

				let yearData = [];
				let yearOrderData = []; // 每年订单数
				let yearPayData = []; // 每年支付数
				let yearCancelData = []; // 每年取消数

				// 按年统计订单数、支付数、取消数
				this.orderList.forEach((item) => {
					if (item.order_cnt) {
						yearOrderData.push({
							year: item.time.substring(0, 4),
							order_cnt: item.order_cnt,
						});
					}
					if (item.pay_cnt) {
						yearPayData.push({
							year: item.time.substring(0, 4),
							pay_cnt: item.pay_cnt,
						});
					}
					if (item.cancel_cnt) {
						yearCancelData.push({
							year: item.time.substring(0, 4),
							cancel_cnt: item.cancel_cnt,
						});
					}
				});

				// 统计每年的订单数
				yearOrderData = yearOrderData.reduce((obj, item) => {
					let find = obj.find(i => i.year === item.year);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.order_cnt += item.order_cnt, find.frequency++) : obj.push(d);
					return obj
				}, []);

				// 统计每年的支付数
				yearPayData = yearPayData.reduce((obj, item) => {
					let find = obj.find(i => i.year === item.year);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.pay_cnt += item.pay_cnt, find.frequency++) : obj.push(d);
					return obj
				}, []);

				// 统计每年的取消数
				yearCancelData = yearCancelData.reduce((obj, item) => {
					let find = obj.find(i => i.year === item.year);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.cancel_cnt += item.cancel_cnt, find.frequency++) : obj.push(d);
					return obj
				}, []);

				// console.log(yearOrderData);
				// console.log(yearPayData);
				// console.log(yearCancelData);

				// 合并同年的订单数、字符数、取消数
				yearOrderData.forEach((item) => {
					yearPayData.forEach((i) => {
						if (i.year === item.year) {
							item.pay_cnt = i.pay_cnt
						} else {
							item.pay_cnt = 0
						}
					});
					yearCancelData.forEach((i) => {
						if (i.year === item.year) {
							item.cancel_cnt = i.cancel_cnt
						} else {
							item.cancel_cnt = 0
						}
					});
				});
				// console.log(yearOrderData)

				this.options_line_line.xAxis.data = [];
				this.options_line_line.series[0].data = []; // 取消数
				this.options_line_line.series[1].data = []; // 订单数
				this.options_line_line.series[2].data = []; // 支付数

				//获取系统当前时间
				let curDate = (new Date()).getTime();
				for (let i = 3; i > -2; i--) {
					curDate = (new Date()).getTime();
					// // 将4年的时间单位换算成毫秒
					let fourYearsTime = (365 * i + 366) * 24 * 60 * 60 * 1000;
					// //用当前时间-4年时间，得到4年前当前时间
					let result = curDate - fourYearsTime;
					let resultDate = new Date(result);

					this.options_line_line.series[0].data.push({
						value: 0,
						name: resultDate.format('yyyy年')
					});
					this.options_line_line.series[1].data.push({
						value: 0,
						name: resultDate.format('yyyy年')
					});
					this.options_line_line.series[2].data.push({
						value: 0,
						name: resultDate.format('yyyy年')
					});
					this.options_line_line.xAxis.data.push({
						value: resultDate.format('yyyy'),
						year: resultDate.format('yyyy')
					});
				}

				this.options_line_line.xAxis.data.forEach((x, i) => {
					let data = yearOrderData.find(d => d.year.split(' ')[0] == x.year);
					if (data) {
						this.options_line_line.series[0].data[i].value = data.cancel_cnt;
						this.options_line_line.series[1].data[i].value = data.order_cnt;
						this.options_line_line.series[2].data[i].value = data.pay_cnt;
					}
				});
				this.echart_line_line.setOption(this.options_line_line);
			},
			dayBar() {
				this.daysBar = '日';

				// 统计每日销售总毛利
				let dayProfitData = this.profitList.reduce((obj, item) => {
					let find = obj.find(i => i.time === item.time);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.profit += item.profit, find.frequency++) : obj.push(d);
					return obj
				}, []);

				// console.log(dayProfitData);

				this.options_bar.xAxis.data = [];
				this.options_bar.series[0].data = []; // 每日毛利额

				let today = new Date();
				// 近一个月订单数
				for (let i = 30; i > -1; i--) {
					today = new Date();
					today.setTime(today.getTime() - 1000 * 60 * 60 * 24 * i);
					this.options_bar.series[0].data.push({
						value: 0,
						name: today.format('yyyy年MM月dd日')
					});
					this.options_bar.xAxis.data.push({
						value: today.format('dd'),
						time: today.format('yyyy-MM-dd')
					});
				}
				this.options_bar.xAxis.data.forEach((x, i) => {
					let data = dayProfitData.find(d => d.time.split(' ')[0] == x.time);
					if (data) {
						this.options_bar.series[0].data[i].value = (parseFloat(data.profit) / 100).toFixed(2);
						// this.options_bar.series[0].data[i].value = data.profit;
					}
				});
				this.echart_bar.setOption(this.options_bar);

			},
			monthBar() {
				this.daysBar = '月';

				let monthProfitData = []; // 每月毛利额
				// console.log(this.profitList)
				// 按月统计毛利额
				this.profitList.forEach((item) => {
					if (item.profit) {
						monthProfitData.push({
							month: item.time.substring(0, 7),
							profit: item.profit,
						});
					}
				});
				// console.log(monthProfitData)
				// 统计每个月的订单数
				monthProfitData = monthProfitData.reduce((obj, item) => {
					let find = obj.find(i => i.month === item.month);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.profit = (parseFloat(find.profit) + parseFloat(item.profit)).toFixed(2), find
						.frequency++) : obj.push(d);
					return obj
				}, []);

				console.log(monthProfitData);


				this.options_bar.xAxis.data = [];
				this.options_bar.series[0].data = []; // 毛利额

				let today = new Date();
				for (let i = 12; i > -1; i--) {
					today = new Date();
					today.setMonth(today.getMonth() - i);
					this.options_bar.series[0].data.push({
						value: 0,
						name: today.format('yyyy年MM月')
					});
					this.options_bar.xAxis.data.push({
						value: today.format('yyyy-MM'),
						month: today.format('yyyy-MM')
					});
				}

				this.options_bar.xAxis.data.forEach((x, i) => {
					let data = monthProfitData.find(d => d.month.split(' ')[0] == x.month);
					if (data) {
						this.options_bar.series[0].data[i].value = (data.profit / 100).toFixed(2);
					}
				});
				this.echart_bar.setOption(this.options_bar);

			},
			yearBar() {
				this.daysBar = '年';
				// console.log(this.profitList);

				let yearOrderData = []; // 每年毛利额

				// 按年统计毛利额
				this.profitList.forEach((item) => {
					if (item.profit) {
						yearOrderData.push({
							year: item.time.substring(0, 4),
							profit: item.profit,
						});
					}
				});
				// console.log(yearOrderData);
				// 统计每年的毛利额
				yearOrderData = yearOrderData.reduce((obj, item) => {
					let find = obj.find(i => i.year === item.year);
					let d = {
						...item,
						frequency: 1
					};
					find ? (find.profit = (parseFloat(find.profit) + parseFloat(item.profit)).toFixed(2), find
						.frequency++) : obj.push(d);
					return obj
				}, []);

				// console.log(yearOrderData);

				this.options_bar.xAxis.data = [];
				this.options_bar.series[0].data = []; // 取消数

				//获取系统当前时间
				let curDate = (new Date()).getTime();
				for (let i = 3; i > -2; i--) {
					curDate = (new Date()).getTime();
					// // 将4年的时间单位换算成毫秒
					let fourYearsTime = (365 * i + 366) * 24 * 60 * 60 * 1000;
					// //用当前时间-4年时间，得到4年前当前时间
					let result = curDate - fourYearsTime;
					let resultDate = new Date(result);

					this.options_bar.series[0].data.push({
						value: 0,
						name: resultDate.format('yyyy年')
					});
					this.options_bar.xAxis.data.push({
						value: resultDate.format('yyyy'),
						year: resultDate.format('yyyy')
					});
				}

				this.options_bar.xAxis.data.forEach((x, i) => {
					let data = yearOrderData.find(d => d.year.split(' ')[0] == x.year);
					if (data) {
						this.options_bar.series[0].data[i].value = (data.profit / 100).toFixed(2);
					}
				});
				this.echart_bar.setOption(this.options_bar);
			}

		},
		created() {
			this.member_sta = {
				member_cnt: 246,
				member_cnt_7: 4,
				member_cnt_today: 0,
				member_cnt_yesterday: 10,
				order_cnt: 42,
				pay_cnt: 20
			};

			this.order_sta = {
				order_cnt: 162,
				pay_cnt: 52,
				pay_money: 0.6,
				refund_cnt: 4
			};
			this.getFruitCategoryInfo(); // 获取水果分类
			this.getFruitInfo(); // 获取水果信息
			this.getOrderInfo(); // 获取订单信息
			// this.get_visit_stats();
			// this.get_sale_stats();
		}
	};
</script>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	li {
		list-style: none;
	}

	@font-face {
		font-family: electronicFont;
		src: url(@/static/font/DS-DIGIT.TTF);
	}

	.box {
		height: 99%;
		font-family: Arial, Helvetica, sans-serif;
		margin: 0;
		padding: 0;
		background: url(@/static/bi/bg.jpg) no-repeat #000;
		background-size: cover;
		line-height: 1.15;
	}

	.headerbox {
		position: relative;
		height: 1.25rem;
		background: url(@/static/bi/head_bg.png) no-repeat top center;
		background-size: 100%;
	}

	.headerbox h1 {
		color: #fff;
		text-align: center;
	}

	.headerbox .showTime {
		position: absolute;
		top: 0;
		right: 3.75rem;
		line-height: 9.375rem;
		font-size: 2.5rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.mainbox {
		min-width: 1024px;
		max-width: 1920px;
		padding: 1.25rem 1.25rem 0;
		display: flex;
	}

	.mainbox .column {
		flex: 3;
	}

	.mainbox .column:nth-child(2) {
		flex: 5;
		margin: 0 1.25rem 1.875rem;
		overflow: hidden;
	}

	.panel {
		position: relative;
		height: 18.8rem;
		border: 1px solid rgba(25, 186, 139, 0.17);
		background: rgba(255, 255, 255, 0.04) url(@/static/bi/line1.png);
		padding: 0 0.1875rem 0.5rem;
		margin-bottom: 0.1875rem;
	}

	.panel::before {
		position: absolute;
		top: 0;
		left: 0;
		content: "";
		width: 10px;
		height: 10px;
		border-top: 2px solid #02a6b5;
		border-left: 2px solid #02a6b5;
	}

	.panel::after {
		position: absolute;
		top: 0;
		right: 0;
		content: "";
		width: 10px;
		height: 10px;
		border-top: 2px solid #02a6b5;
		border-right: 2px solid #02a6b5;
	}

	.panel .panel-footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
	}

	.panel .panel-footer::before {
		position: absolute;
		bottom: 0;
		left: 0;
		content: "";
		width: 10px;
		height: 10px;
		border-bottom: 2px solid #02a6b5;
		border-left: 2px solid #02a6b5;
	}

	.panel .panel-footer::after {
		position: absolute;
		bottom: 0;
		right: 0;
		content: "";
		width: 10px;
		height: 10px;
		border-bottom: 2px solid #02a6b5;
		border-right: 2px solid #02a6b5;
	}

	.panel h3 {
		color: #fff;
		font-weight: 400;
		padding-left: 13px;
		padding-top: 2px;
	}

	.panel h3::after {
		background: #FFFFFF;
		left: 5px;
	}

	.panel h3 a {
		margin: 0 1.875rem;
		color: #fff;
		/* text-decoration: underline; */
	}

	.panel .chart {
		height: 15rem;
	}

	.no {
		background: rgba(101, 132, 226, 0.1);
		padding: 0.875rem;
	}

	.no .no-hd {
		height: 5rem;
		position: relative;
		border: 1px solid rgba(25, 186, 139, 0.17);
	}

	.no .no-hd::before {
		content: "";
		position: absolute;
		width: 30px;
		height: 10px;
		border-top: 2px solid #02a6b5;
		border-left: 2px solid #02a6b5;
		top: 0;
		left: 0;
	}

	.no .no-hd::after {
		content: "";
		position: absolute;
		width: 30px;
		height: 10px;
		border-bottom: 2px solid #02a6b5;
		border-right: 2px solid #02a6b5;
		right: 0;
		bottom: 0;
	}

	.no .no-hd ul {
		display: flex;
	}

	.no .no-hd ul li {
		position: relative;
		flex: 1;
		text-align: center;
		height: 1.5rem;
		line-height: 5rem;
		font-size: 5rem;
		color: #ffeb7b;
		padding: 0.05rem 0;
		font-family: electronicFont;
		font-weight: bold;
	}

	.no .no-hd ul li:first-child::after {
		content: "";
		position: absolute;
		height: 50%;
		width: 1px;
		background: rgba(255, 255, 255, 0.2);
		right: 0;
		top: 25%;
	}

	.no .no-bd {
		height: 3rem;
	}

	.no .no-bd ul {
		display: flex;
	}

	.no .no-bd ul li {
		flex: 1;
		height: 5rem;
		line-height: 4rem;
		text-align: center;
		font-size: 2.25rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.map {
		position: relative;
		height: 100%;
	}

	.map .chart {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		height: 100%;
		width: 100%;
	}

	.map .map1,
	.map .map2,
	.map .map3 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 34.75rem;
		height: 34.75rem;
		background: url(@/static/bi/map.png) no-repeat;
		background-size: 100% 100%;
		opacity: 0.3;
	}

	.map .map2 {
		width: 40.375rem;
		height: 40.375rem;
		background-image: url(@/static/bi/lbx.png);
		opacity: 0.6;
		animation: rotate 15s linear infinite;
		z-index: 2;
	}

	.map .map3 {
		width: 38rem;
		height: 38rem;
		background-image: url(@/static/bi/jt.png);
		animation: rotate1 10s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}

		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	@keyframes rotate1 {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}

		to {
			transform: translate(-50%, -50%) rotate(-360deg);
		}
	}

	@media screen and (max-width: 1024px) {
		html {
			font-size: 42px !important;
		}
	}

	@media screen and (min-width: 1920) {
		html {
			font-size: 80px !important;
		}
	}
</style>
