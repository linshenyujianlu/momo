import {localAnStore} from '@/config/index'

const Plugin = {}
Plugin.install = function(Vue, options) {
	// console.log(options)
	// 1. 添加全局方法或属性
	// Vue.myGlobalMethod = function () {
	//   // 逻辑
	// }
 
	// 2. 添加全局资源
	// Vue.directive('my-directive', {
	//   bind (el, binding, vnode, oldVnode) {
	//     // 逻辑
	//   }
	// })

	// 3. 注入组件选项
	// 设置只执行一次的代码
	let ones = true
	Vue.mixin({
		// 每一个页面的created执行之前都会执行这个页面
		created() {
			// 只执行一次
			if (ones) {
				ones = false
				// 获取本地数据
				this.$getData()
				// 设置监听
				this.$addWacth()

			}
		},
		methods: {
			// 获取本地数据
			$getData() {
				let value
				localAnStore.map(item => {
					value = this.$getStorage(item.key)
					this.$store.state[item.key] = value
				})
			},
			// 根据配置设置监听
			$addWacth() {
				localAnStore.map(item => {
					this.$watch(function() {
						return this.$store.state[item.key]
					}, function(newVal) {
						this.$setStorage(item.key, newVal)
					}, {
						deep: true
					})
				})
			},
			// 设置localStorag
			$setStorage(key, value) {
				uni.setStorage({
					key: key,
					data: JSON.stringify(value)
				});
			},
			// 获取Storage
			$getStorage(key) {
				try {
					const value = uni.getStorageSync(key);
					if (value) {
						return JSON.parse(value)
					} else {
						return null
					}
				} catch (e) {
					// error
				}

			}
		}
	})
}


export default Plugin
