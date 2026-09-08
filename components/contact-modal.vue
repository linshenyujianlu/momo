<template>
	<view class="contact-mask" v-if="visible" :class="{'mask-show': animating}" @click="close"
		@touchmove.stop.prevent="stopMove">
		<view class="contact-modal" :class="{'modal-show': animating}" @click.stop="stopMove">
			<!-- 关闭 -->
			<view class="contact-close" @click="close">
				<text class="close-icon">✕</text>
			</view>
			<!-- 标题 -->
			<view class="contact-title">{{modalTitle}}</view>
			<!-- 二维码 -->
			<view class="contact-qr">
				<image :src="contact.qrcode" mode="aspectFit"></image>
			</view>
			<!-- 微信号 -->
			<view class="contact-wechat">
				<text class="wechat-label">微信号：{{contact.wechat}}</text>
				<view class="wechat-copy" @click="copyWechat">复制</view>
			</view>
			<!-- 保存到相册 -->
			<view class="contact-btn" :class="{disabled: !canSave}" @click="saveQrcode">{{saveText}}</view>
			<view class="contact-setting" v-if="!canSave" @click="openSetting">去设置页开启相册权限</view>
			<!-- 底部提示 -->
			<view class="contact-tip">{{modalTip}}</view>
		</view>
	</view>
</template>

<script>
	import {
		toast,
		copyValue,
		saveImageToAlbum,
		checkAlbumAuth
	} from '@/utils/index.js';
	import {
		contactInfo
	} from '@/config/shop.js';

	/*
	 * 微信二维码弹窗（全项目唯一实例）
	 * 对外仅暴露显示 / 隐藏控制与可选的标题、提示文案
	 * 二维码、微信号与文案统一取静态数据配置
	 * */
	export default {
		name: 'contact-modal',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			},
			tip: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				contact: contactInfo,
				visible: false,
				animating: false,
				canSave: true,
				saving: false,
				closeTimer: null
			};
		},
		computed: {
			modalTitle() {
				return this.title ? this.title : this.contact.title
			},
			modalTip() {
				return this.tip ? this.tip : this.contact.tip
			},
			saveText() {
				return this.canSave ? '保存到相册' : '请在设置中开启相册权限'
			}
		},
		watch: {
			show(val) {
				if (val) {
					this.open()
				} else {
					this.close()
				}
			}
		},
		beforeDestroy() {
			clearTimeout(this.closeTimer)
		},
		methods: {
			// 打开 同一时刻仅允许存在一个弹窗实例
			open() {
				if (this.visible) return
				this.visible = true
				this.refreshAuth()
				this.$nextTick(() => {
					this.animating = true
				})
			},

			// 关闭 与点击遮罩行为一致
			close() {
				if (!this.visible) return
				this.animating = false
				clearTimeout(this.closeTimer)
				this.closeTimer = setTimeout(() => {
					this.visible = false
					this.$emit('update:show', false)
					this.$emit('close')
				}, 150)
			},

			// 阻止滚动穿透
			stopMove() {},

			// 刷新相册写入权限 未询问过视为可用
			async refreshAuth() {
				this.canSave = await checkAlbumAuth()
			},

			// 主路径：保存二维码到相册
			async saveQrcode() {
				if (!this.canSave || this.saving) return
				this.saving = true
				try {
					await saveImageToAlbum(this.contact.qrcode)
					// 保存成功后不自动关闭 保留微信号可见性以便备用路径兜底
					toast('已保存，去微信扫一扫吧')
				} catch (e) {
					let _auth = await checkAlbumAuth()
					this.canSave = _auth
					if (!_auth) {
						toast('请在设置中开启相册权限')
					} else {
						toast('保存失败，请稍后重试')
					}
				}
				this.saving = false
			},

			// 备用路径：复制微信号
			copyWechat() {
				copyValue(this.contact.wechat, '已复制，打开微信搜索添加吧')
			},

			// 跳转小程序设置页 返回后恢复按钮可用状态
			openSetting() {
				uni.openSetting({
					success: () => {
						this.refreshAuth()
					},
					fail: (e) => {
						console.log(e)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.contact-mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background-color 200ms ease-out;

		&.mask-show {
			background-color: rgba(0, 0, 0, 0.4);
		}

		.contact-modal {
			width: 560rpx;
			background-color: $bg-card;
			border-radius: $radius-modal $radius-modal 0rpx 0rpx;
			padding: 56rpx 40rpx 40rpx;
			position: relative;
			opacity: 0;
			transform: scale(0.9);
			transition: all 200ms ease-out;

			&.modal-show {
				opacity: 1;
				transform: scale(1);
			}

			.contact-close {
				position: absolute;
				right: 12rpx;
				top: 12rpx;
				width: 56rpx;
				height: 56rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.close-icon {
					font-size: 26rpx;
					color: $text-sub;
				}
			}

			.contact-title {
				width: 100%;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				color: $text-title;
			}

			.contact-qr {
				width: 100%;
				padding: 32rpx 0;
				display: flex;
				justify-content: center;

				image {
					width: 360rpx;
					height: 360rpx;
					border-radius: $radius-image;
					background-color: $bg-card;
				}
			}

			.contact-wechat {
				width: 100%;
				height: 56rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.wechat-label {
					font-size: 26rpx;
					color: $text-content;
				}

				.wechat-copy {
					height: 44rpx;
					padding: 0 20rpx;
					margin-left: 16rpx;
					border-radius: $radius-pill;
					background-color: $bg-assist;
					font-size: 22rpx;
					color: $theme-primary-deep;
					line-height: 44rpx;
				}
			}

			.contact-btn {
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

				&.disabled {
					background-image: none;
					background-color: $bg-assist;
					color: $text-sub;
				}
			}

			.contact-setting {
				width: 100%;
				text-align: center;
				font-size: 22rpx;
				color: $theme-primary-deep;
				padding-top: 16rpx;
			}

			.contact-tip {
				width: 100%;
				text-align: center;
				font-size: 22rpx;
				color: $text-sub;
				line-height: 34rpx;
				padding-top: 24rpx;
			}
		}
	}
</style>
