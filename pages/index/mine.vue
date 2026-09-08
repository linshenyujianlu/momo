<template>
	<view class="mine">

		<!-- 未登录  -->
		<view class="nologin" v-if="gologin">
			<view class="tologin" @click="to('/pages/index/login')">
				去登录
			</view>
		</view>
		<!-- 个人信息 -->
		<view class="user-box" v-if="!gologin">
			<view class="user-head">
				<image :src="userInfo.picPath" mode="aspectFit"></image>
			</view>
			<view class="user-detail">
				<view class="user-name">{{userInfo.userName}}</view>
				<view class="user-phone">{{userInfo.loginCode}}</view>
			</view>
			<view class="user-btn" @click="to('/pages/index/userInfo')">设置</view>
		</view>

		<!-- 数量 -->
		<view class="num-box" v-if="!gologin">
			<view class="num-item">
				<view class="num">{{info.TOTALENROLLED}}</view>
				<view class="tex">总报名</view>
			</view>
			<view class="num-line"></view>
			<view class="num-item">
				<view class="num">{{info.ASSIGNEDCOUNT}}</view>
				<view class="tex">已分配账号</view>
			</view>
			<view class="num-line"></view>
			<view class="num-item">
				<view class="num">{{info.PENDINGASSIGNCOUNT}}</view>
				<view class="tex">待分配</view>
			</view>
		</view>

		<view class="meun" v-if="!gologin">
			<view class="meun-item" @click="to(`/pages/index/myActivity`)">
				<image src="/static/images/wodebaoming.png" mode="widthFix"></image>
				<view class="tit">我的活动</view>
				<text class="iconfont icon-right"></text>
			</view>
			<view class="meun-item" @click="to(`/pages/index/grade`)">
				<image src="/static/images/wodebaoming.png" mode="widthFix"></image>
				<view class="tit">我的选课单</view>
				<text class="iconfont icon-right"></text>
			</view>
			<view class="meun-item" @click="to(`/pages/index/accountList`)">
				<image src="/static/images/xuexizhanghao.png" mode="widthFix"></image>
				<view class="tit">学习账号管理</view>
				<text class="iconfont icon-right"></text>
			</view>
		</view>

		<view class="meun">
			<view class="meun-item" @click="lookAbout(1)">
				<image src="/static/images/guanyuwomen.png" mode="widthFix"></image>
				<view class="tit">关于我们</view>
				<text class="iconfont icon-right"></text>
			</view>
			<view class="meun-item" @click="lookAbout(2)">
				<image src="/static/images/lianxikefu.png" mode="widthFix"></image>
				<view class="tit">联系客服</view>
				<text class="iconfont icon-right"></text>
			</view>
		</view>

		<!-- 关于我们 联系客服 -->
		<aboutMask :aboutMaskBool="aboutMaskBool" :about="about" :type="type" @accWatch="accWatch" />

		<!--  底部   -->
		<tabBar :tabCur="2" />
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
		queryOrderSummary,
		getUserInfo,
		queryCustomerService
	} from '@/api/index.js'
	import tabBar from '@/components/tabbar.vue';
	import aboutMask from '@/components/aboumask.vue';
	export default {
		data() {
			return {
				imgurl: img_PATH,
				CustomBar: this.CustomBar,
				gologin: false,
				showLoading: false,
				showNone: false,
				aboutMaskBool: false,
				type: 1,
				item: {},
				info: {},
				userInfo: {},
				about: {}
			};
		},
		computed: {
			token() {
				return this.$store.state[LocalStorage.token]
			}
		},
		components: {
			tabBar,
			aboutMask
		},
		onLoad() {

		},
		onShow() {
			this.isLogin()
			this.getAbout()
		},
		created() {

		},
		// 触底的事件
		onReachBottom() {

		},
		methods: {

			// 判断是否登录
			async isLogin() {
				let _res = await getUserInfo();
				if (_res.code == 200) {
					this.gologin = false
					this.userInfo = _res.data
					this.init()
				}
				if (_res.code == 503) {
					this.gologin = true
				}
			},
			// 详情
			async init() {
				let _data = await queryOrderSummary();
				if (_data.code == 200) {
					this.info = _data.data
				}
			},

			// 获取关于我们
			async getAbout() {
				let _row = await queryCustomerService();
				if (_row.code == 200) {
					this.about = _row.data
				}
			},

			accWatch() {
				this.aboutMaskBool = false
			},

			lookAbout(type) {
				this.aboutMaskBool = true
				this.type = type
			},

			async list() {
				this.showNone = false
				this.showLoading = true
				let _data = await getNews(this.search.page, this.search.limit);
				if (_data.status === 200) {
					if (_data.rows.length === 0) {
						this.showLoading = false
						this.showNone = true
						return
					}
					this.search.page++
					this.showLoading = false
					this.news = [...this.news, ..._data.rows]
				}
			},
			to(path) {
				navigateTo(path)
			},
		},

	}
</script>

<style scoped lang="scss">
	.mine {
		min-height: 100vh;
		width: 100%;
		padding-bottom: 200rpx;
		background-color: #f7f7f7;
		padding: 30rpx 25rpx;

		.nologin {
			width: 100%;

			.tologin {
				width: 100%;
				height: 78rpx;
				background-image: linear-gradient(90deg,
						#f8a544 0%,
						#fc761d 100%);
				border-radius: 39rpx;
				text-align: center;
				line-height: 78rpx;
				font-size: 30rpx;
				color: #ffffff;
				margin: 50rpx 0;
			}
		}

		.back-btn {
			width: 100%;
			height: 78rpx;
			background-image: linear-gradient(90deg,
					#f8a544 0%,
					#fc761d 100%);
			border-radius: 23rpx;
			text-align: center;
			line-height: 78rpx;
			font-size: 30rpx;
			color: #ffffff;
			margin: 50rpx 0;
		}

		.meun {
			width: 100%;
			background-color: #ffffff;
			border-radius: 23rpx;
			padding: 0 30rpx;
			margin-top: 30rpx;

			.meun-item {
				width: 100%;
				height: 115rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #dedfe1;

				&:last-child {
					border: none;
				}

				.icon-right {
					font-size: 34rpx;
					color: #666666;
				}

				.tit {
					flex: 1;
					font-size: 30rpx;
					color: #000000;
					padding: 0 20rpx;
				}

				image {
					width: 52rpx;
					height: auto;
					margin-top: 6rpx;
				}
			}
		}

		.num-box {
			width: 100%;
			height: 177rpx;
			background-image: linear-gradient(91deg,
					#2d90f7 0%,
					#6cbcff 50%,
					#3d9cf9 100%);
			box-shadow: 0rpx 6rpx 24rpx 0rpx rgba(65, 155, 248, 0.46);
			border-radius: 23rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 50rpx;
			margin-top: 30rpx;
			margin-bottom: 15rpx;

			.num-line {
				width: 2rpx;
				height: 60rpx;
				border-left: solid 1rpx #f5f5f5;
			}

			.num-item {
				width: max-content;

				.tex {
					width: 100%;
					text-align: center;
					font-size: 26rpx;
					color: #ffffff;
					padding-top: 10rpx;
				}

				.num {
					width: 100%;
					text-align: center;
					font-size: 48rpx;
					color: #ffffff;
					font-weight: bold;
				}
			}
		}

		.user-box {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;
			padding: 0 15rpx;

			.user-detail {
				flex: 1;
				height: 100rpx;
				padding: 5rpx 25rpx;
				display: flex;
				justify-content: space-between;
				flex-direction: column;

				.user-phone {
					font-size: 28rpx;
					color: #2b2e48;
				}

				.user-name {
					width: 100%;
					font-size: 36rpx;
					color: #2b2e48;
				}
			}

			.user-btn {
				width: 100rpx;
				height: 46rpx;
				background-image: linear-gradient(90deg,
						#f8a544 0%,
						#fc761d 100%);
				border-radius: 23rpx;
				text-align: center;
				line-height: 46rpx;
				font-size: 28rpx;
				color: #ffffff;
			}

			.user-head {
				width: 100rpx;
				height: 100rpx;
				background-color: #6064f7;
				border: solid 4rpx #ffffff;
				border-radius: 50rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

	}
</style>