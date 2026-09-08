<template>
	<view class="home">
		<!-- 顶部品牌区（沉浸式） -->
		<view class="hero" :style="{paddingTop: StatusBar + 'px'}">
			<view class="hero-top">
				<view class="hero-left">
					<view class="hero-name">{{shopInfo.name}}</view>
					<view class="hero-slogan">{{shopInfo.slogan}}</view>
				</view>
				<view class="hero-status">营业中</view>
			</view>

			<!-- 数据条 -->
			<view class="stat-bar">
				<view class="stat-item">
					<view class="stat-num">{{stats.steamed}}</view>
					<view class="stat-label">今日现蒸（笼）</view>
				</view>
				<view class="stat-line"></view>
				<view class="stat-item">
					<view class="stat-num">{{stats.fit}}</view>
					<view class="stat-label">低卡套餐</view>
				</view>
				<view class="stat-line"></view>
				<view class="stat-item">
					<view class="stat-num">{{stats.served}}</view>
					<view class="stat-label">已服务（人）</view>
				</view>
			</view>
		</view>

		<!-- 头图轮播 -->
		<view class="banner-box">
			<swiper class="banner-swiper" :indicator-dots="false" :autoplay="true" :interval="5000" :circular="true"
				@change="onBannerChange">
				<swiper-item v-for="(item, index) in banners" :key="index">
					<image class="banner-img" :src="item.image" mode="aspectFill" @click="toBanner(item)"></image>
				</swiper-item>
			</swiper>
			<view class="banner-caption">
				<text class="caption-text">{{banners[bannerCur] ? banners[bannerCur].title : ''}}</text>
			</view>
			<view class="banner-dots">
				<view class="dot" :class="{active: bannerCur === index}" v-for="(item, index) in banners" :key="index">
				</view>
			</view>
		</view>

		<!-- 品牌故事卡 -->
		<view class="story-card">
			<view class="story-info">
				<view class="story-name">{{shopInfo.name}}</view>
				<view class="story-slogan">“{{shopInfo.slogan}}”</view>
				<view class="story-intro ovHide3">{{shopInfo.intro}}</view>
			</view>
			<image class="story-img" :src="shopInfo.storyImage" mode="aspectFill"></image>
		</view>

		<!-- 招牌推荐 -->
		<view class="section">
			<section-title title="招牌推荐" more="查看全部" @more="toCategory('')" />
			<scroll-view class="sign-scroll" scroll-x :show-scrollbar="false" v-if="signatureGoods.length">
				<view class="sign-list">
					<goods-card v-for="item in signatureGoods" :key="item.goodsId" mode="column" :item="item" />
				</view>
			</scroll-view>
			<empty-state v-else text="招牌还在准备中" />
		</view>

		<!-- 分类快捷入口 -->
		<view class="section">
			<section-title title="逛逛分类" />
			<view class="cate-grid">
				<view class="cate-cell" v-for="(item, index) in categories" :key="item.categoryId"
					@click="toCategory(item.categoryId)">
					<view class="cate-icon" :class="'tone-' + (index % 4)">{{item.icon}}</view>
					<view class="cate-name">{{item.name}}</view>
				</view>
			</view>
		</view>

		<!-- 本周热销 -->
		<view class="section">
			<section-title title="本周热销" />
			<view class="hot-card">
				<view class="hot-item" v-for="(item, index) in hotGoods" :key="item.goodsId"
					@click="toDetail(item.goodsId)">
					<view class="hot-rank" :class="'rank-' + (index + 1)">{{index + 1}}</view>
					<image class="hot-img" :src="item.image" mode="aspectFill" lazy-load></image>
					<view class="hot-info">
						<view class="hot-name ovHide">{{item.name}}</view>
						<view class="hot-meta">
							<text class="hot-kcal">{{item.kcal}} 千卡</text>
							<text class="hot-sold">已售 {{item.sold}} 份</text>
						</view>
					</view>
					<view class="hot-price">¥{{item.price}}</view>
				</view>
			</view>
		</view>

		<!-- 门店信息卡 -->
		<view class="section">
			<section-title title="门店信息" />
			<view class="shop-card">
				<view class="info-row">
					<text class="info-label">营业时间</text>
					<text class="info-value">{{shopInfo.businessHours}}</text>
				</view>
				<view class="info-row">
					<text class="info-label">取餐方式</text>
					<text class="info-value">{{shopInfo.pickup}}</text>
				</view>
				<view class="info-row">
					<text class="info-label">门店地址</text>
					<text class="info-value">{{shopInfo.address}}</text>
				</view>
				<view class="info-row">
					<text class="info-label">温馨提示</text>
					<text class="info-value">{{shopInfo.tips}}</text>
				</view>
				<view class="info-row">
					<text class="info-label">联系商家</text>
					<view class="info-btn" @click="openContact">咨询</view>
				</view>
			</view>
		</view>

		<!-- 底部轻引导 -->
		<view class="guide-box">
			<view class="guide-info">
				<view class="guide-title">饿了想吃点好的？</view>
				<view class="guide-sub">去逛逛今天现蒸的花样主食吧</view>
			</view>
			<view class="guide-btn" @click="toCategory('')">去逛逛</view>
		</view>

		<!-- 联系商家弹窗 -->
		<contact-modal :show="showContact" @close="showContact = false" />
	</view>
</template>

<script>
	import {
		toast,
		navigateTo,
		switchTabTo
	} from '@/utils/index.js';
	import {
		shopInfo,
		stats,
		banners,
		categories,
		goodsList
	} from '@/config/shop.js';
	import goodsCard from '@/components/goods-card.vue';
	import sectionTitle from '@/components/section-title.vue';
	import emptyState from '@/components/empty-state.vue';
	import contactModal from '@/components/contact-modal.vue';

	export default {
		data() {
			return {
				StatusBar: this.StatusBar || 20,
				shopInfo: shopInfo,
				stats: stats,
				banners: banners,
				categories: categories,
				bannerCur: 0,
				showContact: false
			};
		},
		computed: {
			// 招牌推荐 由静态数据中的招牌标记驱动 最多 6 个
			signatureGoods() {
				return goodsList.filter(item => item.status && item.badge === '招牌').slice(0, 6)
			},
			// 本周热销 取有角标的前三项 销量写死便于老板直接修改
			hotGoods() {
				let _sold = [268, 196, 152]
				return goodsList.filter(item => item.status && item.badge).slice(0, 3).map((item, index) => {
					return Object.assign({}, item, {
						sold: _sold[index] ? _sold[index] : 99
					})
				})
			}
		},
		components: {
			goodsCard,
			sectionTitle,
			emptyState,
			contactModal
		},
		onLoad() {
			this.StatusBar = this.StatusBar || uni.getSystemInfoSync().statusBarHeight || 20
		},
		// 下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				toast('已刷新')
				uni.stopPullDownRefresh()
			}, 400)
		},
		methods: {
			// 轮播切换
			onBannerChange(e) {
				this.bannerCur = e.detail.current
			},

			// 轮播图跳转
			toBanner(item) {
				if (item.type === 'goods' && item.target) {
					navigateTo(`/pages/goods/detail?goodsId=${item.target}`)
					return
				}
				if (item.type === 'category' && item.target) {
					this.toCategory(item.target)
				}
			},

			// 跳转商品详情
			toDetail(goodsId) {
				navigateTo(`/pages/goods/detail?goodsId=${goodsId}`)
			},

			// 跳转商品页并定位到分类 tabBar 页不支持参数 走全局状态传递
			toCategory(categoryId) {
				this.$store.state.foodCategory = categoryId
				switchTabTo('/pages/goods/index')
			},

			// 打开联系商家弹窗
			openContact() {
				this.showContact = true
			}
		},
		// 分享给好友
		onShareAppMessage() {
			return {
				title: `${this.shopInfo.name}的花样主食图鉴`,
				path: '/pages/home/index',
				imageUrl: this.banners[0] ? this.banners[0].image : ''
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: `${this.shopInfo.name}的花样主食图鉴`,
				imageUrl: this.banners[0] ? this.banners[0].image : ''
			}
		}
	}
</script>

<style scoped lang="scss">
	.home {
		min-height: 100vh;
		width: 100%;
		background-color: $bg-page;
		padding-bottom: 60rpx;

		// 顶部品牌区
		.hero {
			width: 100%;
			padding: 20rpx $page-padding 32rpx;
			background-image: linear-gradient(180deg, #FFF4EA 0%, #F6EBE1 100%);

			.hero-top {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;

				.hero-left {
					flex: 1;
					width: 0;

					.hero-name {
						width: 100%;
						font-size: 36rpx;
						font-weight: bold;
						color: $text-title;
					}

					.hero-slogan {
						width: 100%;
						font-size: 24rpx;
						color: $theme-primary-deep;
						padding-top: 6rpx;
					}
				}

				.hero-status {
					flex-shrink: 0;
					height: 44rpx;
					padding: 0 20rpx;
					border-radius: $radius-pill;
					background-color: rgba(166, 123, 91, 0.12);
					font-size: 22rpx;
					color: $theme-primary-deep;
					line-height: 44rpx;
				}
			}

			.stat-bar {
				width: 100%;
				margin-top: 28rpx;
				padding: 24rpx 0;
				background-color: rgba(255, 255, 255, 0.72);
				border-radius: $radius-card;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.stat-item {
					flex: 1;
					width: 0;
					text-align: center;

					.stat-num {
						font-size: 36rpx;
						font-weight: bold;
						color: $theme-primary-deep;
						line-height: 40rpx;
					}

					.stat-label {
						width: 100%;
						font-size: 22rpx;
						color: $text-sub;
						padding-top: 6rpx;
					}
				}

				.stat-line {
					width: 1rpx;
					height: 44rpx;
					background-color: $border-color;
				}
			}
		}

		// 头图轮播
		.banner-box {
			width: calc(100% - #{$page-padding * 2});
			margin: $card-gap $page-padding 0;
			height: 400rpx;
			position: relative;
			border-radius: $radius-card;
			overflow: hidden;
			box-shadow: $shadow-soft;

			.banner-swiper {
				width: 100%;
				height: 400rpx;

				.banner-img {
					width: 100%;
					height: 400rpx;
					display: block;
				}
			}

			.banner-caption {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 120rpx;
				padding: 0 24rpx 40rpx;
				background-image: linear-gradient(180deg,
						rgba(74, 55, 40, 0) 0%,
						rgba(74, 55, 40, 0.55) 100%);
				display: flex;
				align-items: flex-end;

				.caption-text {
					font-size: 28rpx;
					font-weight: bold;
					color: $bg-card;
				}
			}

			.banner-dots {
				position: absolute;
				right: 24rpx;
				bottom: 44rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.dot {
					width: 12rpx;
					height: 12rpx;
					border-radius: $radius-pill;
					background-color: rgba(255, 255, 255, 0.6);
					margin-left: 8rpx;
					transition: all 150ms ease-out;

					&.active {
						width: 32rpx;
						background-color: $bg-card;
					}
				}
			}
		}

		.section {
			width: 100%;
			padding: 0 $page-padding;
			margin-top: $section-gap;
		}

		// 品牌故事卡
		.story-card {
			width: calc(100% - #{$page-padding * 2});
			margin: $card-gap $page-padding 0;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.story-info {
				flex: 1;
				width: 0;
				padding-right: 24rpx;

				.story-name {
					width: 100%;
					font-size: 32rpx;
					font-weight: bold;
					color: $text-title;
				}

				.story-slogan {
					width: 100%;
					font-size: 24rpx;
					color: $theme-primary-deep;
					padding-top: 8rpx;
				}

				.story-intro {
					width: 100%;
					font-size: 24rpx;
					color: $text-content;
					line-height: 38rpx;
					padding-top: 12rpx;
				}
			}

			.story-img {
				width: 160rpx;
				height: 160rpx;
				border-radius: $radius-image;
				flex-shrink: 0;
			}
		}

		// 招牌推荐
		.sign-scroll {
			width: 100%;
			padding-top: 24rpx;

			.sign-list {
				display: flex;
				width: max-content;
				justify-content: flex-start;
				align-items: flex-start;

				.goods-card {
					margin-right: $card-gap;
				}
			}
		}

		// 分类快捷入口
		.cate-grid {
			width: 100%;
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			padding-top: 8rpx;

			.cate-cell {
				width: 25%;
				height: 160rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.cate-icon {
					width: 96rpx;
					height: 96rpx;
					border-radius: 28rpx;
					font-size: 44rpx;
					line-height: 96rpx;
					text-align: center;
				}

				.tone-0 {
					background-color: $bg-pastel-yellow;
				}

				.tone-1 {
					background-color: $bg-pastel-pink;
				}

				.tone-2 {
					background-color: $bg-pastel-green;
				}

				.tone-3 {
					background-color: $bg-pastel-peach;
				}

				.cate-name {
					width: 100%;
					text-align: center;
					font-size: 24rpx;
					color: $text-content;
					padding-top: 12rpx;
				}
			}
		}

		// 本周热销
		.hot-card {
			width: 100%;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 8rpx 24rpx;
			margin-top: 24rpx;

			.hot-item {
				width: 100%;
				height: 132rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				border-bottom: 1rpx solid $border-color;

				&:last-child {
					border-bottom: none;
				}

				.hot-rank {
					width: 40rpx;
					height: 40rpx;
					border-radius: 12rpx;
					background-color: $bg-assist;
					font-size: 24rpx;
					font-weight: bold;
					color: $text-sub;
					text-align: center;
					line-height: 40rpx;
					flex-shrink: 0;

					&.rank-1 {
						background-color: $theme-primary;
						color: $bg-card;
					}

					&.rank-2 {
						background-color: rgba(217, 169, 140, 0.6);
						color: $bg-card;
					}

					&.rank-3 {
						background-color: rgba(217, 169, 140, 0.35);
						color: $theme-primary-deep;
					}
				}

				.hot-img {
					width: 96rpx;
					height: 96rpx;
					border-radius: $radius-image;
					margin-left: 20rpx;
					flex-shrink: 0;
				}

				.hot-info {
					flex: 1;
					width: 0;
					padding: 0 20rpx;

					.hot-name {
						width: 100%;
						font-size: 28rpx;
						font-weight: bold;
						color: $text-title;
					}

					.hot-meta {
						width: 100%;
						padding-top: 10rpx;
						font-size: 22rpx;
						color: $text-sub;

						.hot-kcal {
							color: $theme-primary-deep;
						}

						.hot-sold {
							padding-left: 16rpx;
						}
					}
				}

				.hot-price {
					flex-shrink: 0;
					font-size: 30rpx;
					font-weight: bold;
					color: $theme-primary;
				}
			}
		}

		// 门店信息卡
		.shop-card {
			width: 100%;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 8rpx 32rpx;
			margin-top: 24rpx;

			.info-row {
				width: 100%;
				min-height: 88rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid $border-color;

				&:last-child {
					border-bottom: none;
				}

				.info-label {
					flex-shrink: 0;
					font-size: 26rpx;
					color: $text-sub;
					padding-right: 24rpx;
				}

				.info-value {
					flex: 1;
					width: 0;
					text-align: right;
					font-size: 26rpx;
					color: $text-content;
					line-height: 38rpx;
					padding: 20rpx 0;
				}

				.info-btn {
					flex-shrink: 0;
					height: 56rpx;
					padding: 0 32rpx;
					border-radius: $radius-pill;
					border: 1rpx solid $theme-primary-deep;
					font-size: 24rpx;
					color: $theme-primary-deep;
					line-height: 54rpx;
				}
			}
		}

		// 底部轻引导
		.guide-box {
			width: calc(100% - #{$page-padding * 2});
			margin: $section-gap $page-padding 0;
			background-color: $bg-assist;
			border-radius: $radius-card;
			padding: 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.guide-info {
				flex: 1;
				width: 0;

				.guide-title {
					width: 100%;
					font-size: 28rpx;
					font-weight: bold;
					color: $text-title;
				}

				.guide-sub {
					width: 100%;
					font-size: 24rpx;
					color: $text-sub;
					padding-top: 8rpx;
				}
			}

			.guide-btn {
				flex-shrink: 0;
				height: 72rpx;
				padding: 0 40rpx;
				margin-left: 24rpx;
				border-radius: $radius-pill;
				background-image: $btn-gradient;
				font-size: 26rpx;
				font-weight: bold;
				color: $bg-card;
				line-height: 72rpx;
				transition: all 150ms ease-out;

				&:active {
					opacity: 0.85;
					transform: scale(0.96);
				}
			}
		}
	}
</style>
