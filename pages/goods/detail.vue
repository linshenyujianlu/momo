<template>
	<view class="detail">
		<!-- 顶部商品轮播 -->
		<view class="swiper-box">
			<swiper class="goods-swiper" :indicator-dots="false" :autoplay="false" @change="onSwiperChange">
				<swiper-item v-for="(item, index) in goods.images" :key="index">
					<image class="swiper-img" :src="item" mode="aspectFill" @click="previewImage(index)"></image>
				</swiper-item>
			</swiper>
			<view class="swiper-index">{{swiperCur + 1}}/{{goods.images.length}}</view>
		</view>

		<!-- 自定义返回 -->
		<view class="nav-back" :style="{top: StatusBar + 'px'}" @click="back">
			<text class="back-icon">‹</text>
		</view>

		<view class="detail-body">
			<!-- 基础信息 -->
			<view class="info-card">
				<view class="goods-name">{{goods.name}}</view>
				<view class="goods-sub">{{goods.subtitle}}</view>

				<!-- 热量与标签 -->
				<view class="kcal-box">
					<view class="kcal-left">
						<text class="kcal-num">{{goods.kcal}}</text>
						<text class="kcal-unit">千卡 / 份</text>
					</view>
					<view class="kcal-right">
						<text class="kcal-tag" v-for="(item, index) in goods.tags" :key="index">{{item}}</text>
					</view>
				</view>

				<view class="price-row">
					<text class="price-symbol">¥</text>
					<text class="price-value">{{goods.price}}</text>
					<text class="price-unit">起</text>
					<text class="price-note">价格仅供参考，以实际沟通为准</text>
				</view>
				<view class="tag-row" v-if="goods.badge">
					<text class="tag">{{goods.badge}}</text>
				</view>
			</view>

			<!-- 规格口味说明 -->
			<view class="spec-card" v-if="goods.specs && goods.specs.length">
				<section-title title="规格口味" />
				<view class="spec-row" v-for="(item, index) in goods.specs" :key="index">
					<text class="spec-label">{{item.label}}</text>
					<text class="spec-value">{{item.value}}</text>
				</view>
			</view>

			<!-- 商品详情图文 -->
			<view class="detail-card">
				<section-title title="商品详情" />
				<view class="detail-item" v-for="(item, index) in goods.detail" :key="index">
					<view class="detail-title">{{item.title}}</view>
					<view class="detail-content">{{item.content}}</view>
				</view>
				<view class="detail-notice">{{goods.notice}}</view>
			</view>

			<!-- 今日搭配 -->
			<view class="detail-card" v-if="matchGoods.length">
				<section-title title="今日搭配" />
				<scroll-view class="match-scroll" scroll-x :show-scrollbar="false">
					<view class="match-list">
						<view class="match-item" v-for="item in matchGoods" :key="item.goodsId"
							@click="toDetail(item.goodsId)">
							<image class="match-img" :src="item.image" mode="aspectFill" lazy-load></image>
							<view class="match-name ovHide">{{item.name}}</view>
							<view class="match-price">¥{{item.price}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 底部固定操作栏 -->
		<view class="operate-bar">
			<view class="operate-btn" @click="openContact">添加老板微信，咨询下单</view>
		</view>

		<!-- 联系老板弹窗 -->
		<contact-modal :show="showContact" @close="showContact = false" />
	</view>
</template>

<script>
	import {
		toast,
		navigateBack,
		navigateTo
	} from '@/utils/index.js';
	import {
		goodsList
	} from '@/config/shop.js';
	import sectionTitle from '@/components/section-title.vue';
	import contactModal from '@/components/contact-modal.vue';

	export default {
		data() {
			return {
				StatusBar: this.StatusBar || 20,
				goods: {},
				swiperCur: 0,
				showContact: false
			};
		},
		computed: {
			// 同分类其他商品 最多 4 个
			matchGoods() {
				if (!this.goods.categoryId) return []
				return goodsList.filter(item => item.status &&
					item.categoryId === this.goods.categoryId &&
					item.goodsId !== this.goods.goodsId).slice(0, 4)
			}
		},
		components: {
			sectionTitle,
			contactModal
		},
		onLoad(options) {
			this.StatusBar = this.StatusBar || uni.getSystemInfoSync().statusBarHeight || 20
			let _goods = goodsList.find(item => item.goodsId === options.goodsId)
			if (!_goods) {
				toast('商品不存在或已下架')
				setTimeout(() => {
					navigateBack()
				}, 1000)
				return
			}
			this.goods = _goods
		},
		methods: {
			// 轮播切换
			onSwiperChange(e) {
				this.swiperCur = e.detail.current
			},

			// 点击放大预览
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.goods.images
				})
			},

			// 跳转其他商品详情
			toDetail(goodsId) {
				navigateTo(`/pages/goods/detail?goodsId=${goodsId}`)
			},

			// 返回上一页
			back() {
				navigateBack()
			},

			// 打开联系老板弹窗
			openContact() {
				this.showContact = true
			}
		},
		// 分享给好友
		onShareAppMessage() {
			return {
				title: `${this.goods.name} 今日现做 快来尝尝`,
				path: `/pages/goods/detail?goodsId=${this.goods.goodsId}`,
				imageUrl: this.goods.images && this.goods.images.length ? this.goods.images[0] : ''
			}
		},
		// 分享到朋友圈
		onShareTimeline() {
			return {
				title: `${this.goods.name} 今日现做 快来尝尝`,
				imageUrl: this.goods.images && this.goods.images.length ? this.goods.images[0] : ''
			}
		}
	}
</script>

<style scoped lang="scss">
	.detail {
		min-height: 100vh;
		width: 100%;
		background-color: $bg-page;
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom));

		// 顶部轮播 1:1
		.swiper-box {
			width: 100%;
			height: 750rpx;
			position: relative;

			.goods-swiper {
				width: 100%;
				height: 750rpx;

				.swiper-img {
					width: 100%;
					height: 750rpx;
					display: block;
				}
			}

			.swiper-index {
				position: absolute;
				right: 32rpx;
				bottom: 32rpx;
				height: 44rpx;
				padding: 0 20rpx;
				border-radius: $radius-pill;
				background-color: rgba(74, 55, 40, 0.4);
				font-size: 22rpx;
				color: $bg-card;
				line-height: 44rpx;
			}
		}

		.nav-back {
			position: fixed;
			left: 24rpx;
			top: 20rpx;
			z-index: 10;
			width: 64rpx;
			height: 64rpx;
			border-radius: $radius-pill;
			background-color: rgba(255, 255, 255, 0.85);
			display: flex;
			justify-content: center;
			align-items: center;

			.back-icon {
				font-size: 44rpx;
				color: $text-title;
				padding-bottom: 6rpx;
			}
		}

		.detail-body {
			width: 100%;
			padding: 0 $page-padding;

			.info-card {
				width: 100%;
				background-color: $bg-card;
				border-radius: $radius-card;
				box-shadow: $shadow-soft;
				padding: 32rpx;
				margin-top: -40rpx;
				position: relative;
				z-index: 2;

				.goods-name {
					width: 100%;
					font-size: 36rpx;
					font-weight: bold;
					color: $text-title;
				}

				.goods-sub {
					width: 100%;
					font-size: 24rpx;
					color: $text-sub;
					padding-top: 8rpx;
				}

				// 热量与标签
				.kcal-box {
					width: 100%;
					margin-top: 24rpx;
					padding: 20rpx 24rpx;
					border-radius: $radius-image;
					background-image: linear-gradient(90deg, #FFF1E4 0%, #F6EBE1 100%);
					display: flex;
					justify-content: space-between;
					align-items: center;

					.kcal-left {
						flex-shrink: 0;
						color: $theme-primary-deep;

						.kcal-num {
							font-size: 44rpx;
							font-weight: bold;
							line-height: 44rpx;
						}

						.kcal-unit {
							font-size: 22rpx;
							padding-left: 8rpx;
						}
					}

					.kcal-right {
						flex: 1;
						width: 0;
						display: flex;
						justify-content: flex-end;
						align-items: center;

						.kcal-tag {
							height: 40rpx;
							padding: 0 16rpx;
							margin-left: 8rpx;
							border-radius: $radius-pill;
							background-color: $bg-card;
							font-size: 20rpx;
							color: $theme-primary-deep;
							line-height: 40rpx;
						}
					}
				}

				.price-row {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					align-items: flex-end;
					padding-top: 24rpx;
					color: $theme-primary;
					font-weight: bold;

					.price-symbol {
						font-size: 24rpx;
						padding-bottom: 6rpx;
					}

					.price-value {
						font-size: 44rpx;
						line-height: 44rpx;
					}

					.price-unit {
						font-size: 22rpx;
						color: $text-sub;
						font-weight: normal;
						padding-left: 6rpx;
						padding-bottom: 4rpx;
					}

					.price-note {
						flex: 1;
						width: 0;
						text-align: right;
						font-size: 22rpx;
						color: $text-sub;
						font-weight: normal;
						padding-bottom: 4rpx;
					}
				}

				.tag-row {
					width: 100%;
					padding-top: 20rpx;

					.tag {
						display: inline-block;
						height: 40rpx;
						padding: 0 20rpx;
						border-radius: $radius-pill;
						background-color: $theme-accent;
						font-size: 22rpx;
						color: $text-title;
						line-height: 40rpx;
					}
				}
			}

			.spec-card,
			.detail-card {
				width: 100%;
				background-color: $bg-card;
				border-radius: $radius-card;
				box-shadow: $shadow-soft;
				padding: 32rpx;
				margin-top: $card-gap;
			}

			.spec-row {
				width: 100%;
				min-height: 64rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid $border-color;

				&:last-child {
					border-bottom: none;
				}

				.spec-label {
					flex-shrink: 0;
					font-size: 26rpx;
					color: $text-sub;
				}

				.spec-value {
					flex: 1;
					width: 0;
					text-align: right;
					font-size: 26rpx;
					color: $text-content;
				}
			}

			.detail-card {
				padding-top: 24rpx;

				.detail-item {
					width: 100%;
					padding-top: 24rpx;

					.detail-title {
						font-size: 26rpx;
						font-weight: bold;
						color: $text-title;
					}

					.detail-content {
						width: 100%;
						font-size: 26rpx;
						color: $text-content;
						line-height: 42rpx;
						padding-top: 8rpx;
					}
				}

				.detail-notice {
					width: 100%;
					margin-top: 24rpx;
					padding: 20rpx 24rpx;
					border-radius: $radius-image;
					background-color: $bg-assist;
					font-size: 22rpx;
					color: $text-sub;
					line-height: 34rpx;
				}

				// 今日搭配
				.match-scroll {
					width: 100%;
					padding-top: 16rpx;

					.match-list {
						display: flex;
						width: max-content;
						justify-content: flex-start;

						.match-item {
							width: 180rpx;
							flex-shrink: 0;
							margin-right: $card-gap;

							.match-img {
								width: 180rpx;
								height: 180rpx;
								border-radius: $radius-image;
								display: block;
							}

							.match-name {
								width: 100%;
								font-size: 24rpx;
								color: $text-title;
								padding-top: 12rpx;
							}

							.match-price {
								width: 100%;
								font-size: 24rpx;
								font-weight: bold;
								color: $theme-primary;
								padding-top: 4rpx;
							}
						}
					}
				}
			}
		}

		// 底部固定操作栏
		.operate-bar {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 20;
			width: 100%;
			background-color: $bg-card;
			border-top: 1rpx solid $border-color;
			padding: 16rpx $page-padding calc(16rpx + env(safe-area-inset-bottom));

			.operate-btn {
				width: 100%;
				height: 88rpx;
				border-radius: $radius-pill;
				background-image: $btn-gradient;
				text-align: center;
				line-height: 88rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: $bg-card;
				transition: all 150ms ease-out;

				&:active {
					opacity: 0.85;
					transform: scale(0.96);
				}
			}
		}
	}
</style>
