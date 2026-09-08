<template>
	<view class="section-title">
		<view class="title-text">{{title}}</view>
		<view class="title-more" v-if="more" @click="onMore">
			{{more}}
			<text class="more-arrow">›</text>
		</view>
	</view>
</template>

<script>
	/*
	 * 栏目标题 右侧可配操作文字
	 * */
	export default {
		name: 'section-title',
		props: {
			title: {
				type: String,
				default: ''
			},
			more: {
				type: String,
				default: ''
			}
		},
		methods: {
			onMore() {
				this.$emit('more')
			}
		}
	}
</script>

<style scoped lang="scss">
	.section-title {
		width: 100%;
		min-height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.title-text {
			flex: 1;
			width: 0;
			font-size: 32rpx;
			font-weight: bold;
			color: $text-title;
		}

		.title-more {
			flex-shrink: 0;
			font-size: 24rpx;
			color: $text-sub;
			padding-left: 20rpx;

			.more-arrow {
				font-size: 26rpx;
				padding-left: 4rpx;
			}
		}
	}
</style>
