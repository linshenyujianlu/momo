<template>
	<view class="tabBar">
		<view class="tabbar" :style="{paddingBottom: paddingbottom + 'rpx'}">
			<view class="item" :class="{active:tabCur === item.type}" v-for="(item,index) in menus" :key="index"
				@click="to(item.page)">
				<view class="icon">
					<image :src="tabCur === item.type ? item.activeicon : item.icon" mode="heightFix"></image>
				</view>
				<view class="title">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		img_PATH
	} from '@/config/index.js';
	export default {
		props: {
			tabCur: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				imgurl: img_PATH,
				menus: [{
						title: '首页',
						icon: require('@/static/images/shouye.png'),
						activeicon: require('@/static/images/shouye1.png'),
						type: 0,
						page: '/pages/index/index',
					},
					{
						title: '我的报名',
						icon: require('@/static/images/baoming.png'),
						activeicon: require('@/static/images/baoming1.png'),
						type: 1,
						page: '/pages/index/mysignup',
					},
					{
						title: '个人中心',
						icon: require('@/static/images/wode.png'),
						activeicon: require('@/static/images/wode1.png'),
						type: 2,
						page: '/pages/index/mine',
					}
				],

			};
		},
		computed: {
			token() {
				return this.$store.state.token
			},
			paddingbottom() {
				try {
					const windowInfo = wx.getWindowInfo()
					// 直接取底部安全区内边距，不再做减法
					const bottom = windowInfo.safeAreaInsets?.bottom

					// 合理性校验：正常值范围 0~34px
					if (typeof bottom === 'number' && bottom >= 0 && bottom <= 50) {
						return bottom
					}
				} catch (e) {
					console.warn('getWindowInfo failed:', e)
				}

				// 兜底：返回 0 比返回一个错误的偏大值更安全
				return 0
			}
		},
		methods: {
			to(url) {
				uni.switchTab({
					url: url
				})
			}
			// tabChange(data) {
			// 	this.tabCur = data.tabCur
			// 	uni.setNavigationBarTitle({
			// 		title: data.title ? data.title : '新加多置换' // 导航栏标题文字
			// 	});
			// 	uni.setNavigationBarColor({
			// 		frontColor: '#000000', // 导航栏标题颜色，只能是'black'或'white'
			// 		backgroundColor: data.bgc ? data.bgc : '#F8F8F8' // 导航栏背景颜色
			// 	});

			// }
		},
	}
</script>

<style scoped lang="scss">
	.tabBar {


		.tabbar {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 10;
			width: 100%;
			min-height: 126rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 0rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
			display: flex;
			justify-content: space-between;
			align-items: center;

			.item {
				width: 33%;
				height: 126rpx;
				display: flex;
				justify-content: center;
				flex-direction: column;
				position: relative;

				.icon {
					width: 100%;
					height: 48rpx;

					image {
						display: block;
						height: 42rpx;
						width: auto;
						margin: 0rpx auto;
					}

				}

				.title {
					width: 100%;
					font-size: 22rpx;
					color: #c9c9c9;
					letter-spacing: 1rpx;
					text-align: center;
					padding-top: 2rpx;
					position: relative;
					z-index: 7;
				}

				&.active {

					.title {
						color: #2d91f7;
						font-weight: bold;
					}

					.icon {
						.iconfont {
							color: #c9c9c9;
						}
					}
				}

			}
		}
	}
</style>