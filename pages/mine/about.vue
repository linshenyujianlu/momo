<template>
	<view class="about">
		<!-- 品牌介绍 -->
		<view class="about-card">
			<view class="about-name">{{shopInfo.name}}</view>
			<view class="about-slogan">“{{shopInfo.slogan}}”</view>
			<view class="about-intro">{{aboutInfo.intro}}</view>
		</view>

		<!-- 说明事项 -->
		<view class="about-card">
			<section-title title="说明事项" />
			<view class="about-item" v-for="(item, index) in aboutInfo.items" :key="index">
				<view class="item-title">{{item.title}}</view>
				<view class="item-content">{{item.content}}</view>
			</view>
		</view>

		<!-- 联系我们 -->
		<view class="about-card">
			<section-title title="联系我们" />
			<view class="about-contact">{{aboutInfo.contact}}</view>
			<view class="about-btn" @click="openContact">联系商家</view>
		</view>

		<!-- 联系商家弹窗 -->
		<contact-modal :show="showContact" @close="showContact = false" />
	</view>
</template>

<script>
	import {
		shopInfo,
		aboutInfo
	} from '@/config/shop.js';
	import sectionTitle from '@/components/section-title.vue';
	import contactModal from '@/components/contact-modal.vue';

	export default {
		data() {
			return {
				shopInfo: shopInfo,
				aboutInfo: aboutInfo,
				showContact: false
			};
		},
		components: {
			sectionTitle,
			contactModal
		},
		methods: {
			openContact() {
				this.showContact = true
			}
		}
	}
</script>

<style scoped lang="scss">
	.about {
		min-height: 100vh;
		width: 100%;
		background-color: $bg-page;
		padding: $page-padding;
		padding-bottom: 80rpx;

		.about-card {
			width: 100%;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 32rpx;
			margin-bottom: $card-gap;

			.about-name {
				width: 100%;
				font-size: 32rpx;
				font-weight: bold;
				color: $text-title;
			}

			.about-slogan {
				width: 100%;
				font-size: 24rpx;
				color: $theme-primary-deep;
				padding-top: 8rpx;
			}

			.about-intro {
				width: 100%;
				font-size: 26rpx;
				color: $text-content;
				line-height: 42rpx;
				padding-top: 16rpx;
			}

			.about-item {
				width: 100%;
				padding-top: 24rpx;

				.item-title {
					font-size: 26rpx;
					font-weight: bold;
					color: $text-title;
				}

				.item-content {
					width: 100%;
					font-size: 26rpx;
					color: $text-content;
					line-height: 42rpx;
					padding-top: 8rpx;
				}
			}

			.about-contact {
				width: 100%;
				font-size: 26rpx;
				color: $text-content;
				line-height: 42rpx;
				padding-top: 16rpx;
			}

			.about-btn {
				width: 100%;
				height: 88rpx;
				margin-top: 32rpx;
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
