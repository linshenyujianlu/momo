<template>
	<view class="mine">
		<!-- 用户信息卡 -->
		<view class="user-card" @click="toProfile('')">
			<image class="user-avatar" :src="avatar" mode="aspectFill"></image>
			<view class="user-info">
				<view class="user-name">{{nickname}}</view>
				<view class="user-sign">{{signature}}</view>
			</view>
			<view class="user-edit">编辑资料</view>
		</view>

		<!-- 健康目标 -->
		<view class="goal-card" v-if="hasGoal">
			<view class="goal-item">
				<view class="goal-num">{{goalText}}</view>
				<view class="goal-label">健康目标</view>
			</view>
			<view class="goal-line"></view>
			<view class="goal-item">
				<view class="goal-num">{{profile.kcalTarget ? profile.kcalTarget : '--'}}</view>
				<view class="goal-label">每日热量（千卡）</view>
			</view>
			<view class="goal-line"></view>
			<view class="goal-item">
				<view class="goal-num">{{tasteCount}}</view>
				<view class="goal-label">口味偏好（项）</view>
			</view>
		</view>

		<!-- 口味偏好 -->
		<view class="taste-card" v-if="tasteLabels.length">
			<section-title title="我的口味偏好" />
			<view class="taste-list">
				<text class="taste-tag" v-for="(item, index) in tasteLabels" :key="index">{{item}}</text>
			</view>
		</view>

		<!-- 功能入口 -->
		<view class="menu-card">
			<view class="menu-item" @click="toProfile('')">
				<image class="menu-icon" :src="icons.profile" mode="aspectFit"></image>
				<view class="menu-title">个人资料</view>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="toProfile('taste')">
				<image class="menu-icon" :src="icons.taste" mode="aspectFit"></image>
				<view class="menu-title">口味偏好</view>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="to('/pages/mine/about')">
				<image class="menu-icon" :src="icons.about" mode="aspectFit"></image>
				<view class="menu-title">关于我们</view>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="copyWechat">
				<image class="menu-icon" :src="icons.feedback" mode="aspectFit"></image>
				<view class="menu-title">意见反馈</view>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<!-- 联系老板 -->
		<view class="contact-card" @click="openContact">
			<image class="contact-icon" :src="icons.feedback" mode="aspectFit"></image>
			<view class="contact-title">联系老板，咨询下单</view>
			<text class="contact-arrow">›</text>
		</view>

		<!-- 版本号 -->
		<view class="version">版本号 {{version}}</view>

		<!-- 联系老板弹窗 -->
		<contact-modal :show="showContact" @close="showContact = false" />
	</view>
</template>

<script>
	import {
		copyValue,
		navigateTo
	} from '@/utils/index.js';
	import {
		LocalStorage
	} from '@/config';
	import {
		taste_tags,
		goal_types
	} from '@/utils/const.js';
	import {
		img,
		defaultAvatar,
		contactInfo,
		version
	} from '@/config/shop.js';
	import sectionTitle from '@/components/section-title.vue';
	import contactModal from '@/components/contact-modal.vue';

	export default {
		data() {
			return {
				defaultAvatar: defaultAvatar,
				version: version,
				tasteTags: taste_tags,
				goalTypes: goal_types,
				// 功能入口图标
				icons: {
					profile: img('menu-profile.png'),
					taste: img('menu-taste.png'),
					about: img('menu-about.png'),
					feedback: img('menu-feedback.png')
				},
				profile: {},
				showContact: false
			};
		},
		computed: {
			// 未填写资料时使用默认头像与昵称
			avatar() {
				return this.profile.avatar ? this.profile.avatar : this.defaultAvatar
			},
			nickname() {
				return this.profile.nickname ? this.profile.nickname : '馒头小主'
			},
			signature() {
				if (this.profile.remark) return this.profile.remark
				if (this.profile.nickname) return '好好吃饭 才有力气生活'
				return '点击编辑资料，让大家认识你'
			},
			// 是否已设置健康目标
			hasGoal() {
				return !!(this.profile.goal || this.profile.kcalTarget || this.tasteCount)
			},
			goalText() {
				let _find = this.goalTypes.find(item => item.value === this.profile.goal)
				return _find ? _find.label : '未设置'
			},
			tasteCount() {
				return this.profile.tastes ? this.profile.tastes.length : 0
			},
			// 口味偏好 value 转 label
			tasteLabels() {
				if (!this.profile.tastes || !this.profile.tastes.length) return []
				return this.tasteTags.filter(item => this.profile.tastes.indexOf(item.value) > -1).map(item => item.label)
			}
		},
		components: {
			sectionTitle,
			contactModal
		},
		onShow() {
			this.getProfile()
		},
		methods: {
			// 读取本地缓存中的个人资料
			getProfile() {
				let _profile = this.$store.state[LocalStorage.profile]
				this.profile = _profile ? JSON.parse(JSON.stringify(_profile)) : {}
			},

			// 跳转资料编辑页 focus 用于定位到口味偏好分区
			toProfile(focus) {
				navigateTo(`/pages/mine/profile?focus=${focus}`)
			},

			// 意见反馈 走复制微信号兜底
			copyWechat() {
				copyValue(contactInfo.wechat, '已复制微信号，打开微信搜索添加吧')
			},

			// 打开联系老板弹窗
			openContact() {
				this.showContact = true
			},

			to(path) {
				navigateTo(path)
			}
		}
	}
</script>

<style scoped lang="scss">
	.mine {
		min-height: 100vh;
		width: 100%;
		background-color: $bg-page;
		padding: $page-padding;
		padding-bottom: 80rpx;

		// 用户信息卡
		.user-card {
			width: 100%;
			background-image: linear-gradient(180deg, #FFF9F4 0%, #F0EAE4 100%);
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 32rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			position: relative;

			.user-avatar {
				width: 108rpx;
				height: 108rpx;
				border-radius: 50%;
				border: 4rpx solid $theme-primary;
				flex-shrink: 0;
			}

			.user-info {
				flex: 1;
				width: 0;
				padding: 0 24rpx;

				.user-name {
					width: 100%;
					font-size: 32rpx;
					font-weight: bold;
					color: $text-title;
				}

				.user-sign {
					width: 100%;
					font-size: 22rpx;
					color: $text-sub;
					padding-top: 8rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.user-edit {
				position: absolute;
				right: 24rpx;
				bottom: 20rpx;
				font-size: 22rpx;
				color: $theme-primary-deep;
			}
		}

		// 健康目标
		.goal-card {
			width: 100%;
			margin-top: $card-gap;
			padding: 28rpx 0;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goal-item {
				flex: 1;
				width: 0;
				text-align: center;

				.goal-num {
					font-size: 34rpx;
					font-weight: bold;
					color: $theme-primary-deep;
					line-height: 40rpx;
				}

				.goal-label {
					width: 100%;
					font-size: 20rpx;
					color: $text-sub;
					padding-top: 6rpx;
				}
			}

			.goal-line {
				width: 1rpx;
				height: 44rpx;
				background-color: $border-color;
			}
		}

		// 口味偏好
		.taste-card {
			width: 100%;
			margin-top: $card-gap;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 32rpx;

			.taste-list {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				padding-top: 16rpx;

				.taste-tag {
					height: 52rpx;
					padding: 0 24rpx;
					margin: 0 16rpx 16rpx 0;
					border-radius: $radius-pill;
					background-color: $bg-assist;
					font-size: 24rpx;
					color: $text-content;
					line-height: 52rpx;
				}
			}
		}

		// 功能入口
		.menu-card {
			width: 100%;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 0 32rpx;
			margin-top: $card-gap;

			.menu-item {
				width: 100%;
				height: 108rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				border-bottom: 1rpx solid $border-color;

				&:last-child {
					border-bottom: none;
				}

				.menu-icon {
					width: 40rpx;
					height: 40rpx;
					flex-shrink: 0;
				}

				.menu-title {
					flex: 1;
					width: 0;
					font-size: 28rpx;
					color: $text-title;
					padding-left: 20rpx;
				}

				.menu-arrow {
					flex-shrink: 0;
					font-size: 32rpx;
					color: $text-sub;
				}
			}
		}

		// 联系老板强调入口
		.contact-card {
			width: 100%;
			height: 128rpx;
			background-color: rgba(217, 169, 140, 0.18);
			border-radius: $radius-card;
			padding: 0 32rpx;
			margin-top: $card-gap;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			transition: all 150ms ease-out;

			&:active {
				opacity: 0.85;
			}

			.contact-icon {
				width: 44rpx;
				height: 44rpx;
				flex-shrink: 0;
			}

			.contact-title {
				flex: 1;
				width: 0;
				font-size: 28rpx;
				font-weight: bold;
				color: $theme-primary-deep;
				padding-left: 20rpx;
			}

			.contact-arrow {
				flex-shrink: 0;
				font-size: 32rpx;
				color: $theme-primary-deep;
			}
		}

		.version {
			width: 100%;
			text-align: center;
			font-size: 20rpx;
			color: $text-sub;
			padding-top: 60rpx;
		}
	}
</style>
