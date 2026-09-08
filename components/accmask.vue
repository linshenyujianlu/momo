<template>
	<view class="index">

		<!-- 查看账号 -->
		<uni-popup ref="popup">
			<view class="popup-content">
				<view class="account-box">
					<view class="account-title">学习账号</view>
					<view class="account-desc">{{item.name}}</view>
					<view class="acc-label">登录账号</view>
					<view class="acc-item">
						<text class="iconfont icon-zhanghaoguanli1"></text>
						<text class="acc-value">{{item.account}}</text>
						<text class="acc-btn" @click="copy(item.account)">复制</text>
					</view>
					<view class="acc-label">登录密码</view>
					<view class="acc-item">
						<text class="iconfont icon-mima3"></text>
						<text class="acc-value">{{item.password}}</text>
						<text class="acc-btn" @click="copy(item.password)">复制</text>
					</view>
					<view class="tips">
						<text class="iconfont icon--zhuyi"></text>
						请妥善保管，首次登录后请及时修改密码
					</view>
					<view class="acc-close" @click="close">
						关闭
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import {
		loaded,
		loading,
		toast,
		redirectTo,
		navigateTo,
		copyText
	} from '@/utils/index.js';
	import {
		img_PATH
	} from '@/config';
	export default {
		props: {
			accMaskBool: {
				type: Boolean,
				default: false
			},
			item: {
				type: Object,
				default: () => {}
			}
		},
		watch: {
			accMaskBool() {
				if (this.accMaskBool) {
					this.open()
				} else {
					this.close()
				}
			},
		},
		data() {
			return {
				imgurl: img_PATH,
				CustomBar: this.CustomBar,
				showLoading: false,
				showNone: false,
			};
		},
		computed: {

		},
		mounted() {

		},
		components: {

		},
		onLoad() {

		},
		created() {

		},
		// 触底的事件
		onReachBottom() {

		},
		methods: {
			copy(text) {
				copyText(text)
			},

			open() {
				this.$refs.popup.open('center')
			},

			close() {
				this.$refs.popup.close()
				this.$emit('accWatch', false)
			},
			// async list() {
			// 	this.showNone = false
			// 	this.showLoading = true
			// 	let _data = await getNews(this.search.page, this.search.limit);
			// 	if (_data.status === 200) {
			// 		if (_data.rows.length === 0) {
			// 			this.showLoading = false
			// 			this.showNone = true
			// 			return
			// 		}
			// 		this.search.page++
			// 		this.showLoading = false
			// 		this.news = [...this.news, ..._data.rows]
			// 	}
			// },
			to(path) {
				navigateTo(path)
			},
		},

	}
</script>

<style scoped lang="scss">
	.index {

		.account-box {
			width: 640rpx;
			height: 744rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			padding: 30rpx;

			.acc-close {
				width: 368rpx;
				height: 70rpx;
				background-image: linear-gradient(92deg,
						#63b8ff 0%,
						#1f88f6 100%);
				border-radius: 34rpx;
				text-align: center;
				line-height: 70rpx;
				font-size: 28rpx;
				color: #ffffff;
				margin: 0 auto;
				margin-top: 50rpx;
			}

			.tips {
				width: 100%;
				height: 73rpx;
				background-color: #fff8e1;
				border-radius: 14rpx;
				padding: 0 24rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 24rpx;
				color: #bd8135;
				margin-top: 25rpx;

				.icon--zhuyi {
					font-size: 38rpx;
					color: #ffc052;
					margin-right: 10rpx;
				}
			}

			.acc-item {
				width: 100%;
				height: 79rpx;
				background-color: #f8f9fc;
				border-radius: 16rpx;
				border: solid 2rpx #dedfe1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-left: 24rpx;
				padding-right: 15rpx;

				.acc-btn {
					width: 101rpx;
					height: 50rpx;
					background-image: linear-gradient(90deg,
							#61b7ff 0%,
							#2c90f7 100%);
					border-radius: 6rpx;
					font-size: 28rpx;
					color: #ffffff;
					text-align: center;
					line-height: 50rpx;
				}

				.acc-value {
					flex: 1;
					font-size: 30rpx;
					color: #2b2e48;
					padding: 0 22rpx;
				}

				.iconfont {
					font-size: 42rpx;
					color: #888c99;
				}
			}

			.acc-label {
				width: 100%;
				font-size: 28rpx;
				color: #888c99;
				padding-top: 35rpx;
				padding-bottom: 20rpx;
			}

			.account-desc {
				width: 100%;
				text-align: center;
				font-size: 28rpx;
				color: #1f89f6;
				padding-top: 15rpx;
			}

			.account-title {
				width: 100%;
				text-align: center;
				font-size: 36rpx;
				color: #2b2e48;
				font-weight: bold;
				padding-top: 10rpx;
			}
		}

	}
</style>