<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-black':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back text-26" :class="backColor"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action">
					<slot name="title"></slot>
				</view>
				<view class="search" :style="[{top:StatusBar + 'px'}]" v-if="isSearch">
					<slot name="content"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'},{left:'0rpx'}]" v-if="isContent">
					<slot name="content"></slot>
				</view>
				<view class="action right">
					<slot name="right"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style =
						`${style}background-image:url(${bgImage});background-size: 100% auto;background-repeat: no-repeat;`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			bgimgurl: {
				type: String,
				default: ''
			},
			backColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			isBackListener: {
				type: [Boolean, String],
				default: false
			},
			isContent: {
				type: [Boolean, String],
				default: false
			},
			isSearch: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
				if (this.isBackListener) {
					this.$emit('back', true)
				} else {
					if (getCurrentPages().length == 1) {
						uni.switchTab({
							url: '/pages/index'
						})
					} else {
						uni.navigateBack({
							delta: 1
						});
					}
				}

			}
		}
	}
</script>

<style>
	.search {
		width: 400rpx !important;
		height: 60rpx;
		background-color: #ffffff;
		box-shadow: 3rpx 4rpx 8rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 34rpx;
	}

	.right {
		position: relative;
	}
</style>