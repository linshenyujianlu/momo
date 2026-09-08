<template>
	<view class="profile">
		<!-- 基础资料 -->
		<view class="form-card">
			<view class="form-item" @click="chooseAvatar">
				<text class="form-label">头像</text>
				<image class="form-avatar" :src="form.avatar" mode="aspectFill"></image>
				<text class="form-arrow">›</text>
			</view>
			<view class="form-item">
				<text class="form-label">昵称</text>
				<input class="form-input" type="text" v-model="form.nickname" :maxlength="12" placeholder="最多 12 个字"
					placeholder-class="form-placeholder" />
				<text class="form-count">{{nicknameLength}}/12</text>
			</view>
			<view class="form-item">
				<text class="form-label">性别</text>
				<view class="gender-list">
					<view class="gender-item" :class="{active: form.gender === item.value}" v-for="item in genderTypes"
						:key="item.value" @click="form.gender = item.value">{{item.label}}</view>
				</view>
			</view>
			<view class="form-item">
				<text class="form-label">生日</text>
				<picker class="birthday-picker" mode="date" :value="form.birthday" @change="onDateChange">
					<view class="form-value" :class="{placeholder: !form.birthday}">{{form.birthday ? form.birthday :
						'请选择'}}</view>
				</picker>
				<text class="form-arrow">›</text>
			</view>
		</view>

		<!-- 健康目标 -->
		<view class="form-card">
			<section-title title="健康目标" />
			<view class="goal-list">
				<view class="goal-item" :class="{active: form.goal === item.value}" v-for="item in goalTypes"
					:key="item.value" @click="form.goal = item.value">{{item.label}}</view>
			</view>
			<view class="form-item">
				<text class="form-label">每日热量</text>
				<input class="form-input" type="number" v-model="form.kcalTarget" :maxlength="4"
					placeholder="例如 1500" placeholder-class="form-placeholder" />
				<text class="form-count">千卡</text>
			</view>
		</view>

		<!-- 口味偏好 -->
		<view class="form-card" :class="{focus: focus === 'taste'}">
			<section-title title="口味偏好" />
			<view class="tag-list">
				<view class="tag-item" :class="{active: form.tastes.indexOf(item.value) > -1}"
					v-for="item in tasteTags" :key="item.value" @click="toggleTaste(item.value)">{{item.label}}</view>
			</view>
		</view>

		<!-- 备注 -->
		<view class="form-card">
			<section-title title="备注" />
			<textarea class="form-area" v-model="form.remark" :maxlength="50" placeholder="例如：不吃香菜、少油少盐"
				placeholder-class="form-placeholder"></textarea>
			<view class="area-count">{{remarkLength}}/50</view>
		</view>

		<!-- 操作按钮 -->
		<view class="form-btns">
			<view class="btn-cancel" @click="cancel">取消</view>
			<view class="btn-save" @click="save">保存</view>
		</view>
	</view>
</template>

<script>
	import {
		toast,
		confirm,
		navigateBack
	} from '@/utils/index.js';
	import {
		LocalStorage
	} from '@/config';
	import {
		gender_types,
		taste_tags,
		goal_types
	} from '@/utils/const.js';
	import {
		defaultAvatar
	} from '@/config/shop.js';
	import sectionTitle from '@/components/section-title.vue';

	export default {
		data() {
			return {
				genderTypes: gender_types,
				tasteTags: taste_tags,
				goalTypes: goal_types,
				// 从我的页带来的定位标识
				focus: '',
				form: {
					avatar: defaultAvatar,
					nickname: '',
					gender: 3,
					birthday: '',
					goal: 0,
					kcalTarget: '',
					tastes: [],
					remark: ''
				},
				origin: ''
			};
		},
		computed: {
			nicknameLength() {
				return this.form.nickname ? this.form.nickname.length : 0
			},
			remarkLength() {
				return this.form.remark ? this.form.remark.length : 0
			},
			// 是否存在未保存的修改
			changed() {
				return JSON.stringify(this.form) !== this.origin
			}
		},
		components: {
			sectionTitle
		},
		onLoad(options) {
			this.focus = options.focus || ''
			this.getProfile()
		},
		methods: {
			// 读取本地缓存中的个人资料
			getProfile() {
				let _profile = this.$store.state[LocalStorage.profile]
				if (_profile) {
					this.form = {
						avatar: _profile.avatar ? _profile.avatar : defaultAvatar,
						nickname: _profile.nickname ? _profile.nickname : '',
						gender: _profile.gender ? _profile.gender : 3,
						birthday: _profile.birthday ? _profile.birthday : '',
						goal: _profile.goal ? _profile.goal : 0,
						kcalTarget: _profile.kcalTarget ? _profile.kcalTarget : '',
						tastes: _profile.tastes ? _profile.tastes : [],
						remark: _profile.remark ? _profile.remark : ''
					}
				}
				this.origin = JSON.stringify(this.form)
			},

			// 选择头像 转 base64 持久化保存
			chooseAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						let _path = res.tempFilePaths[0]
						// #ifdef MP-WEIXIN
						try {
							let _base64 = wx.getFileSystemManager().readFileSync(_path, 'base64')
							this.form.avatar = `data:image/jpeg;base64,${_base64}`
						} catch (e) {
							this.form.avatar = _path
						}
						// #endif

						// #ifndef MP-WEIXIN
						this.form.avatar = _path
						// #endif
					},
					fail: (e) => {
						console.log(e)
					}
				})
			},

			// 生日选择
			onDateChange(e) {
				this.form.birthday = e.detail.value
			},

			// 口味偏好多选
			toggleTaste(value) {
				let _index = this.form.tastes.indexOf(value)
				if (_index > -1) {
					this.form.tastes.splice(_index, 1)
				} else {
					this.form.tastes.push(value)
				}
			},

			// 保存 写入本地缓存并回显我的页
			save() {
				this.$store.state[LocalStorage.profile] = JSON.parse(JSON.stringify(this.form))
				toast('保存成功')
				setTimeout(() => {
					navigateBack()
				}, 500)
			},

			// 取消 有未保存修改时二次确认
			cancel() {
				if (!this.changed) {
					navigateBack()
					return
				}
				confirm('放弃修改', '有未保存的修改，确定退出吗？', () => {
					navigateBack()
				}, '退出', true)
			}
		}
	}
</script>

<style scoped lang="scss">
	.profile {
		min-height: 100vh;
		width: 100%;
		background-color: $bg-page;
		padding: $page-padding;
		padding-bottom: 60rpx;

		.form-card {
			width: 100%;
			background-color: $bg-card;
			border-radius: $radius-card;
			box-shadow: $shadow-soft;
			padding: 8rpx 32rpx 32rpx;
			margin-bottom: $card-gap;

			&.focus {
				animation: focus-flash 1200ms ease-out;
			}

			.form-item {
				width: 100%;
				min-height: 108rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				border-bottom: 1rpx solid $border-color;

				&:last-child {
					border-bottom: none;
				}

				.form-label {
					flex-shrink: 0;
					width: 140rpx;
					font-size: 28rpx;
					color: $text-title;
				}

				.form-avatar {
					width: 88rpx;
					height: 88rpx;
					border-radius: 50%;
					border: 2rpx solid $theme-primary;
				}

				.form-input {
					flex: 1;
					width: 0;
					height: 100rpx;
					font-size: 28rpx;
					color: $text-content;
					text-align: right;
				}

				.form-placeholder {
					color: $text-sub;
					font-size: 26rpx;
				}

				.form-count {
					flex-shrink: 0;
					font-size: 22rpx;
					color: $text-sub;
					padding-left: 16rpx;
				}

				.form-value {
					width: 100%;
					text-align: right;
					font-size: 28rpx;
					color: $text-content;

					&.placeholder {
						color: $text-sub;
					}
				}

				.birthday-picker {
					flex: 1;
					width: 0;
				}

				.form-arrow {
					flex-shrink: 0;
					font-size: 32rpx;
					color: $text-sub;
					padding-left: 8rpx;
				}

				.gender-list {
					flex: 1;
					width: 0;
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.gender-item {
						min-width: 96rpx;
						height: 56rpx;
						padding: 0 20rpx;
						margin-left: 16rpx;
						border-radius: $radius-pill;
						background-color: $bg-assist;
						font-size: 24rpx;
						color: $text-content;
						text-align: center;
						line-height: 56rpx;
						transition: all 150ms ease-out;

						&.active {
							background-color: $theme-primary;
							color: $bg-card;
							font-weight: bold;
						}
					}
				}
			}

			.goal-list {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-top: 16rpx;

				.goal-item {
					flex: 1;
					height: 72rpx;
					margin-right: 16rpx;
					border-radius: $radius-image;
					background-color: $bg-assist;
					font-size: 26rpx;
					color: $text-content;
					text-align: center;
					line-height: 72rpx;
					transition: all 150ms ease-out;

					&:last-child {
						margin-right: 0;
					}

					&.active {
						background-image: $btn-gradient;
						color: $bg-card;
						font-weight: bold;
					}
				}
			}

			.tag-list {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				padding-top: 8rpx;

				.tag-item {
					height: 60rpx;
					padding: 0 28rpx;
					margin: 16rpx 16rpx 0 0;
					border-radius: $radius-pill;
					background-color: $bg-assist;
					font-size: 26rpx;
					color: $text-content;
					line-height: 60rpx;
					transition: all 150ms ease-out;

					&.active {
						background-color: $theme-primary;
						color: $bg-card;
						font-weight: bold;
					}
				}
			}

			.form-area {
				width: 100%;
				height: 160rpx;
				margin-top: 16rpx;
				padding: 20rpx 24rpx;
				border-radius: $radius-image;
				background-color: $bg-assist;
				font-size: 26rpx;
				color: $text-content;
				line-height: 40rpx;
			}

			.area-count {
				width: 100%;
				text-align: right;
				font-size: 22rpx;
				color: $text-sub;
				padding-top: 8rpx;
			}
		}

		.form-btns {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 24rpx;

			.btn-cancel,
			.btn-save {
				width: 320rpx;
				height: 88rpx;
				border-radius: $radius-pill;
				text-align: center;
				line-height: 88rpx;
				font-size: 28rpx;
				font-weight: bold;
				transition: all 150ms ease-out;

				&:active {
					opacity: 0.85;
					transform: scale(0.96);
				}
			}

			.btn-cancel {
				background-color: $bg-card;
				border: 1rpx solid $theme-primary-deep;
				color: $theme-primary-deep;
			}

			.btn-save {
				background-image: $btn-gradient;
				color: $bg-card;
			}
		}
	}

	@keyframes focus-flash {
		0% {
			box-shadow: 0rpx 0rpx 0rpx 0rpx rgba(217, 169, 140, 0.6);
		}

		50% {
			box-shadow: 0rpx 0rpx 0rpx 12rpx rgba(217, 169, 140, 0);
		}

		100% {
			box-shadow: 0rpx 8rpx 24rpx rgba(169, 123, 91, 0.12);
		}
	}
</style>
