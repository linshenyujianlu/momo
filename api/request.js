import {
	BASE_URL
} from '@/config/index.js'

import {
	loginTimeOut
} from "@/utils/index.js"
import {
	LocalStorage
} from "@/config";
import store from '@/store/index'
//  // 默认值
const request = function(url, params, method = 'POST', header) {
	let headers = {
		'content-type': 'application/json', // 默认值
		// 'content-type': 'application/x-www-form-urlencoded',
		'Authorization': store.state[LocalStorage.token] ? store.state[LocalStorage.token] : ''
	}
	if (header && header['content-type']) {
		headers = header
	} else {
		headers = Object.assign(headers, header);
	}
	if (method === 'DELETE') {
		url = url + '/' + params
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			data: params,
			method: method,
			header: headers,
			success(res) {
				if (res.data.code == 200) {
					resolve(res.data);
				} else if (res.data.code == 501) {
					loginTimeOut()
				} else {
					resolve(res.data)
				}
			},
			fail: function(res) {
				console.log(res)
				uni.showToast({
					title: '连接异常，请重试',
					icon: 'none',
					duration: 2000
				});
				resolve({
					status: 500,
					msg: '连接异常，请重试'
				})
			},
			complete: function(res) {}
		})
	})
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params, header) {
	return request(url, params, 'POST', header)
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params, header) {
	return request(url, params, 'GET', header)
}