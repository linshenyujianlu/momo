<template>
	<view class="goods">
		<!-- 今日供应提示条 -->
		<view class="supply-bar">
			<text class="supply-dot"></text>
			<text class="supply-text">今日现蒸 · 共 {{goodsCount}} 款可选</text>
			<text class="supply-tip">下单请加老板微信</text>
		</view>

		<view class="goods-page" :style="{height: pageHeight + 'px'}">
			<!-- 左侧分类栏 -->
			<view class="cate-bar" :style="{height: pageHeight + 'px'}">
				<scroll-view class="cate-scroll" scroll-y :show-scrollbar="false" :style="{height: pageHeight + 'px'}">
					<view class="cate-item" v-for="item in categories" :key="item.categoryId"
						:class="{active: curCategoryId === item.categoryId, disabled: !hasGoods(item.categoryId)}"
						@click="changeCategory(item)">
						<text class="cate-icon">{{item.icon}}</text>
						<text class="cate-name">{{item.name}}</text>
					</view>
					<view class="cate-blank"></view>
				</scroll-view>
			</view>

			<!-- 右侧商品列表 -->
			<view class="goods-main" :style="{height: pageHeight + 'px'}">
				<scroll-view class="goods-scroll" scroll-y :show-scrollbar="false" scroll-with-animation
					:scroll-into-view="intoView" @scroll="onGoodsScroll" v-if="!emptyCategory"
					:style="{height: pageHeight + 'px'}">
					<view class="group-item" v-for="group in groups" :key="group.categoryId"
						:id="`group-${group.categoryId}`">
						<view class="group-title">
							<text class="title-icon">{{group.icon}}</text>
							<text class="title-text">{{group.name}}</text>
							<text class="title-count">{{group.goods.length}} 款</text>
						</view>
						<goods-card v-for="item in group.goods" :key="item.goodsId" :item="item" mode="row" />
					</view>
					<!-- 底部留白 保证最后一个分类也能顶到右栏顶部 -->
					<view class="group-blank" :style="{height: blankHeight + 'px'}"></view>
				</scroll-view>

				<!-- 空分类空态 -->
				<empty-state v-else :text="'「' + emptyCategory.name + '」还在准备中'" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		categories,
		goodsList
	} from '@/config/shop.js';
	import goodsCard from '@/components/goods-card.vue';
	import emptyState from '@/components/empty-state.vue';

	// 点击分类的节流间隔 毫秒
	const TAP_INTERVAL = 150
	// 滚动回调的节流间隔 毫秒
	const SCROLL_INTERVAL = 60
	// 定位滚动的互斥锁定超时 毫秒
	const LOCK_TIME = 400

	export default {
		data() {
			return {
				categories: categories,
				goods: goodsList,
				// 可视区高度 需扣除底部导航占位
				pageHeight: 600,
				// 当前高亮分类
				curCategoryId: '',
				// 定位滚动的锚点
				intoView: '',
				// 联动锁定中 定位滚动期间暂停右侧滚动反查
				lockScroll: false,
				lockTimer: null,
				tapTime: 0,
				scrollTime: 0,
				// 各分组顶部距容器顶部的距离缓存表
				groupTops: [],
				containerHeight: 0,
				// 无商品的分类
				emptyCategory: null,
				blankHeight: 0,
				targetCategoryId: ''
			};
		},
		computed: {
			// 上架商品总数
			goodsCount() {
				return this.goods.filter(item => item.status).length
			},
			// 右栏分组 仅渲染启用且有上架商品的分类
			groups() {
				let _list = []
				this.categories.slice().sort((a, b) => a.sort - b.sort).forEach(item => {
					if (!item.enabled) return
					let _goods = this.goods.filter(row => row.categoryId === item.categoryId && row.status)
						.slice()
						.sort((a, b) => a.sort - b.sort)
					if (_goods.length) {
						_list.push({
							categoryId: item.categoryId,
							name: item.name,
							icon: item.icon,
							goods: _goods
						})
					}
				})
				return _list
			}
		},
		components: {
			goodsCard,
			emptyState
		},
		onLoad(options) {
			this.setPageHeight()
			this.targetCategoryId = options.categoryId || ''
		},
		onShow() {
			// 首页带参进入 直接定位到对应分类
			let _cate = this.$store.state.foodCategory
			if (_cate) {
				this.$store.state.foodCategory = ''
				this.targetCategoryId = _cate
			}
			if (this.targetCategoryId) {
				this.locateCategory(this.targetCategoryId)
				this.targetCategoryId = ''
			}
		},
		onReady() {
			this.$nextTick(() => {
				this.measureGroups().then(() => {
					if (this.targetCategoryId) {
						this.locateCategory(this.targetCategoryId)
						this.targetCategoryId = ''
					} else if (this.groups.length) {
						this.curCategoryId = this.groups[0].categoryId
					}
				})
			})
			// 图片渲染完成后补偿测量一次 避免高度变化导致缓存表失真
			setTimeout(() => {
				this.measureGroups()
			}, 300)
		},
		beforeDestroy() {
			clearTimeout(this.lockTimer)
		},
		methods: {
			// 计算可视区高度 H5 端需扣除底部导航与安全区域
			setPageHeight() {
				let _info = uni.getSystemInfoSync()
				let _height = _info.windowHeight || 600
				// #ifdef H5
				let _inset = _info.safeAreaInsets ? _info.safeAreaInsets.bottom : 0
				_height = _height - 50 - _inset
				// #endif
				this.pageHeight = _height
			},

			// 分类是否有上架商品
			hasGoods(categoryId) {
				return this.goods.some(item => item.categoryId === categoryId && item.status)
			},

			/*
			 * 方向一 点左滚右
			 * 点击左栏分类 右侧平滑滚动定位到对应分组
			 * */
			changeCategory(item) {
				let _now = Date.now()
				// 快速连点节流 避免滚动行为叠加抢占
				if (_now - this.tapTime < TAP_INTERVAL) return
				this.tapTime = _now

				this.curCategoryId = item.categoryId
				// 空分组 左栏置灰 右栏展示空态
				if (!this.hasGoods(item.categoryId)) {
					this.emptyCategory = item
					this.intoView = ''
					return
				}
				// 从空态切回时需重新测量分组位置
				let _wasEmpty = !!this.emptyCategory
				this.emptyCategory = null
				if (_wasEmpty) {
					this.$nextTick(() => {
						this.measureGroups().then(() => {
							this.locateCategory(item.categoryId)
						})
					})
					return
				}
				this.locateCategory(item.categoryId)
			},

			// 定位到指定分类
			locateCategory(categoryId) {
				if (!categoryId) return
				let _group = this.groups.find(item => item.categoryId === categoryId)
				if (!_group) return
				this.curCategoryId = categoryId
				this.emptyCategory = null
				// 锁定期间暂停方向二 避免高亮来回跳动
				this.lockScroll = true
				clearTimeout(this.lockTimer)
				this.intoView = ''
				this.$nextTick(() => {
					this.intoView = `group-${categoryId}`
					this.lockTimer = setTimeout(() => {
						this.lockScroll = false
					}, LOCK_TIME)
				})
			},

			/*
			 * 方向二 滚右亮左
			 * 滚动回调与分组位置缓存表比对 同步高亮左栏
			 * */
			onGoodsScroll(e) {
				let _now = Date.now()
				if (_now - this.scrollTime < SCROLL_INTERVAL) return
				this.scrollTime = _now
				// 程序主动定位滚动期间不参与计算
				if (this.lockScroll) return
				if (!this.groupTops.length || !this.groups.length) return

				let _top = e.detail.scrollTop || 0
				let _height = e.detail.scrollHeight || 0
				let _index = 0
				for (let i = 0; i < this.groupTops.length; i++) {
					if (_top + 2 >= this.groupTops[i]) {
						_index = i
					}
				}
				// 已滚动到底部 直接高亮最后一个分类
				if (_height && this.containerHeight && _top + this.containerHeight >= _height - 4) {
					_index = this.groupTops.length - 1
				}
				let _categoryId = this.groups[_index] ? this.groups[_index].categoryId : ''
				// 结果一致时跳过更新 减少无效渲染
				if (_categoryId && _categoryId !== this.curCategoryId) {
					this.curCategoryId = _categoryId
					this.intoView = ''
				}
			},

			// 测量各分组顶部位置并缓存
			measureGroups() {
				return new Promise((resolve) => {
					const query = uni.createSelectorQuery().in(this)
					query.select('.goods-scroll').boundingClientRect()
					query.selectAll('.group-item').boundingClientRect()
					query.exec((res) => {
						let _container = res[0] ? res[0] : null
						let _items = res[1] ? res[1] : []
						let _top = _container ? _container.top : 0
						this.containerHeight = _container ? _container.height : 0
						this.groupTops = _items.map(item => item.top - _top)
						// 末尾分组补白 保证最后一个分类可以滚到顶部
						let _last = _items.length ? _items[_items.length - 1] : null
						if (_last && this.containerHeight) {
							this.blankHeight = Math.max(0, this.containerHeight - _last.height)
						}
						resolve()
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.goods {
		width: 100%;
		height: 100vh;
		background-color: $bg-page;

		// 今日供应提示条
		.supply-bar {
			width: 100%;
			height: 64rpx;
			padding: 0 24rpx;
			background-image: linear-gradient(90deg, #FFF1E4 0%, #F6EBE1 100%);
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.supply-dot {
				width: 12rpx;
				height: 12rpx;
				border-radius: $radius-pill;
				background-color: $theme-primary;
				margin-right: 12rpx;
			}

			.supply-text {
				flex: 1;
				width: 0;
				font-size: 22rpx;
				color: $text-content;
			}

			.supply-tip {
				flex-shrink: 0;
				font-size: 22rpx;
				color: $theme-primary-deep;
			}
		}

		.goods-page {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;

			// 左侧分类栏
			.cate-bar {
				width: 176rpx;
				background-color: $bg-assist;
				flex-shrink: 0;

				.cate-scroll {
					width: 176rpx;

					.cate-item {
						width: 176rpx;
						height: 132rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						position: relative;

						.cate-icon {
							font-size: 34rpx;
							line-height: 40rpx;
						}

						.cate-name {
							font-size: 26rpx;
							color: $text-content;
							padding-top: 6rpx;
							transition: all 150ms ease-out;
						}

						// 左侧焦糖棕指示条
						&::before {
							content: '';
							position: absolute;
							left: 0;
							top: 48rpx;
							width: 6rpx;
							height: 36rpx;
							border-radius: $radius-pill;
							background-color: transparent;
							transition: background-color 150ms ease-out;
						}

						&.active {
							background-color: $bg-page;

							.cate-name {
								font-weight: bold;
								color: $theme-primary-deep;
							}

							&::before {
								background-color: $theme-primary-deep;
							}
						}

						// 无上架商品 置灰
						&.disabled {
							.cate-icon {
								opacity: 0.4;
							}

							.cate-name {
								color: $text-sub;
							}
						}
					}

					.cate-blank {
						width: 100%;
						height: 240rpx;
					}
				}
			}

			// 右侧商品列表
			.goods-main {
				flex: 1;
				width: 0;
				background-color: $bg-page;

				.goods-scroll {
					width: 100%;

					.group-item {
						width: 100%;
						padding: 0 24rpx;

						.group-title {
							width: 100%;
							height: 88rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							position: sticky;
							top: 0;
							z-index: 2;
							background-color: $bg-page;

							.title-icon {
								font-size: 28rpx;
								padding-right: 8rpx;
							}

							.title-text {
								font-size: 28rpx;
								font-weight: bold;
								color: $text-title;
							}

							.title-count {
								font-size: 20rpx;
								color: $text-sub;
								padding-left: 12rpx;
							}
						}

						.goods-card {
							margin-bottom: $card-gap;
						}
					}
				}
			}
		}
	}
</style>
