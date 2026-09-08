export const api_config = {
	pro: {
		host: 'https://zhxt.emof.cn',
		file: 'https://zhxt.emof.cn',
	},
	dev: {
		host: 'http://192.168.1.55:30801',
		file: 'http://192.168.1.55:30801'
	}
}
export const img_PATH = 'https://ydpm.yidetimes.com'
export const run_mode = 'dev'
export const BASE_URL = api_config[run_mode].host
//文件地址
export const FILE_PATH_QN = `https://img.emof.cn`
export const FILE_PATH = BASE_URL.replace('/index.php', '')
//文件上传地址
export const FILE_UPLOAD_HOST = `${BASE_URL}api/common/upload`
export const FILE_UPLOAD_HOST_NO_TOKEN = `${BASE_URL}api/index/upload`
export const FILE_UPLOAD_HOST_QN = 'https://upload-z2.qiniup.com/'

export const LocalStorage = {
	token: 'zhxt_token', //token信息
	user: 'zhxt_user', //登录用户信息
	profile: 'food_profile', //主食轻食小程序个人资料（本地缓存）
}

export const localAnStore = [{
		key: LocalStorage.token
	},
	{
		key: LocalStorage.user
	},
	{
		key: LocalStorage.profile
	}
]