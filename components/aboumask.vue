<template>
	<view class="index">

		<!-- 查看账号 -->
		<uni-popup ref="popup">
			<view class="popup-content">
				<view class="account-box">
					<view class="account-title" v-if="type == 1">关于我们</view>
					<view class="account-desc" v-if="type == 1">智慧学堂专业教育培训平台</view>
					<view class="account-item">
						<image src="/static/images/kefudianhua.png" mode=""></image>
						<view class="account-tex">
							<view class="account-label">客服电话</view>
							<view class="account-value">{{about.phone}}</view>
						</view>
					</view>

					<view class="account-item" v-if="type == 1">
						<image src="/static/images/gongzuoshijian.png" mode=""></image>
						<view class="account-tex">
							<view class="account-label">工作时间</view>
							<view class="account-value">{{about.time}}</view>
						</view>
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
		navigateTo
	} from '@/utils/index.js';
	import {
		img_PATH
	} from '@/config';
	export default {
		props: {
			aboutMaskBool: {
				type: Boolean,
				default: false
			},
			type: {
				type: Number,
				default: 1
			},
			about: {
				type: Object,
				default: () => {}
			}
		},
		watch: {
			aboutMaskBool() {
				if (this.aboutMaskBool) {
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
			open() {
				this.$refs.popup.open('center')
			},

			close() {
				this.$refs.popup.close()
				this.$emit('accWatch', false)
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
	.index {

		.account-box {
			width: 580rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			padding: 30rpx;
			padding-bottom: 60rpx;

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

			.account-item {
				width: 100%;
				height: 140rpx;
				background-color: #f8f9fc;
				border-radius: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 40rpx;
				margin-top: 30rpx;

				image {
					width: 80rpx;
					height: 80rpx;
				}

				.account-tex {
					flex: 1;
					height: 80rpx;
					padding-left: 30rpx;
					display: flex;
					justify-content: space-between;
					flex-direction: column;

					.account-value {
						font-size: 28rpx;
						color: #888c99;
					}

					.account-label {
						width: 100%;
						font-size: 29rpx;
						color: #2b2e48;
					}
				}

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