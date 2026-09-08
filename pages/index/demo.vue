<template>
	<view class="zuti">


		<!-- 		加载提示 -->
		<view class="loading" v-if="showLoading">
			<text style="--i:1">加</text>
			<text style="--i:2">载</text>
			<text style="--i:3">中</text>
			<text style="--i:4">.</text>
			<text style="--i:5">.</text>
			<text style="--i:6">.</text>
		</view>
		<view class="end" v-if="showNone">暂无更多...</view>
	</view>
</template>
<script>
	import {
		loaded,
		loading,
		toast,
		redirectTo,
		navigateTo
	} from '@/utils/index.js';
	import {
		img_PATH
	} from '@/config';
	export default {
		data() {
			return {
				imgurl: img_PATH,
				CustomBar: this.CustomBar,
				showLoading: false,
				showNone: false,
			};
		},
		computed: {
			style() {
				return `background-image:url(${this.imgurl}indexbgc.png);background-position-y: ${- this.CustomBar}px;`
			},
			paddingbottom() {
				try {
					const windowInfo = wx.getWindowInfo()
					// 直接取底部安全区内边距，不再做减法
					const bottom = windowInfo.safeAreaInsets?.bottom

					// 合理性校验：正常值范围 0~34px
					if (typeof bottom === 'number' && bottom >= 0 && bottom <= 50) {
						return bottom
					}
				} catch (e) {
					console.warn('getWindowInfo failed:', e)
				}

				// 兜底：返回 0 比返回一个错误的偏大值更安全
				return 0
			}
		},
		components: {

		},
		onLoad() {

		},
		created() {

		},
		// 触底的事件
		onReachBottom() {

		},
		methods: {
			async list() {
				this.showNone = false
				this.showLoading = true
				let _data = await getNews(this.search.page, this.search.limit);
				if (_data.status === 200) {
					if (_data.rows.length === 0) {
						this.showLoading = false
						this.showNone = true
						return
					}
					this.search.page++
					this.showLoading = false
					this.news = [...this.news, ..._data.rows]
				}
			},
			to(path) {
				navigateTo(path)
			},
		},

	}
</script>

<style scoped lang="scss">
	.zuti {
		min-height: 100vh;
		width: 100%;
		padding: 30rpx 25rpx;
		padding-bottom: 200rpx;
		background-color: #f7f7f7;

	}
</style>