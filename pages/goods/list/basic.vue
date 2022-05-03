<template>
	<div>
		<el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
			<div class="container add_edit">
				<h3 class="margin_b_20">基本信息</h3>
				<div>
					<el-form-item label="水果分类" prop="cid" ref="cid">
						<el-cascader
							class="sele"
							v-model="form.cid"
							:options="categoryOptions"
							ref="cascaderObj"
							:props="{ checkStrictly: true, emitPath: false, value: '_id', label: 'name' }"
						></el-cascader>
					</el-form-item>
					<el-form-item label="排序">
						<el-input v-model.number="form.sort" type="number" min="0"></el-input>
						<div class="remark_txt">数字越小，排名越靠前</div>
					</el-form-item>
					<el-form-item label="水果名称" prop="name" ref="name"><el-input placeholder="请输入水果名称" v-model="form.name"></el-input></el-form-item>
					<el-form-item label="推广词"><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="form.name_pw" placeholder="请输入推广词"></el-input></el-form-item>
				</div>
			</div>
			<div class="container add_edit">
				<h3 class="margin_b_20">水果信息</h3>
				<div>
					<el-form-item label="限时精选">
						<el-checkbox v-model.number="form.limited" :true-label="1" :false-label="0">显示</el-checkbox>
						<!-- <div class="remark_txt">此分类将决定水果信息显示在限时精选分类下</div> -->
					</el-form-item>
					<el-form-item label="热门推荐">
						<el-checkbox v-model.number="form.hot" :true-label="1" :false-label="0">显示</el-checkbox>
						<!-- <div class="remark_txt">此分类将决定水果信息显示在热门推荐分类下</div> -->
					</el-form-item>
					<!-- <el-form-item label="进货价" prop="price" ref="price" style="width: 54.5%;">
						<el-input v-model.number="form.price" type="number" min="0"></el-input>
						<el-form-item prop="quantity_type" ref="quantity_type" style="float: right;">
							<el-cascader
								class="sele"
								v-model="form.quantity_type"
								:options="quantityType"
								placeholder="请选择计量单位"
								ref="cascaderObj"
							></el-cascader>
						</el-form-item>
						<div class="remark_txt">单位为分，{{form.price}} 分 = {{form.price / 100}} 元</div>
					</el-form-item> -->
					<el-form-item label="进货价" prop="price" ref="price">
						<el-input v-model.number="form.price" type="number" min="0"></el-input>
						<div class="remark_txt">单位为分，{{form.price}} 分 = {{form.price / 100}} 元</div>
					</el-form-item>
					<el-form-item label="毛利率" prop="profit_margin" ref="profit_margin">
						<el-input v-model="form.profit_margin" ></el-input>
						<div class="remark_txt">毛利率{{form.profit_margin}} 决定着销售价格</div>
					</el-form-item>
					<el-form-item label="销售价" prop="market_price" ref="market_price">
						<el-input v-model.number="form.market_price" type="number" min="0"></el-input>
						<!-- <el-input v-model.number="form.price + (form.price * 0.4)" type="number" min="0"></el-input> -->
						<div class="remark_txt">单位为分，{{form.market_price}} 分 = {{form.market_price / 100}} 元</div>
						<!-- 售价 = 成本/（1-毛利率）-->
						<div class="remark_txt">销售价{{form.market_price}} = 进货价{{form.price}} / （1 - {{form.profit_margin}}) 元</div>
					</el-form-item>
					<el-form-item label="产地" prop="source_city" ref="source_city">
						<el-input v-model="form.source_city"></el-input>
					</el-form-item>
					<el-form-item label="限购量" prop="limit" ref="limit">
						<el-input v-model.number="form.limit" type="number" min="0"></el-input>
						<div class="remark_txt">0为不限购</div>
					</el-form-item>
					<el-form-item label="库存" prop="stock_num" ref="stock_num"><el-input v-model.number="form.stock_num" type="number" min="0"></el-input></el-form-item>
					<el-form-item label="已出售数">
						<el-input v-model.number="form.sale_cnt" type="number" min="0"></el-input>
						<el-checkbox class="w100" v-model.number="form.sale" :true-label="1" :false-label="0">显示</el-checkbox>
						<div class="remark_txt">勾选此选项将作虚拟销量</div>
					</el-form-item>
					<el-form-item label="已访问数">
						<el-input v-model.number="form.visit_cnt" type="number" min="0"></el-input>
						<el-checkbox class="w100" v-model.number="form.visit" :true-label="1" :false-label="0">显示</el-checkbox>
						<div class="remark_txt">勾选此选项将作访问销量</div>
					</el-form-item>
					<el-form-item label="已收藏数">
						<el-input v-model.number="form.collect_cnt" type="number" min="0"></el-input>
						<el-checkbox class="w100" v-model.number="form.collect" :true-label="1" :false-label="0">显示</el-checkbox>
						<div class="remark_txt">勾选此选项将作收藏销量</div>
					</el-form-item>
					<!-- <el-form-item label="已分享数">
						<el-input v-model.number="form.share_cnt" type="number" min="0"></el-input>
						<el-checkbox class="w100" v-model.number="form.share" :true-label="1" :false-label="0">显示</el-checkbox>
						<div class="remark_txt">勾选此选项将作分享销量</div>
					</el-form-item> -->
					<el-form-item label="下架时间" prop="sold_out_time" ref="sold_out_time">
						<el-date-picker
							v-model="form.sold_out_time"
							type="datetime"
							placeholder="下架时间"
							align="center"
							class="time"
							format="yyyy-MM-dd HH:mm:ss"
							value-format="yyyy-MM-dd HH:mm:ss"
							:picker-options="pickerOptions"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="状态">
						<el-radio-group v-model="form.state">
							<el-radio label="待审核">待审核</el-radio>
							<el-radio label="销售中">销售中</el-radio>
							<el-radio label="已下架">已下架</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			categoryOptions: [],
			goodsDatas: [],
			serveDatas: [],
			goodsTags: [],
			serveTags: [],
			form: {
				cid: '',
				cids: [],
				sort: 0,
				name: '',
				name_pw: '',
				source_city: '',
				limited: 0,
				hot: 0,
				tags: [],
				price: 0,
				profit_margin: 0.2,
				market_price: 0,
				limit: 0,
				stock_num: 0,
				sale_cnt: 0,
				sale: 0,
				visit_cnt: 0,
				visit: 0,
				collect_cnt: 0,
				collect: 0,
				share_cnt: 0,
				share: 0,
				sold_out_time: '',
				state: '待审核'
			},
			quantityType: [
				{ label: '斤', value: '斤'},
				{ label: '个', value: '个'},
				{ label: '件', value: '件'}
			],
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				}
			},
			rules: {
				cid: [
					{
						required: true,
						message: '请选择水果分类',
						trigger: 'change'
					}
				],
				name: [
					{
						required: true,
						message: '请输入水果名称',
						trigger: 'change'
					}
				],
				price: [
					{
						required: true,
						message: '请输入进货价，必须大于0',
						trigger: 'change'
					}
				],
				market_price: [
					{
						required: true,
						message: '请输入销售价，必须大于0',
						trigger: 'change'
					}
				],
				// source_city: [
				// 	{
				// 		required: true,
				// 		message: '请输入产地',
				// 		trigger: 'change'
				// 	}
				// ],
				stock_num: [
					{
						required: true,
						message: '请输入库存，必须大于0',
						trigger: 'change'
					}
				],
				limit: [
					{
						required: true,
						message: '请输入库存，必须大于0',
						trigger: 'change'
					}
				],
				sold_out_time: [
					{
						required: true,
						message: '请选择下架时间',
						trigger: 'change'
					}
				]
			}
		};
	},
	watch:{
		form: {
		    handler: function (value) {
				if (value.price && this.$route.query.tab != "编辑水果"){
					// 1. 售价 - 成本 = 毛利；
					// 2. 毛利率 = 毛利/售价；
					// 3. 售价 = 成本/（1-毛利率）
					value.market_price = (value.price / (1 - value.profit_margin)).toFixed(2); // 售价
					value.profit = value.market_price - value.price; // 毛利
				}
		    },
		    deep: true
		}
	},
	methods: {
		setChildren(res) {
			res.forEach(item => {
				if (item.children && item.children.length <= 0) {
					item.children = null;
					return;
				}
				
				this.setChildren(item.children);
			});
		},
		setBaseData(res) {
			this.setChildren(res[0].datas);
			this.categoryOptions = res[0].datas;
			
			this.goodsTags = res[1].datas.filter(x => x.type == '水果');
			this.serveTags = res[1].datas.filter(x => x.type == '服务');
		},
		submitData(callback) {
			this.$refs['ruleForm'].validate((valid, obj) => {
				this.$api.set_unvalidated_form_focus(this, obj);
				if (valid) {
					this.form.tags = [...this.goodsDatas, ...this.serveDatas];

					// let cascaderObj = this.$refs.cascaderObj.getCheckedNodes();
					// this.form.cids = cascaderObj[0].path;

					if (typeof callback === 'function') {
						callback(this.form, true);
					}
				} else {
					if (typeof callback === 'function') {
						callback(this.form, false);
					}
					return false;
				}
			});
		},
		getData(callback) {
			this.submitData(callback);
		},
		setData(data) {
			data.tags = data.tags || [];
			data.cids = data.cids || [];
			
			this.goodsDatas = data.tags.filter(x => this.goodsTags.find(t => t.name == x));
			this.serveDatas = data.tags.filter(x => this.serveTags.find(t => t.name == x));
			this.form.cid = data.cid;

			for (const key in this.form) {
				if (this.form.hasOwnProperty(key) && key != 'cid') {
					this.form[key] = data[key];
				}
			}
		}
	}
};
</script>

<style  ></style>
