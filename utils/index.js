import {
	LocalStorage
} from '@/config';

import store from '@/store';
import Decimal from 'decimal.js'
/* 
	VUE 计算小数不精确  使用方法来计算 
	 */
export function add(a, b) { // 加法 //调用add(0.1,0.2)    //0.3
	a = new Decimal(a);
	b = new Decimal(b);
	return a.plus(b).toNumber(); //结果需要用toNumber转为普通数字
}
export function mutiply(a, b) { // 乘 mutiply(3,0.6);   //1.8
	a = new Decimal(a);
	b = new Decimal(b);
	return a.times(b).toNumber();
}
export function minus(a, b) { // 减 minus(0.3,0.1);     //0.2
	a = new Decimal(a);
	b = new Decimal(b);
	return a.minus(b).toNumber();
}
export function devide(a, b) { // 除法 、、devide(355,113)  //  3.1415929203539825
	a = new Decimal(a);
	b = new Decimal(b);
	return a.dividedBy(b).toNumber();
}

export const loading = (msg = '正在加载...') => {
	uni.showLoading({
		title: msg
	})
}
export const loaded = () => {
	uni.hideLoading()
}

export const toast = (msg, duration = 3000) => {
	uni.showToast({
		title: msg,
		icon: 'none',
		duration: duration,
	})
}

export const friendlyDate = (date) => {
	const now = new Date();
	const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
	let givenDay = new Date(isString(date) ? date.replace(/-/g, '/') : date); // 如果是时间戳，转换为Date对象

	if (now.getTime() - givenDay.getTime() < oneDay) {
		return '今天';
	} else if (now.getTime() - givenDay.getTime() < oneDay * 2) {
		return '昨天';
	} else if (now.getTime() - givenDay.getTime() < oneDay * 3) {
		return '前天';
	} else {
		// 如果超过三天，返回日期字符串
		return ZhDate(date, 4)
	}
}


export const confirm = (title, msg, fn, confirmButtonText = '确认', showCancelButton = false, cancel = () => {},
	cancelButtonText = '取消') => {
	uni.showModal({
		title: title,
		content: msg,
		confirmText: confirmButtonText,
		showCancel: showCancelButton,
		cancelText: cancelButtonText,
		success(res) {
			if (res.confirm) {
				fn && fn()
			} else {
				cancel()
			}
		}
	})
}

export const navigateTo = (path) => {
	// 定义：保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面。
	uni.navigateTo({
		url: path,
		fail(e) {
			console.log(e)
		}
	})
}

export const switchTabTo = (path) => {
	// 定义：保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面。
	uni.switchTab({
		url: path,
		fail(e) {
			console.log(e)
		}
	})
}

export const reLaunch = (path) => {
	// 定义：关闭所有页面，打开到应用内的某个页面（可带参数）
	uni.reLaunch({
		url: path,
		fail(e) {
			console.log(e)
		}
	})
}

export const redirectTo = (path) => {
	// 定义：可以关闭当前界面并跳转到其他的非tabbar界面（可带参数）
	uni.redirectTo({
		url: path,
		fail(e) {
			console.log(e)
		}
	})
}

export const navigateBack = (num = 1) => {
	// 定义：关闭当前页面，返回上一页面或多级页面
	uni.navigateBack({
		delta: num,
		fail(e) {
			console.log(e)
		}
	})
}


export const loginTimeOut = () => {
	toast('登录状态已过期，请您重新登录')
	setTimeout(() => {
		logout()
	}, 1000)
}

export const userLogout = () => {
	confirm('退出登录', '你确定退出当前帐号吗？', logout, '退出', true)
}

export const logout = (isNav = false, path = '') => {
	store.dispatch('LogOut').then(() => {
		uni.reLaunch({
			url: '/pages/index/login'
		})
	})
}


export const openFile = (url, name) => {
	if (isImageType(url)) {
		uni.previewImage({
			urls: [url],
			fail: (e) => {
				console.log(e)
			}
		})
	} else {
		loading()
		uni.downloadFile({
			url: url,
			success: function(res) {
				var filePath = res.tempFilePath;
				uni.openDocument({
					filePath: filePath
				})
			},
			complete() {
				loaded()
			}
		});

	}
}

export const downFile = (url) => {
	loading('正在下载...')
	uni.downloadFile({
		url: url,
		success: function(res) {
			toast('下载成功')
		},
		complete() {
			loaded()
		}
	});
}
/**
 * 获取Token
 */
export const getToken = () => {
	let user = getLocalStorage(LocalStorage.user, '')
	return {
		token: user && user.token || ''
	};
}

/*
 *时间转换**/
export const zhDate = (date, type) => {
	if (!date) return ''
	if (date === '0000-00-00 00:00:00') return ''
	let now = new Date(isString(date) ? date.replaceAll('-', '/') : date)
	let year = now.getFullYear()
	let month = now.getMonth() + 1
	let day = now.getDate()
	let hour = now.getHours()
	let minute = now.getMinutes()
	let second = now.getSeconds()
	if (type === 1) {
		return year + "-" + formatMonth(month) + "-" + formatMonth(day) + " " + formatMonth(hour) + ":" +
			formatMonth(minute)
	} else if (type === 2) {
		return year + "-" + formatMonth(month) + "-" + formatMonth(day) + " " + formatMonth(hour) + ":" +
			formatMonth(minute) + ":" + formatMonth(second)
	} else if (type === 3) {
		return formatMonth(hour) + ":" + formatMonth(minute)
	} else if (type === 4) {
		return year
	} else if (type === 5) {
		return year + "-" + formatMonth(month)
	} else if (type === 6) {
		return formatMonth(month) + "月" + formatMonth(day) + "日 " + formatMonth(hour) + ":" + formatMonth(minute)
	} else if (type === 7) {
		return year + "/" + formatMonth(month) + "/" + formatMonth(day)
	} else if (type === 8) {
		return year + "年第" + formatMonth(month) + "期"
	} else {
		return year + "-" + formatMonth(month) + "-" + formatMonth(day)
	}
}

export const formatMonth = (num) => {
	if (parseInt(num) < 10) {
		num = '0' + num
	}
	return num
}


export const isLastDate = (date, count) => {
	if (!date) return true
	let _date = new Date(date).getTime()
	let now = new Date()
	return _date - now.getTime() <= 1000 * 60 * 60 * 24 * count
}

//返回两个时间差几小时 整数
export const getTimeLong = (start, end) => {
	if (!start) return ''
	if (!end) return ''
	let _start = new Date(start).getTime()
	let _end = new Date(end).getTime()
	//如果相差 7.5 小时 按 天算
	if (Math.abs(_end - _start) > 1000 * 60 * 60 * 7.5) {
		// return Math.floor((_end - _start) / (1000 * 60 * 60 * 24)) + '天'
		return Math.floor((_end - _start) / (1000 * 60 * 60 * 24)) * 7.5
	}
	return Math.floor((_end - _start) / (1000 * 60 * 60))
}

//文件大小格式化
export const format_fileSize = (size) => {
	if (size < 1024) {
		return size + 'B'
	} else if (size < 1048576) {
		return (size / 1024).toFixed(2) + 'KB'
	} else if (size < 1073741824) {
		return (size / 1048576).toFixed(2) + 'MB'
	} else {
		return (size / 1073741824).toFixed(2) + 'GB'
	}
}

export const getYear = () => {
	let now = new Date()
	return now.getFullYear()
}

export const getMonth = () => {
	let now = new Date()
	return now.getMonth() + 1
}

export const getYears = (start = 2021) => {
	let years = []
	let date = new Date();
	let fullYear = date.getFullYear();
	for (let year = fullYear; year > start; year--) {
		years.push({
			label: `${year}年`,
			value: year
		})
	}
	return years
}

export const getMonths = (start = 1) => {
	let months = []
	for (let month = start; month <= 12; month++) {
		months.push({
			label: `${month}`,
			value: month
		})
	}
	return months
}

export const browserRedirect = () => { //  1 手机 2 pc
	let sUserAgent = navigator.userAgent.toLowerCase();
	let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	let bIsMidp = sUserAgent.match(/midp/i) == "midp";
	let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	let bIsAndroid = sUserAgent.match(/android/i) == "android";
	let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
		return 1
	} else {
		return 2
	}
}

export const _isAndroid = () => {
	let sUserAgent = navigator.userAgent.toLowerCase();
	return sUserAgent.match(/android/i) == "android"
}

export const _isMobile = () => { //  1 手机 2 pc
	return browserRedirect() === 1
}


export const resetLocationUrl = (param = '') => {
	history.replaceState('', '', window.location.origin + window.location.pathname + param)
}

export const isArray = (value) => {
	return Object.prototype.toString.call(value) === '[object Array]'
}

export const isString = (value) => {
	return Object.prototype.toString.call(value) === '[object String]'
}

export const isJSON = (value) => {
	if (typeof value == 'string') {
		try {
			let obj = JSON.parse(value);
			return typeof obj == 'object' && obj
		} catch (e) {
			return false;
		}
	}
}

/**
 * 数据过滤全部
 * @param {*} index
 * @param {*} end
 * @param {*} arr
 * @returns
 */
export const slice = (arr, index = 1, end = -1) => {
	return arr.slice(index, end === -1 ? arr.length : end)
}
export const splice = (arr, index = 1) => {
	return arr.splice(index)
}

export const count = (arr, condition) => {
	let count = 0;
	for (let i = 0; i < arr.length; i++) {
		if (condition(arr[i], i)) {
			count++;
		}
	}
	return count;
}
export const copyObject = (obj) => {
	return JSON.parse(JSON.stringify(obj))
}


/**
 * value转换为label
 * @param {*} val
 * @param {*} arr
 * @param {*} format
 * @returns
 */
export const find2CN = (val, arr, format = {
	key: 'value',
	value: 'label'
}) => {
	let _find = arr.find(item => Number(val) === item[format.key])
	return _find ? _find[format.value] : ''
}

export const findItem = (val, arr, format = 'value') => {
	return arr.find(item => Number(val) === item[format])
}

/**
 * 获取下一个的下标
 * @param list
 * @returns {*}
 */
export const getIndex = (list, key = 'value') => {
	if (!list || !list.length) return 0
	let parse = JSON.parse(JSON.stringify(list))
	parse.sort((a, b) => {
		return b[key] - a[key]
	})
	return parse[0][key] + 1
}

export const groupBy = (array, key) => {
	return array.reduce((result, currentItem) => {
		// 使用 key 的值作为分组的键
		const groupKey = currentItem[key];

		// 如果 result 中不存在这个键，则创建一个数组
		if (!result[groupKey]) {
			result[groupKey] = [];
		}

		// 将当前项推入对应的分组数组中
		result[groupKey].push(currentItem);

		return result;
	}, {});
}

export const groupByArray = (array, key) => {
	return array.reduce((result, currentItem) => {
		// 使用 key 的值作为分组的键
		const groupKey = currentItem[key] - 1;

		// 如果 result 中不存在这个键，则创建一个数组
		if (!result[groupKey]) {
			result[groupKey] = [];
		}

		// 将当前项推入对应的分组数组中
		result[groupKey].push(currentItem);

		return result;
	}, []);
}
/*
 * 数据过滤全部
 * */
export const formatHtml = (str, replace = '') => {
	const pattern = /<(\S*?)[^>]*>.*?|<.*? > /ig
	return str.replace(pattern, replace).replace(/&nbsp;/ig, "")
}

export const getQueryString = (name) => {
	const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	const r = window.location.search.substr(1).match(reg);
	if (r !== null) return unescape(r[2]);
	return null;
}


export function encodeSearchKey(key) {
	const encodeArr = [{
		code: '%',
		encode: '%25'
	}, {
		code: '?',
		encode: '%3F'
	}, {
		code: '#',
		encode: '%23'
	}, {
		code: '&',
		encode: '%26'
	}, {
		code: '=',
		encode: '%3D'
	}];
	return key.replace(/[%?#&=]/g, ($) => {
		for (const k of encodeArr) {
			if (k.code === $) {
				return k.encode;
			}
		}
	});
}

export async function setLocalStorage(key, value) {
	store.state[key] = value
}


export function getLocalStorage(key, defaultValue = '') {
	let value = store.state[key]
	return value ? copyObject(value) : defaultValue
}

export function setStore(key, value) {
	store.state[key] = value
}

export function getStore(key, defaultValue = '') {
	let value = store.state[key]
	return value ? copyObject(value) : defaultValue
}


export function getSmsCount(msg, m_num) {
	if (!msg) return 0
	return Math.ceil(getByteLen(msg) / 140) * m_num
}
export function getByteLen(msg) {
	let len = 0;
	for (let i = 0; i < msg.length; i++) {
		let a = msg.charAt(i);
		if (a.match(/[^\\x00-\\xff]/ig) != null) {
			len += 2;
		} else {
			len += 1;
		}
	}
	return len;
}

export function formatPrice(num, digit = 2) {
	if (!num) return 0
	return Number(num).toFixed(digit)
}

/**
 * 生成唯一ID
 * @returns {number} 生成的唯一ID
 */
export const generateId = function() {
	return Math.floor(Math.random() * 100000 + Math.random() * 20000 + Math.random() * 5000)
}

// 视频时间转换  hh:mm:ss
export function sToMi(num) {
	var hour = '';
	var minute = (num / 60).toFixed(0)
	var second = num % 60
	if (minute >= 60) {
		hour = (minute / 60).toFixed(0)
		minute = minute % 60
		return hour + ':' + getzf(minute) + ':' + getzf(second)
	} else {
		return getzf(minute) + ':' + getzf(second)
	}
}
//  转换 天 小时
export function SecondToDate(msd) {
	var time = msd
	if (null != time && "" != time) {
		if (time > 60 && time < 60 * 60) {
			time = 1 + "小时";
		} else if (time >= 60 * 60 && time < 60 * 60 * 24) {
			time = parseInt(time / 3600.0) + "小时";
		} else if (time >= 60 * 60 * 24) {
			time = parseInt(time / 3600.0 / 24) + "天" + parseInt((parseFloat(time / 3600.0 / 24) -
				parseInt(time / 3600.0 / 24)) * 24) + "小时";
		}
	}
	return '还剩' + time;
}
//  转换 天 小时 分 秒
export function SecondToDatTime(msd) {
	var time = msd
	if (null != time && "" != time) {
		if (time >= 60 && time < 60 * 60) {
			time = parseInt(time / 60.0) + "分" + parseInt(time % 60) + "秒";
		} else if (time >= 60 * 60 && time < 60 * 60 * 24) {
			time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
					parseInt(time / 3600.0)) * 60) + "分" +
				parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
					parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
		} else if (time >= 60 * 60 * 24) {
			time = parseInt(time / 3600.0 / 24) + "天" + parseInt((parseFloat(time / 3600.0 / 24) -
					parseInt(time / 3600.0 / 24)) * 24) + "小时" + parseInt((parseFloat(time / 3600.0) -
					parseInt(time / 3600.0)) * 60) + "分" +
				parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
					parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
		} else {
			time = parseInt(time) + "秒";
		}
	}
	return time;
}

/*
 * 复制文本到剪贴板 可自定义提示语
 * */
export const copyValue = (text, msg = '复制成功') => {
	uni.setClipboardData({
		data: text,
		success() {
			toast(msg)
		}
	})
}

/*
 * 保存图片到相册
 * 小程序：先取本地路径再写入相册；H5：走浏览器下载
 * */
export const saveImageToAlbum = (filePath) => {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		let link = document.createElement('a')
		link.href = filePath
		link.download = 'qrcode.png'
		link.click()
		resolve()
		// #endif

		// #ifndef H5
		uni.getImageInfo({
			src: filePath,
			success: (info) => {
				uni.saveImageToPhotosAlbum({
					filePath: info.path,
					success: () => resolve(),
					fail: (e) => reject(e)
				})
			},
			fail: (e) => reject(e)
		})
		// #endif
	})
}

/*
 * 查询相册写入权限 未询问过视为可用
 * */
export const checkAlbumAuth = () => {
	return new Promise((resolve) => {
		// #ifdef MP-WEIXIN
		uni.getSetting({
			success: (res) => {
				resolve(res.authSetting['scope.writePhotosAlbum'] !== false)
			},
			fail: () => resolve(true)
		})
		// #endif

		// #ifndef MP-WEIXIN
		resolve(true)
		// #endif
	})
}

export function copyText(text) {

	uni.setClipboardData({
		data: text,
		success() {
			uni.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000
			});
		},
		fail() {
			uni.showToast({
				title: '复制失败',
				icon: 'none',
				duration: 2000
			});
		}
	})
}