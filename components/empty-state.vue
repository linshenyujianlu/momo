<template>
	<view class="empty-state">
		<image class="empty-img" :src="emptyImage" mode="widthFix"></image>
		<view class="empty-text">{{text}}</view>
	</view>
</template>

<script>
	import {
		emptyImage
	} from '@/config/shop.js';

	/*
	 * 空状态 分类无商品 / 无网络等场景统一呈现
	 * */
	export default {
		name: 'empty-state',
		props: {
			text: {
				type: String,
				default: '这个分类还在烘焙中'
			}
		},
		data() {
			return {
				emptyImage: emptyImage
			};
		}
	}
</script>

<style scoped lang="scss">
	.empty-state {
		width: 100%;
		padding: 80rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.empty-img {
			width: 240rpx;
			height: auto;
		}

		.empty-text {
			width: 100%;
			text-align: center;
			font-size: 24rpx;
			color: $text-sub;
			padding-top: 24rpx;
		}
	}
</style>
