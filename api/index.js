import vue from 'vue'
import {
	post,
	get
} from './request.js'
import {
	LocalStorage
} from "@/config";
import store from '@/store/index'
/*
 * 获取城市
 * */
export const queryProvinceList = () => get('/api/zhkt/region/queryProvinceList.do', {

})

/*
 * 登录
 * */
export const login = (telPhone, telVerifyCode, type) => post(`/api/login/appLogin.do`, {
	telPhone,
	telVerifyCode,
	type
}, {
	'content-type': 'application/x-www-form-urlencoded'
})

/*
 * 查询年级列表
 * */
export const queryGradeList = () => get('/api/zhkt/region/queryGradeList.do', {

})

/*
 * 查询科目列表
 * */
export const querySubjectList = (gradeId) => get(`/api/zhkt/course/querySubjectList.do?gradeId=${gradeId}`, {

})

/*
 * 查询课程列表
 * */
export const queryCourseList = (gradeId, subjectId, areaId, keyword, page, limit) => get(
	`/api/zhkt/course/queryCourseList.do?gradeId=${gradeId}&subjectId=${subjectId}&areaId=${areaId}&keyword=${keyword}&pageNum=${page}&pageSize=${limit}`, {

	})

/*
 * 查询课程详情
 * */
export const queryCourseDetail = (courseId) => get(`/api/zhkt/course/queryCourseDetail.do?courseId=${courseId}`, {

})

/*
 * 添加课程到购物车
 * */
export const addToCart = (courseId) => post(`/api/zhkt/cart/addToCart.do`, {
	courseId
})

/*
 * 查询购物车列表
 * */
export const queryCartList = () => get(`/api/zhkt/cart/queryCartList.do`, {

})

/*
 * 从购物车移除课程
 * */
export const removeFromCart = (cartIds) => post(`/api/zhkt/cart/removeFromCart.do`, {
	cartIds
})

/*
 * 校验购物车课程
 * */
export const checkCartCourses = (cartIds) => post(`/api/zhkt/cart/checkCartCourses.do`, {
	cartIds
})

/*
 * 创建订单
 * */
export const createOrder = (cartIds) => post(`/api/zhkt/order/createOrder.do`, {
	cartIds
})

/*
 * 查询订单详情
 * */
export const queryOrderDetail = (orderId) => get(`/api/zhkt/order/queryOrderDetail.do?orderId=${orderId}`, {

})

/*
 * 查询订单列表
 * */
export const queryOrderList = (status, pageNum, pageSize) => get(
	`/api/zhkt/userCenter/queryMyOrders.do?status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`, {

	})

/*
 * 查询可用优惠券
 * */
export const queryAvailableCoupons = (cartIds) => get(
	`/api/zhkt/coupon/queryAvailableCoupons.do?courseIds=${cartIds}`, {

	})

/*
 * 查询订单汇总数量
 * */
export const queryOrderSummary = () => get(`/api/zhkt/userCenter/queryOrderSummary.do`, {

})

/*
 * 个人信息
 * */
export const getUserInfo = () => get(`/api/lc/user/queryUserInfo.do`, {

})

/*
 * 个人信息编辑
 * */
export const saveUserInfo = (picPath, userName, gradeLevel, userType) => get(`/api//lc/user/saveUserInfo.do`, {
	picPath,
	userName,
	gradeLevel,
	userType
})

/*
 * 附近的校区
 * */
export const queryCampusList = (regionId) => get(`/api/zhkt/region/queryCampusList.do?regionId=${regionId}`, {

})

/*
 * 客服信息
 * */
export const queryCustomerService = () => get(`/api/zhkt/userCenter/queryCustomerService.do`, {

})

/*
 * 查询分配的账号
 * */
export const queryAssignedAccounts = (pageNum, pageSize) => get(
	`/api/zhkt/userCenter/queryAssignedAccounts.do?pageNum=${pageNum}&pageSize=${pageSize}`, {

	})

/*
 * 协议
 * */
export const getUserAgreement = () => get(
	`/api/zhkt/config/getUserAgreement.do`, {

	})

/*
 * 获取登录验证码
 * */
export const sendSms = (telPhone) => post(`/api/login/getPhoneVerifyCode.do`, {
	telPhone
}, {
	'content-type': 'application/x-www-form-urlencoded'
})



/*
 * 注册
 * */
export const register = (telPhone, telVerifyCode, type, gender = 'male', gradeLevel = 1, userType = 1) => post(
	`/api/login/register.do`, {
		telPhone,
		telVerifyCode,
		type,
		gender,
		gradeLevel,
		userType
	}, {
		'content-type': 'application/x-www-form-urlencoded'
	})

/*
 * 活动列表
 * */
export const queryActivityList = (campusId, pageNum, pageSize) => get(
	`/api/zhkt/activity/queryActivityList.do?campusId=${campusId}&pageNum=${pageNum}&pageSize=${pageSize}`, {

	})

/*
 * 活动详情
 * */
export const queryActivityDetail = (activityId) => get(
	`/api/zhkt/activity/queryActivityDetail.do?activityId=${activityId}`, {

	})

/*
 报名活动
 * */
export const registerActivity = (activityId, contactName, contactPhone) => post(
	`/api/zhkt/activity/registerActivity.do`, {
		activityId,
		contactName,
		contactPhone
	}, {
		'content-type': 'application/x-www-form-urlencoded',
		'Authorization': store.state[LocalStorage.token] ? store.state[LocalStorage.token] : ''
	})

/*
 * 活动报名列表
 * */
export const queryMyRegistrations = (status, pageNum, pageSize) => get(
	`/api/zhkt/activity/queryMyRegistrations.do?status=${status}&pageNum=${pageNum}&pageSize=${pageSize}`, {

	})