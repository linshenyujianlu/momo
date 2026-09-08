<template>
	<view class="goods-card" :class="mode" @click="toDetail">
		<view class="card-img">
			<image :src="item.image" mode="aspectFill" lazy-load></image>
			<text class="card-badge" v-if="item.badge">{{item.badge}}</text>
		</view>
		<view class="card-info">
			<view class="card-name ovHide">{{item.name}}</view>
			<view class="card-sub ovHide2">{{item.subtitle}}</view>
			<view class="card-meta" v-if="item.tags && item.tags.length">
				<text class="meta-tag" v-for="(tag, index) in item.tags" :key="index">{{tag}}</text>
			</view>
			<view class="card-price">
				<text class="price-symbol">¥</text>
				<text class="price-value">{{item.price}}</text>
				<text class="price-unit">起</text>
				<text class="price-kcal" v-if="item.kcal">{{item.kcal}}千卡</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		navigateTo
	} from '@/utils/index.js';

	/*
	 * 商品卡片
	 * mode: row 左图右文（菜单页） / column 上图下文（首页招牌推荐）
	 * */
	export default {
		name: 'goods-card',
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			mode: {
				type: String,
				default: 'row'
			}
		},
		methods: {
			// 点击整卡进入商品详情页
			toDetail() {
				navigateTo(`/pages/goods/detail?goodsId=${this.item.goodsId}`)
			}
		}
	}
</script>

<style scoped lang="scss">
	.goods-card {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		background-color: $bg-card;
		border-radius: $radius-card;
		box-shadow: $shadow-soft;
		transition: all 150ms ease-out;

		&:active {
			opacity: 0.85;
		}

		.card-img {
			position: relative;

			image {
				width: 100%;
				height: 100%;
				border-radius: $radius-image;
				display: block;
			}

			.card-badge {
				position: absolute;
				left: 10rpx;
				top: 10rpx;
				max-width: 120rpx;
				height: 36rpx;
				padding: 0 14rpx;
				border-radius: $radius-pill;
				background-color: $theme-accent;
				font-size: 20rpx;
				color: $text-title;
				line-height: 36rpx;
				overflow: hidden;
			}
		}

		.card-info {
			flex: 1;
			width: 0;

			.card-name {
				width: 100%;
				font-size: 28rpx;
				font-weight: bold;
				line-height: 40rpx;
				color: $text-title;
			}

			.card-sub {
				width: 100%;
				font-size: 22rpx;
				color: $text-sub;
				line-height: 32rpx;
				padding-top: 8rpx;
			}

			.card-meta {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-top: 12rpx;
				overflow: hidden;

				.meta-tag {
					height: 32rpx;
					padding: 0 12rpx;
					margin-right: 8rpx;
					border-radius: 8rpx;
					background-color: $bg-assist;
					font-size: 20rpx;
					color: $text-content;
					line-height: 32rpx;
					white-space: nowrap;
					flex-shrink: 0;
				}
			}

			.card-price {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: flex-end;
				padding-top: 12rpx;
				color: $theme-primary;
				font-weight: bold;

				.price-symbol {
					font-size: 22rpx;
					padding-bottom: 4rpx;
				}

				.price-value {
					font-size: 34rpx;
					line-height: 34rpx;
				}

				.price-unit {
					font-size: 20rpx;
					color: $text-sub;
					font-weight: normal;
					padding-left: 6rpx;
					padding-bottom: 2rpx;
				}

				.price-kcal {
					flex: 1;
					width: 0;
					text-align: right;
					font-size: 20rpx;
					color: $text-sub;
					font-weight: normal;
					padding-bottom: 2rpx;
				}
			}
		}

		// 左图右文（菜单页）
		&.row {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 24rpx;

			.card-img {
				width: 160rpx;
				height: 160rpx;
				flex-shrink: 0;
			}

			.card-info {
				padding-left: 24rpx;
			}
		}

		// 上图下文（首页招牌推荐）
		&.column {
			width: 240rpx;
			padding: 16rpx;
			flex-shrink: 0;

			.card-img {
				width: 208rpx;
				height: 208rpx;
			}

			.card-info {
				width: 208rpx;

				.card-name {
					padding-top: 16rpx;
				}

				// 推荐位空间有限 副标题与标签行不展示 保证卡片等高
				.card-sub {
					display: none;
				}

				.card-meta {
					display: none;
				}

				.card-price {
					padding-top: 8rpx;
				}
			}
		}
	}
</style>
