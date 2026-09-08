import Vue from 'vue'
import Vuex from 'vuex'
import {
	setLocalStorage
} from "@/utils";
import {
	LocalStorage
} from "@/config";


Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		[LocalStorage.token]: '',
		[LocalStorage.user]: '',
		[LocalStorage.area]: '',
		[LocalStorage.grade]: '',
		[LocalStorage.areaId]: '',
		[LocalStorage.gradeId]: '',
		[LocalStorage.profile]: '',
		// 首页跳转菜单页时传入的定位分类 用完即清
		foodCategory: '',
	},
	mutations: {
		increment(state) {
			// 变更状
			setLocalStorage(LocalStorage.token, '');
			setLocalStorage(LocalStorage.user, '');
			setLocalStorage(LocalStorage.area, '');
			setLocalStorage(LocalStorage.grade, '');
			setLocalStorage(LocalStorage.areaId, '');
			setLocalStorage(LocalStorage.gradeId, '');
		},
		async updateInfo(state, data) {
			await setLocalStorage(data.key, data.value)
		},
	},
	actions: {
		LogOut(context) {
			context.commit('increment')
		},
		updateInfo(context, data) {
			context.commit('updateInfo', data)
		},
	},
	modules: {}
})