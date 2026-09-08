<template>
	<view class="mysignup">
		<!-- 分类切换区域 -->
		<view class="tab-scroll">
			<view class="tab-list">
				<view class="tab" v-for="item in typeList" :key="item.id" :class="{active : status == item.id}"
					@click="tabChange(item.id)">
					{{item.name}}
					<text class="iconfont icon-weixiao" v-show="status == item.id"></text>
				</view>
			</view>
		</view>

		<!-- 列表数据 -->
		<view class="list">
			<view class="item" v-for="item in list" :key="item.orderId">
				<!-- 订单号 分配状态 -->
				<view class="item-orderid">
					<view class="orderid-num">{{item.orderNo}}</view>
					<view class="order-typeyes" v-if="item.status > 4">已分配账号</view>
					<view class="order-typeno" v-else>等待分配</view>
				</view>
				<view class="line"></view>
				<!-- 商品数据列表 -->
				<view class="item-detail" v-for="itm in item.itemList" :key="itm.courseId">
					<view class="item-titbox">
						<text class="item-type" :class="itm.bg">{{itm.subjectName}}</text>
						<text class="item-title">{{itm.courseTitle}}</text>
					</view>
					<view class="item-time ovHide">{{itm.desc}}</view>
					<view class="item-address">
						<text class="iconfont icon-touzijigou"></text>
						<text class="adres-tex ovHide">{{item.placeName}}</text>
					</view>
					<view class="item-address">
						<text class="iconfont icon-fenxiangsheding-dizhi"></text>
						<text class="adres-tex ovHide">{{itm.campusAddress}}</text>
					</view>
					<view class="item-flex">
						<view class="item-name">
							<text class="iconfont icon-navicon-grkh"></text>{{itm.teacherName}}
						</view>
					</view>
					<view class="line"></view>
					<view class="item-end">
						<view class="end-left">
							<view class="end-is">共{{itm.sessionCount}}次课</view>
							<!-- <view class="end-num">共8次课</view> -->
						</view>
						<view class="end-right">
							<view class="end-money">
								<!-- <text class="youhui">优惠价</text> -->
								<text class="danwei">¥</text>
								<text class="price">{{itm.price}}</text>
							</view>
							<!-- 	<view class="end-yuanjia">
								¥2980
							</view> -->
						</view>
					</view>
				</view>
				<view class="line"></view>
				<!-- 订单操作按钮 -->
				<view class="order-meun">
					<view class="order-time">{{item.payTime}}</view>
					<view class="order-btns">
						<view class="lookdetail" @click="to(`/pages/index/signUpSuccess?orderId=${item.orderId}`)">查看详情</view>
						<view class="lookaccount" v-if="item.status > 4" @click="open(item)">查看账号</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 		加载提示 -->
		<view class="loading" v-if="showLoading">
			<text style="--i:1">加</text>
			<text style="--i:2">载</text>
			<text style="--i:3">中</text>
			<text style="--i:4">.</text>
			<text style="--i:5">.</text>
			<text style="--i:6">.</text>
		</view>
		<view class="end" v-if="showNone">暂无更多...</view>
		<!-- 查看账号 -->
		<accounMask :accMaskBool="accMaskBool" :item="item" @accWatch="accWatch" />

		<!--  底部   -->
		<tabBar :tabCur="1" />
	</view>
</template>
<script>
	import {
		loaded,
		loading,
		toast,
		redirectTo,
		navigateTo
	} from '@/utils/index.js';
	import {
		img_PATH,
		LocalStorage
	} from '@/config';
	import {
		queryOrderList,
		getUserInfo
	} from '@/api/index.js'
	import tabBar from '@/components/tabbar.vue';
	import accounMask from '@/components/accmask.vue';
	export default {
		data() {
			return {
				imgurl: img_PATH,
				CustomBar: this.CustomBar,
				gologin: false,
				showLoading: false,
				showNone: false,
				accMaskBool: false,
				page: 1,
				limit: 20,
				status: 1,
				item: {},
				typeList: [{
						id: 1,
						name: '全部'
					},
					{
						id: 2,
						name: '待分配'
					},
					{
						id: 3,
						name: '已分配'
					}
				],
				list: []
			};
		},
		computed: {
			token() {
				return this.$store.state[LocalStorage.token]
			}
		},
		components: {
			tabBar,
			accounMask
		},
		onLoad(options) {

		},
		onShow() {
			this.isLogin()
		},
		mounted() {

		},
		created() {
			this.isLogin()
		},
		// 触底的事件
		onReachBottom() {
			this.getList()
		},
		methods: {
			// 判断是否登录
			async isLogin() {
				let _res = await getUserInfo();
				if (_res.code == 503) {
					this.gologin = true
					this.showNone = true
				} else {
					this.page = 1
					this.list = []
					this.getList()
				}
			},


			tabChange(id) {
				this.status = id
				this.page = 1
				this.list = []
				this.getList()
			},

			accWatch() {
				this.accMaskBool = false
			},

			open(item) {
				let itemList = item.itemList
				let ary = []
				itemList.map(itm => {
					ary.push(itm.courseTitle)
				})
				this.item = {
					account: item.account,
					password: item.password,
					name: ary.join('、')
				}
				this.accMaskBool = true
			},

			async getList() {
				this.showNone = false
				this.showLoading = true
				let _data = await queryOrderList(this.status, this.page, this.limit);
				if (_data.code == 200) {
					if (_data.data.length === 0) {
						this.showLoading = false
						this.showNone = true
						return
					}
					this.page++
					this.showLoading = false
					this.list = [...this.list, ..._data.data]
				}
			},
			to(path) {
				navigateTo(path)
			},
		},

	}
</script>

<style scoped lang="scss">
	.mysignup {
		min-height: 100vh;
		width: 100%;
		padding: 30rpx 25rpx;
		padding-top: 130rpx;
		padding-bottom: 200rpx;
		background-color: #f7f7f7;

		.item {
			width: 100%;
			background-color: #ffffff;
			border-radius: 20rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;


			.order-meun {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.order-time {
					font-size: 26rpx;
					color: #a9adbc;
				}

				.order-btns {
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.lookaccount {
						width: 154rpx;
						height: 50rpx;
						background-image: linear-gradient(90deg,
								#61b7ff 0%,
								#2c90f7 100%);
						border-radius: 6rpx;
						text-align: center;
						line-height: 50rpx;
						font-size: 28rpx;
						color: #ffffff;
						margin-left: 15rpx;
					}

					.lookdetail {
						width: 154rpx;
						height: 50rpx;
						background-color: #ffffff;
						border-radius: 6rpx;
						border: solid 1rpx #c8c8c8;
						text-align: center;
						line-height: 48rpx;
						font-size: 28rpx;
						color: #67686f;
					}
				}
			}

			.item-orderid {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.order-typeno {
					font-size: 28rpx;
					color: #fc761e;
				}

				.order-typeyes {
					font-size: 28rpx;
					color: #1f89f6;
				}

				.orderid-num {
					font-size: 26rpx;
					color: #a9adbc;
				}
			}

			.item-detail {
				width: 100%;
				padding: 25rpx;
				background-color: #f8f9fc;
				border-radius: 13rpx;
				margin-bottom: 20rpx;
				padding-bottom: 15rpx;

			}

			&.active {
				border: solid 1rpx #2089f6;
			}

			.item-end {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.end-right {
					width: 50%;

					.end-yuanjia {
						font-size: 28rpx;
						color: #b6b9c0;
						text-decoration-line: line-through;
						text-align: right;
					}

					.end-money {
						display: flex;
						justify-content: flex-end;
						align-items: center;

						.youhui {
							font-size: 24rpx;
							color: #fc751d;
							padding-top: 6rpx;
						}

						.price {
							font-size: 44rpx;
							color: #e74e3e;
							font-weight: bold;
						}

						.danwei {
							font-size: 26rpx;
							color: #e74e3e;
							margin: 0 4rpx;
							padding-top: 8rpx;
						}
					}
				}

				.end-left {
					width: 50%;

					.end-num {
						font-size: 26rpx;
						color: #595d69;
						// padding-top: 6rpx;
					}

					.end-is {
						font-size: 30rpx;
						color: #2b2e48;
						font-weight: bold;
					}
				}
			}

			.line {
				width: 100%;
				height: 1rpx;
				border-bottom: solid 1rpx #dedfe1;
				margin: 15rpx 0;
				margin-bottom: 25rpx;
			}

			.item-flex {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 6rpx;

				.item-select {
					width: 44rpx;
					height: 44rpx;
					background-image: linear-gradient(0deg,
							#1f88f6 0%,
							#63b8ff 100%);
					border-radius: 22rpx;
					text-align: center;
					line-height: 48rpx;

					.icon-duigou {
						color: #ffffff;
						font-size: 28rpx;
					}
				}

				.item-name {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size: 26rpx;
					color: #888c99;

					.icon-navicon-grkh {
						color: #888c99;
						font-size: 30rpx;
						margin-right: 10rpx;
					}
				}
			}

			.item-address {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-top: 15rpx;

				.adres-tex {
					flex: 1;
					width: 0;
					font-size: 26rpx;
					color: #888c99;
				}

				.icon-fenxiangsheding-dizhi {
					color: #888c99;
					font-size: 30rpx;
					margin-right: 10rpx;
				}
			}

			.item-time {
				width: 100%;
				font-size: 26rpx;
				color: #888c99;
				margin-top: 20rpx;
			}

			.item-titbox {
				width: 100%;
				display: flex;
				justify-content: flex-start;

				.item-title {
					flex: 1;
					width: 0;
					font-size: 32rpx;
					color: #2b2e48;
					font-weight: bold;
				}

				.item-type {
					min-width: 78rpx;
					height: 36rpx;
					border-radius: 0rpx 10rpx 0rpx 10rpx;
					line-height: 36rpx;
					text-align: center;
					font-size: 24rpx;
					color: #ffffff;
					margin-right: 15rpx;
					margin-top: 4rpx;

					&.yingyu {
						background-image: linear-gradient(0deg,
								#1f89f6 0%,
								#63b8ff 100%);
					}

					&.shuxue {
						background-image: linear-gradient(0deg,
								#25c1da 0%,
								#45e4e7 100%);
					}

					&.yuwen {
						background-image: linear-gradient(0deg,
								#fc5f7f 0%,
								#fe999e 100%);
					}

					&.wuli {
						background-image: linear-gradient(0deg,
								#7a69f3 0%,
								#9c89f0 100%);
					}
				}
			}
		}

		.tab-scroll {
			width: 100%;
			overflow-x: auto;
			height: 100rpx;
			background-color: #ffffff;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1;
			padding: 0 40rpx;
			padding-top: 20rpx;

			.tab-list {
				width: max-content;
				display: flex;
				justify-content: flex-start;

				.tab {
					width: max-content;
					margin-right: 45rpx;
					font-size: 32rpx;
					color: #2b2e48;
					position: relative;
					display: flex;
					justify-content: flex-start;
					flex-direction: column;
					align-items: center;

					&.active {
						font-size: 36rpx;
						font-weight: bold;
						color: #1f89f6;
					}

					.icon-weixiao {
						font-size: 40rpx;
						color: #1f89f6;
						margin-top: -10rpx;
					}
				}
			}
		}


	}
</style>