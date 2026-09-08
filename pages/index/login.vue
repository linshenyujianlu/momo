<template>
	<view class="page-container">

		<view class="resigter">
			<view class="resigter-title">账号登录</view>
		</view>

		<div class="form-box">
			<div class="inp-box">
				<input type="text" class="input" v-model="phone" placeholder="请输入手机号码">
			</div>
			<div class="inp-box">
				<input type="text" v-model="code" class="input" placeholder="输入验证码">
				<button class="login-code" hover-class="none" :disabled="codeText !== '获取验证码'"
					:class="{disabled:codeText !== '获取验证码'}"
					@click="sendCode">{{codeText}}{{codeText !== '获取验证码' ? 's' : ''}}</button>
			</div>
			<view class="xieyi">
				登录即表示同意<text @click="navto('/pages/index/agreement')">《用户服务协议》</text>
			</view>
			<view class="btn">
				<view class="sun-btn" @click="loginSub">立即登录</view>
				<view class="sun-btn active" @click="to('/pages/index/index')">返回首页</view>
			</view>
		</div>
	</view>
</template>
<script>
	import {
		loaded,
		loading,
		toast,
		navigateBack,
		navigateTo,
		switchTabTo
	} from '@/utils/index.js';
	import {
		checkRules,
		reg_phone
	} from '@/utils/rules.js';
	import {
		img_PATH,
		LocalStorage
	} from '@/config';
	import {
		sendSms,
		login,
		register
	} from '@/api'
	export default {
		data() {
			return {
				phone: '',
				code: '',
				id: null, // 计时器id
				codeText: '获取验证码', // 验证码文字
			};
		},
		onLoad() {

		},
		methods: {

			async loginSub() {
				if (!this.phone) return toast("请输入手机号")
				if (!this.code) return toast("请输入验证码")
				loading('正在登录...')
				let _data = await login(this.phone, this.code, 'login')
				loaded()
				if (_data.code == 200) {
					if (_data.type === 'register') {
						let _res = await register(this.phone, this.code, 'register');
						if (_res.code == 200) {
							toast(_res.msg)
							this.$store.state[LocalStorage.token] = _res.data.token
							this.to('/pages/index/index')
						} else {
							toast(_res.msg)
						}
					} else {
						toast(_data.msg)
						this.$store.state[LocalStorage.token] = _data.data.token
						this.to('/pages/index/index')
					}

				} else {
					toast(_data.msg)
				}

			},
			async sendCode() {
				if (this.codeText !== '获取验证码') return
				if (!this.phone) return toast('请输入手机号')
				if (!checkRules(reg_phone, this.phone)) return toast('请输入正确的手机号')
				loading('正在发送...')
				let _data = await sendSms(this.phone)
				loaded()
				toast(_data.msg)
				if (_data.code == 200) {
					this.codeText = 60
					this.id = setInterval(() => {
						if (this.codeText === 0) {
							clearInterval(this.id)
							return this.codeText = '获取验证码'
						}
						if (typeof this.codeText === 'number') {
							this.codeText--
						}
					}, 1000)
				} else {
					toast(_data.msg)
					this.codeText = '获取验证码'
					clearInterval(this.id)
				}
			},
			to(path) {
				switchTabTo(path)
			},
			navto(path) {
				navigateTo(path)
			}
		},

	}
</script>

<style scoped lang="scss">
	.page-container {
		min-height: 100vh;
		background-size: 100% auto;
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;

		.resigter {
			width: 100%;
			padding: 45rpx;

			.resigter-title {
				width: 100%;
				font-size: 52rpx;
				letter-spacing: 1rpx;
				color: #333333;
				font-weight: bold;
			}

			.resigter-tab {
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding-top: 40rpx;

				.tab-tex {
					height: 78rpx;
					line-height: 70rpx;
					font-size: 36rpx;
					letter-spacing: 1rpx;
					color: #8a8a8a;
					margin-right: 60rpx;


					&.active {
						color: #0359e8;
						font-weight: bold;
						border-bottom: 8rpx solid #0359e8;
					}
				}
			}
		}

		.form-box {
			width: 100%;
			flex: 1;
			padding: 45rpx;
			background-size: 100% auto;

			.xieyi {
				width: 100%;
				font-size: 28rpx;
				color: #333333;
				padding-top: 40rpx;

				text {
					color: #1f89f6;
				}
			}

			.inp-box {
				width: 100%;
				height: 74rpx;
				border-bottom: 1rpx solid #c6c6c6;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 25rpx;

				.icon-bukejian1 {
					font-size: 40rpx;
					color: #c6c6c6;
					margin-left: 40rpx;
				}

				.input {
					flex: 1;
					height: 73rpx;
					font-size: 32rpx;
					color: #333;
				}

				.login-code {
					font-size: 32rpx;
					color: #1f89f6;
					margin-left: 100rpx;
					outline: none;
					border: none;
					background: none;

					&:after {
						border: none;
						background: none;
					}

					&.disabled {
						opacity: 0.5;
						// color: #ffffff;
					}
				}
			}

			.btn {
				width: 100%;
				padding-top: 60rpx;

				.sun-btn {
					width: 100%;
					width: 662rpx;
					height: 90rpx;
					background-image: linear-gradient(#1f89f6,
							#1f89f6),
						linear-gradient(90deg,
							#ff6600 0%,
							#ffa209 100%);
					background-blend-mode: normal,
						normal;
					border-radius: 45rpx;
					font-size: 36rpx;
					text-align: center;
					line-height: 90rpx;
					color: #fff;

					&.active {
						background: none;
						border: 1rpx solid #1f89f6;
						color: #1f89f6;
						margin-top: 25rpx;
						line-height: 88rpx;
					}
				}
			}

			.toHere {
				padding: 0 30rpx;
				font-size: 28rpx;
				letter-spacing: 1rpx;
				color: #333333;

				.text {
					color: #1f89f6;
				}
			}
		}

	}
</style>