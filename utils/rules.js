export const reg_id_number = '(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)'
export const reg_web =
	'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_+.~#?&=]*)'
export const reg_html = /<(\S*?)[^>]*>.*?|<.*? > /ig


export const reg_phone_format=/(\d{3})\d{4}(\d{4})/
export const reg_phone=/^1[0-9]{10}$/
export const reg_password=/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,20}$/
export const reg_idcard=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
export const reg_email=/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
export const reg_number =/^\d+(\.\d{1,2})?$/
export const reg_money = /(^[0-9]([0-9]{1,7})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
export const reg_chinese =/^[\u4e00-\u9fa5]{0,}$/
export const reg_eng =/^[A-Za-z]+$/
export const reg_qq =/[1-9][0-9]{4,8}/
export const reg_car=/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/



export const checkRules = (pattern, value) => {
	return RegExp(pattern).test(value)
}

export const checkTel = (tel) => { //验证手机号
	return checkRules(reg_phone, tel)
}