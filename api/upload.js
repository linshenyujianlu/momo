import {
	UP_FILE_PATH
} from '@/config/index.js'


/**
 * upload方法，对应upload请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function uploadFile(file, name, formData) {
	return upload(file, name, formData, {})
}


const upload = function(file, name, formData, header) {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: UP_FILE_PATH + '/api/Upload/upload',
			filePath: file,
			name: name,
			formData: formData,
			header: header,
			success: (res) => {
				if (JSON.parse(res.data).code === 200) {
					resolve(JSON.parse(res.data))
				} else {
					resolve({
						status: 400,
						msg: '上传失败'
					})
				}

			},
			fail() {
				resolve({
					status: 500,
					msg: '连接异常，请重试'
				})
			}
		});
	})
}