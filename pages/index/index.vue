<template>
	<view class="index">
		<view class="top-fixed">
			<!-- 筛选区域 -->
			<view class="search-box">
				<view class="type-box" @click="open">
					<text class="grade">{{grade}}</text>
					<text class="iconfont icon-xiajiantou"></text>
					<text class="city ovHide">{{city}}</text>
				</view>
				<view class="search">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" v-model="keyword" placeholder="搜索课程" confirm-type="搜索" @confirm="Search">
				</view>
			</view>
			<!-- 分类切换区域 -->
			<view class="tab-scroll">
				<view class="tab-list">
					<view class="tab" :class="{active : subjectId == 0}" @click="tabChange(0)">
						全部
						<text class="iconfont icon-weixiao" v-show="subjectId == 0"></text>
					</view>
					<view class="tab" v-for="item in typeList" :key="item.subjectId"
						:class="{active : subjectId == item.subjectId}" @click="tabChange(item.subjectId)">
						{{item.subjectName}}
						<text class="iconfont icon-weixiao" v-show="subjectId == item.subjectId"></text>
					</view>
				</view>
			</view>
		</view>

		<!-- banner -->
		<view class="banner-box">
			<view class="banner">
				<image src="/static/images/zhihuixuetang.png" mode="aspectFill"></image>
			</view>
			<view class="address" @click="to(`/pages/index/school?cityId=${cityId}`)">
				<image src="/static/images/fujinxiaoqu.png" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 活动 -->
		<view class="huodong">
			<image src="/static/images/bm.png" mode="widthFix" @click="to('/pages/index/activityList')"></image>
		</view>


		<!-- 标题 -->
		<view class="index-title">
			<text></text>系统班
		</view>

		<!-- 数据列表 -->
		<view class="list-box">
			<view class="item" v-for="item in list" :key="item.courseId"
				@click="to(`/pages/index/courseDetail?courseId=${item.courseId}`)">
				<view class="item-titbox">
					<text class="item-type" :class="item.bg">{{item.subjectName}}</text>
					<text class="item-title ovHide">{{item.courseTitle}}</text>
				</view>
				<view class="item-time ovHide">
					{{item.desc}}
				</view>
				<view class="item-address" v-if="item.placeName">
					<text class="iconfont icon-touzijigou"></text>
					<text class="adres-tex ovHide">{{item.placeName}}</text>
				</view>
				<view class="item-address" v-if="item.campusAddress">
					<text class="iconfont icon-fenxiangsheding-dizhi"></text>
					<text class="adres-tex ovHide">{{item.campusAddress}}</text>
				</view>
				<view class="item-teacher">
					<view class="item-left">
						<view class="item-head">
							<image :src="imgurl + item.teacherAvatar" mode="aspectFit"></image>
						</view>
						<view class="item-teacherclass">
							共<text class="item-num">{{item.sessionCount}}</text>次课
							<text class="item-line"></text>
							<text class="item-yes" v-if="item.isOpen == 1">已开课</text>
							<text class="item-no" v-else>未开课</text>
						</view>
					</view>
					<view class="item-price">
						<text>¥</text>{{item.price}}
					</view>
				</view>
			</view>
		</view>

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

		<!-- 选择地区班级 -->
		<uni-popup ref="popup" background-color="#fff" border-radius="10px 10px 0 0">
			<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="canshu-title">
					<view class="canshu-title-left">
						<text class="tit">{{masktype == 1 ? '选择年级':'选择城市'}}</text>
						<text class="city" @click="gradeChange">{{masktype == 1 ? city : grade}}</text>
						<text class="iconfont icon-xiajiantou"></text>
					</view>
					<text class="iconfont icon-guanbi3" @click="close"></text>
				</view>
				<view class="canshu-content">
					<view class="canshu-detail">
						<view class="grade-list" v-if="masktype == 1">
							<text v-for="item in classList" :key="item.gradeId" :class="{active:gradeId == item.gradeId}"
								@click="gradeSub(item)">{{item.gradeName}}</text>
						</view>
						<view class="city-list" v-if="masktype == 2">
							<text v-for="item in cityList" :key="item.regionId" :class="{active:cityId == item.regionId}"
								@click="gradeSub(item)">{{item.regionName}}</text>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!--  底部   -->
		<tabBar :tabCur="0" />
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
		img_PATH,
		LocalStorage
	} from '@/config';
	import {
		queryProvinceList,
		queryGradeList,
		querySubjectList,
		queryCourseList
	} from '@/api/index.js'
	import tabBar from '@/components/tabbar.vue';
	export default {
		data() {
			return {
				imgurl: img_PATH,
				CustomBar: this.CustomBar,
				showLoading: false,
				showNone: false,
				type: 'bottom',
				keyword: '',
				page: 1,
				limit: 20,
				subjectId: 0,
				masktype: 1,
				cityList: [],
				classList: [],
				typeList: [],
				list: [],

			};
		},
		computed: {
			token() {
				return this.$store.state[LocalStorage.token]
			},
			cityId() {
				return this.$store.state[LocalStorage.areaId]
			},
			city() {
				return this.$store.state[LocalStorage.area]
			},
			grade() {
				return this.$store.state[LocalStorage.grade]
			},
			gradeId() {
				return this.$store.state[LocalStorage.gradeId]
			}
		},
		components: {
			tabBar
		},
		mounted() {


		},
		onLoad(options) {
			this.init()
			// uni.getLocation({
			// 	type: 'gcj02', // 或 gcj02
			// 	success: function(res) {
			// 		toast('qwe')
			// 		console.log('当前位置的经度：' + res.longitude);
			// 		console.log('当前位置的纬度：' + res.latitude);
			// 	},
			// 	fail: function(err) {
			// 		toast('333')
			// 		console.error('定位失败', err);
			// 	}
			// });
		},
		created() {

		},
		// 触底的事件
		onReachBottom() {
			this.getList()
		},
		methods: {

			// 数据初始化
			async init() {
				let _data = await queryProvinceList();
				if (_data.code == 200) {
					this.cityList = _data.data
					// this.city = _data.data[0].regionName
					// this.cityId = _data.data[0].regionId
					this.$store.state[LocalStorage.area] = this.$store.state[LocalStorage.area] ? this.$store.state[LocalStorage
						.area] : _data.data[0].regionName
					this.$store.state[LocalStorage.areaId] = this.$store.state[LocalStorage.areaId] ? this.$store.state[
						LocalStorage.areaId] : _data.data[0].regionId
				}
				let _res = await queryGradeList();
				if (_res.code == 200) {
					this.classList = _res.data
					// this.grade = _res.data[0].gradeName
					// this.gradeId = _res.data[0].gradeId
					this.$store.state[LocalStorage.grade] = this.$store.state[LocalStorage.grade] ? this.$store.state[
						LocalStorage.grade] : _res.data[0].gradeName
					this.$store.state[LocalStorage.gradeId] = this.$store.state[LocalStorage.gradeId] ? this.$store.state[
						LocalStorage.gradeId] : _res.data[0].gradeId
				}
				await this.getSubjectList()
				await this.Search()
			},

			// 查询科目
			async getSubjectList() {
				let _data = await querySubjectList(this.gradeId);
				if (_data.code == 200) {
					this.typeList = _data.data
				}
			},

			//  
			async getList() {
				this.showNone = false
				this.showLoading = true
				let _data = await queryCourseList(
					this.gradeId,
					this.subjectId,
					this.cityId,
					this.keyword,
					this.page,
					this.limit
				);
				if (_data.code == 200) {
					if (_data.data.length == 0) {
						this.showLoading = false
						this.showNone = true
						return
					}
					this.page++
					this.showLoading = false
					this.list = [...this.list, ..._data.data]
				}
			},

			// 切换科目
			tabChange(subjectId) {
				this.subjectId = subjectId
				this.Search()
			},

			//选择城市
			gradeChange() {
				this.masktype = this.masktype == 1 ? 2 : 1
			},

			// 点击城市或年级
			async gradeSub(item) {
				if (this.masktype == 1) {
					// this.grade = item.gradeName
					// this.gradeId = item.gradeId
					this.$store.state[LocalStorage.grade] = item.gradeName
					this.$store.state[LocalStorage.gradeId] = item.gradeId
				} else {
					// this.city = item.regionName
					// this.cityId = item.regionId
					this.$store.state[LocalStorage.area] = item.regionName
					this.$store.state[LocalStorage.areaId] = item.regionId
				}
				this.close()
				await this.getSubjectList()
				await this.Search()
			},

			Search() {
				this.page = 1
				this.list = []
				this.getList()
			},

			open() {

				this.$refs.popup.open('bottom')
			},

			close() {
				this.masktype = 1
				this.$refs.popup.close()
			},

			to(path) {
				navigateTo(path)
			},
		},

	}
</script>

<style scoped lang="scss">
	.index {
		min-height: 100vh;
		width: 100%;
		background-color: #f7f7f7;
		padding: 240rpx 25rpx;

		.huodong {
			width: 100%;
			height: 180rpx;
			border-radius: 20rpx;
			overflow: hidden;
			margin-top: 20rpx;

			image {
				width: 100%;
				height: auto;
			}
		}

		.list-box {
			width: 100%;

			.item {
				width: 100%;
				background-color: #ffffff;
				border-radius: 20rpx;
				padding: 30rpx;
				margin-bottom: 25rpx;

				.item-teacher {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-top: 26rpx;

					.item-price {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						font-size: 44rpx;
						color: #e74e3e;
						font-weight: bold;

						text {
							font-size: 26rpx;
							color: #e74e3e;
							font-weight: normal;
							padding-top: 10rpx;
							margin-right: 4rpx;
						}
					}

					.item-left {
						display: flex;
						justify-content: flex-start;
						align-items: center;

						.item-teacherclass {
							padding: 0 25rpx;
							font-size: 26rpx;
							color: #8a8a8a;

							.item-num {
								color: #fc751e;
							}

							.item-line {
								width: 1rpx;
								height: 16rpx;
								border-left: solid 1rpx #afafaf;
								margin: 0 10rpx;
							}

							.item-no {
								font-size: 26rpx;
								color: #8a8a8a;
							}

							.item-yes {
								font-size: 26rpx;
								color: #fc751e;
							}
						}

						.item-head {
							width: 72rpx;
							height: 72rpx;
							background-color: #eaf4fd;
							border-radius: 36rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}

				.item-address {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-top: 15rpx;

					.adres-tex {
						flex: 1;
						width: 0;
						font-size: 26rpx;
						color: #888c99;
					}

					.icon-fenxiangsheding-dizhi {
						color: #888c99;
						font-size: 30rpx;
						margin-right: 10rpx;
					}
				}

				.item-time {
					width: 100%;
					font-size: 26rpx;
					color: #888c99;
					margin-top: 20rpx;
				}

				.item-titbox {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.item-title {
						flex: 1;
						width: 0;
						font-size: 32rpx;
						color: #2b2e48;
						font-weight: bold;
					}

					.item-type {
						min-width: 78rpx;
						height: 36rpx;
						border-radius: 0rpx 10rpx 0rpx 10rpx;
						line-height: 36rpx;
						text-align: center;
						font-size: 24rpx;
						color: #ffffff;
						margin-right: 15rpx;

						&.yingyu {
							background-image: linear-gradient(0deg,
									#1f89f6 0%,
									#63b8ff 100%);
						}

						&.shuxue {
							background-image: linear-gradient(0deg,
									#25c1da 0%,
									#45e4e7 100%);
						}

						&.yuwen {
							background-image: linear-gradient(0deg,
									#fc5f7f 0%,
									#fe999e 100%);
						}

						&.wuli {
							background-image: linear-gradient(0deg,
									#7a69f3 0%,
									#9c89f0 100%);
						}
					}
				}
			}
		}

		.index-title {
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 35rpx 0;
			font-size: 34rpx;
			color: #2b2e48;
			font-weight: bold;

			text {
				width: 6rpx;
				height: 36rpx;
				background-color: #1f89f6;
				border-radius: 3rpx;
				margin-right: 10rpx;
			}
		}

		.banner-box {
			width: 100%;
			display: flex;
			justify-content: space-between;

			.address {
				width: 203rpx;
				height: 167rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.banner {
				width: 477rpx;
				height: 169rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.top-fixed {
			width: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 2;
			padding: 18rpx 30rpx;
			height: 210rpx;
			background-color: #ffffff;
			border-bottom: 1rpx solid #eeeeee;

			.tab-scroll {
				width: 100%;
				overflow-x: auto;
				padding-top: 35rpx;

				.tab-list {
					width: max-content;
					display: flex;
					justify-content: flex-start;

					.tab {
						width: max-content;
						margin-right: 45rpx;
						font-size: 32rpx;
						color: #2b2e48;
						position: relative;
						display: flex;
						justify-content: flex-start;
						flex-direction: column;
						align-items: center;

						&.active {
							font-size: 36rpx;
							font-weight: bold;
							color: #1f89f6;
						}

						.icon-weixiao {
							font-size: 40rpx;
							color: #1f89f6;
							margin-top: -10rpx;
						}
					}
				}
			}

			.search-box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.search {
					width: 389rpx;
					height: 69rpx;
					background-color: #f7f7f7;
					border-radius: 35rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding: 0 24rpx;

					input {
						flex: 1;
						height: 67rpx;
						font-size: 28rpx;
						color: #333333;
					}

					.icon-sousuo {
						font-size: 34rpx;
						color: #aaaaaa;
						margin-right: 24rpx;
					}
				}

				.type-box {
					flex: 1;
					width: 0;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding-right: 30rpx;

					.city {
						flex: 1;
						width: 0;
						font-size: 28rpx;
						color: #848484;
						padding-top: 10rpx;
					}

					.icon-xiajiantou {
						font-size: 24rpx;
						color: #333333;
						margin: 0 8rpx;
					}

					.grade {
						font-size: 36rpx;
						color: #333333;
						font-weight: bold;
					}
				}
			}
		}

		.canshu-content {
			width: 100%;
			min-height: 30vh;
			max-height: 50vh;
			overflow-y: auto;
			padding: 0 20rpx;

			.canshu-detail {
				width: 100%;
				height: max-content;

				.grade-list {
					width: 100%;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;
					padding-bottom: 30rpx;
					padding-top: 30rpx;

					text {
						width: calc((100% - 60rpx) / 3);
						font-size: 26rpx;
						color: #333333;
						height: 69rpx;
						background-color: #f7f7f7;
						border-radius: 35rpx;
						text-align: center;
						line-height: 69rpx;
						margin: 0 10rpx;
						margin-bottom: 25rpx;

						&.active {
							background-color: #1f89f6;
							color: #ffffff;
						}
					}
				}

				.city-list {
					width: 100%;
					padding: 0 20rpx;
					padding-bottom: 30rpx;

					text {
						display: block;
						width: 100%;
						font-size: 28rpx;
						color: #333333;
						margin-bottom: 20rpx;
						padding: 15rpx 0;
						font-weight: bold;

						&.active {
							color: #1f89f6;
						}
					}
				}
			}
		}

		.canshu-title {
			width: 100%;
			padding: 35rpx;
			padding-top: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.icon-guanbi3 {
				font-size: 36rpx;
				color: #848484;
				font-weight: bold;
			}

			.canshu-title-left {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.tit {
					font-size: 32rpx;
					font-weight: bold;
				}

				.city {
					font-size: 24rpx;
					color: #333333;
					margin-left: 15rpx;
				}

				.icon-xiajiantou {
					font-size: 24rpx;
					color: #333333;
					margin-left: 6rpx;
				}
			}


		}
	}
</style>