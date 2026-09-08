/*
 * 花样馒头·轻食工坊 静态数据配置
 * 店铺信息 / 老板微信 / 轮播 / 分类 / 商品 全部收敛到此处维护
 * 接入后端后仅需把静态配置替换为接口数据 页面与联动逻辑无需调整
 * 图片资源命名规则：语义英文名 + 尺寸后缀
 * */

/*
 * 静态资源根路径
 * H5 端跟随打包配置的 publicPath 小程序端固定为根目录
 * 部署到子目录时无需改动任何图片地址
 * */
const ASSET_BASE = (typeof process !== 'undefined' && process.env && process.env.BASE_URL) ? process.env.BASE_URL :
	'/'

	/*
	 * 图片地址统一拼接方法 便于部署到子目录
	 * */
	export const img = (name) => ASSET_BASE + 'static/images/food/' + name

// 店铺信息（上线前统一替换为真实店名与地址）
export const shopInfo = {
	name: '花样馒头·轻食工坊',
	slogan: '花样主食·轻食减脂·退休郭厨在线接单',
	intro: '退休的郭厨师长之闲来无事二次创业。馒头手工现做不加泡打粉，减脂餐按克称重不油炸，希望让你吃得好又不怕胖。',
	storyImage: img('story-800.jpg'),
	businessHours: '07:00 - 20:00',
	pickup: '校内配送',
	address: '传媒学院南门对过福美B区',
	tips: '批量预订建议提前一天预约'
}

// 老板微信（更换二维码或话术时只改此处 三处入口同步生效）
export const contactInfo = {
	qrcode: img('qrcode.png'),
	wechat: 'mantou_food_boss',
	title: '添加老板微信',
	tip: '保存后打开微信扫一扫，从相册选择二维码即可添加好友'
}

// 首页顶部数据条（静态写死 便于老板自行修改）
export const stats = {
	steamed: 32, // 今日现蒸笼数
	fit: 6, // 低卡套餐款数
	served: 2316 // 已服务人次
}

// 头图轮播 type:none 纯展示 / goods 跳商品详情 / category 跳商品页指定分类
export const banners = [{
		image: img('banner.jpg'),
		title: '花样主食·今日现蒸',
		type: 'category',
		target: 'cat_mantou'
	},
	{
		image: img('combo-800.jpg'),
		title: '招牌合集',
		type: 'goods',
		target: 'g3001'
	},
	{
		image: img('fit-bowl-800.jpg'),
		title: '减脂餐·一周计划',
		type: 'category',
		target: 'cat_fit'
	}
]

// 商品分类 联动定位与带参跳转的依据
export const categories = [{
		categoryId: 'cat_mantou',
		name: '花样馒头',
		icon: '🌸',
		sort: 1,
		enabled: true
	},
	{
		categoryId: 'cat_cartoon',
		name: '卡通包',
		icon: '🐻',
		sort: 2,
		enabled: true
	},
	{
		categoryId: 'cat_fit',
		name: '减脂餐',
		icon: '🥗',
		sort: 3,
		enabled: true
	},
	{
		categoryId: 'cat_grain',
		name: '粗粮主食',
		icon: '🌾',
		sort: 4,
		enabled: true
	},
	{
		categoryId: 'cat_bread',
		name: '全麦面包',
		icon: '🍞',
		sort: 5,
		enabled: true
	},
	{
		categoryId: 'cat_pan',
		name: '薄饼卷',
		icon: '🫓',
		sort: 6,
		enabled: true
	},
	{
		categoryId: 'cat_congee',
		name: '杂粮粥',
		icon: '🥣',
		sort: 7,
		enabled: true
	},
	{
		// 无上架商品 用于验证空分类置灰与空态
		categoryId: 'cat_season',
		name: '季节限定',
		icon: '🍓',
		sort: 8,
		enabled: true
	}
]

// 商品列表 badge:招牌 / 新品 / 限量 同一商品最多展示一个 优先级 招牌>新品>限量
// kcal 每份参考热量（千卡）） tags:低脂 / 高蛋白 / 低糖 等
export const goodsList = [{
		goodsId: 'g1001',
		categoryId: 'cat_mantou',
		name: '玫瑰花卷',
		subtitle: '紫薯火龙果汁揉面 好看又好吃',
		price: 18,
		image: img('mantou-flower-800.jpg'),
		badge: '招牌',
		kcal: 180,
		tags: ['低脂', '现蒸'],
		images: [
			img('mantou-flower-800.jpg'),
			img('combo-800.jpg')
		],
		sort: 1,
		status: true,
		specs: [{
				label: '口味',
				value: '紫薯 / 火龙果 / 南瓜'
			},
			{
				label: '数量',
				value: '单只 / 半打 / 一打'
			},
			{
				label: '赏味',
				value: '当日食用最佳'
			}
		],
		detail: [{
				title: '原料',
				content: '紫薯泥 / 火龙果汁 / 南瓜泥调色，中筋面粉加牛奶揉制，不加一滴色素。'
			},
			{
				title: '工序',
				content: '面团低温发酵两两两，现卷现蒸，出锅后十分钟内口感最佳。'
			},
			{
				title: '保存与食用',
				content: '常温保质当天，蒸锅回蒸两分钟恢复松软；冷藏三天内食用完。'
			},
			{
				title: '定制提示',
				content: '十只起可定制颜色与造型（生日、聚会、企业团购请提前两天预约）。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g1002',
		categoryId: 'cat_mantou',
		name: '紫薯双色卷',
		subtitle: '双色面团交叠 卷出层次感',
		price: 16,
		image: img('mantou-cartoon-800.jpg'),
		badge: '新品',
		kcal: 200,
		tags: ['现蒸'],
		images: [
			img('mantou-cartoon-800.jpg')
		],
		sort: 2,
		status: true,
		specs: [{
				label: '口味',
				value: '紫薯牛奶'
			},
			{
				label: '数量',
				value: '单只 / 半打'
			}
		],
		detail: [{
				title: '原料',
				content: '紫薯泥 + 牛奶面团双色交叠，全程不加色素与泡打粉。'
			},
			{
				title: '保存与食用',
				content: '常温当天；冷冻可保存两周，食用前自然解冻并蒸透。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g1003',
		categoryId: 'cat_mantou',
		name: '彩虹蔬菜馒头',
		subtitle: '菠菜 / 胡萝卜 / 紫薯 三色组合',
		price: 15,
		image: img('mantou-flower-800.jpg'),
		badge: '',
		kcal: 160,
		tags: ['低脂', '现蒸'],
		images: [
			img('mantou-flower-800.jpg')
		],
		sort: 3,
		status: true,
		specs: [{
				label: '口味',
				value: '三种蔬菜原色随机'
			}
		],
		detail: [{
				title: '原料',
				content: '现榨菜汁和面，颜色来自蔬菜本身，给不爱吃菜的宝宝也适合。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g1004',
		categoryId: 'cat_mantou',
		name: '红枣核桃卷',
		subtitle: '枣香浓郁 越嚼越香',
		price: 20,
		image: img('grain-bread-800.jpg'),
		badge: '',
		kcal: 220,
		tags: ['现蒸'],
		images: [
			img('grain-bread-800.jpg')
		],
		sort: 4,
		status: true,
		specs: [{
				label: '数量',
				value: '单只 / 半打'
			}
		],
		detail: [{
				title: '原料',
				content: '若羌红枣 + 云南核桃碎，麦香面团里看得见真材实料。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g2001',
		categoryId: 'cat_cartoon',
		name: '小熊豆沙包',
		subtitle: '软萌造型 内馅是细腻豆沙',
		price: 8,
		image: img('mantou-cartoon-800.jpg'),
		badge: '新品',
		kcal: 180,
		tags: ['现蒸'],
		images: [
			img('mantou-cartoon-800.jpg')
		],
		sort: 1,
		status: true,
		specs: [{
				label: '馅料',
				value: '豆沙 / 红豆 / 紫薯'
			},
			{
				label: '数量',
				value: '单只 / 四只装'
			}
		],
		detail: [{
				title: '原料',
				content: '自制豆沙馅用云南红小豆现煮现炒，无防腐剂。'
			},
			{
				title: '保存与食用',
				content: '请当天食用，冷藏不超过两天。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g2002',
		categoryId: 'cat_cartoon',
		name: '小猪草莓包',
		subtitle: '粉粉小猪 内藏草莓果粒',
		price: 9,
		image: img('mantou-cartoon-800.jpg'),
		badge: '招牌',
		kcal: 170,
		tags: ['现蒸'],
		images: [
			img('mantou-cartoon-800.jpg')
		],
		sort: 2,
		status: true,
		specs: [{
				label: '馅料',
				value: '草莓果粒'
			}
		],
		detail: [{
				title: '原料',
				content: '火龙果汁和面做出粉色外衣，草莓果粒夹心看得见。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g3001',
		categoryId: 'cat_fit',
		name: '鸡胸藜麦碗',
		subtitle: '高蛋白低脂 一碗搞定一餐',
		price: 28,
		image: img('fit-bowl-800.jpg'),
		badge: '招牌',
		kcal: 420,
		tags: ['高蛋白', '低脂'],
		images: [
			img('fit-bowl-800.jpg'),
			img('combo-800.jpg')
		],
		sort: 1,
		status: true,
		specs: [{
				label: '主菜',
				value: '香煎鸡胸 / 烟熏鸡胸'
			},
			{
				label: '酱料',
				value: '油醋汁 / 芝麻酱'
			},
			{
				label: '分量',
				value: '约 380g  女生一餐足够'
			}
		],
		detail: [{
				title: '原料',
				content: '当季藜麦  西兰花  小番茄  牛油果  煎蛋  无添加鸡胸肉。'
			},
			{
				title: '工序',
				content: '所有食材每日早上手工处理 称重装碗 不隔夜。'
			},
			{
				title: '保存与食用',
				content: '冷藏保质当日；食用前回温或微波二十秒即可。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g3002',
		categoryId: 'cat_fit',
		name: '烤牛肉时蔬碗',
		subtitle: '安格斯牛肉薄片 烤箱慢烤',
		price: 36,
		image: img('fit-bowl-800.jpg'),
		badge: '',
		kcal: 480,
		tags: ['高蛋白', '低脂'],
		images: [
			img('fit-bowl-800.jpg')
		],
		sort: 2,
		status: true,
		specs: [{
				label: '主菜',
				value: '烤牛肉 / 烤鸡腿'
			}
		],
		detail: [{
				title: '原料',
				content: '安格斯牛肉薄片  紫甘蓝  彩椒  糙米饭。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g3003',
		categoryId: 'cat_fit',
		name: '三文鱼蔬菜碗',
		subtitle: '低温慢煮三文鱼 鲜嫩不腥',
		price: 42,
		image: img('fit-bowl-800.jpg'),
		badge: '新品',
		kcal: 380,
		tags: ['高蛋白', '低脂'],
		images: [
			img('fit-bowl-800.jpg')
		],
		sort: 3,
		status: true,
		specs: [{
				label: '主菜',
				value: '低温三文鱼'
			}
		],
		detail: [{
				title: '原料',
				content: '挪威三文鱼 54°C 低温慢煮一小时  搭配芝麻菜与柠檬。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g4001',
		categoryId: 'cat_grain',
		name: '玉米面窝窝头',
		subtitle: '粗粮主食  饱腹感强',
		price: 6,
		image: img('grain-bread-800.jpg'),
		badge: '',
		kcal: 180,
		tags: ['粗粮', '低脂'],
		images: [
			img('grain-bread-800.jpg')
		],
		sort: 1,
		status: true,
		specs: [{
				label: '数量',
				value: '单只 / 四只装'
			}
		],
		detail: [{
				title: '原料',
				content: '东北细玉米面 + 黄豆面 现磨现蒸。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g4002',
		categoryId: 'cat_grain',
		name: '紫米全麦馒头',
		subtitle: '紫米香浓 膳食纤维丰富',
		price: 10,
		image: img('grain-bread-800.jpg'),
		badge: '招牌',
		kcal: 200,
		tags: ['粗粮', '饱腹'],
		images: [
			img('grain-bread-800.jpg')
		],
		sort: 2,
		status: true,
		specs: [{
				label: '数量',
				value: '单只 / 四只装'
			}
		],
		detail: [{
				title: '原料',
				content: '云南紫米粉 + 全麦粉  不加白砂糖  口感扎实。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g5001',
		categoryId: 'cat_bread',
		name: '原味全麦欧包',
		subtitle: '无油无糖 越嚼越香',
		price: 18,
		image: img('grain-bread-800.jpg'),
		badge: '',
		kcal: 220,
		tags: ['粗粮'],
		images: [
			img('grain-bread-800.jpg')
		],
		sort: 1,
		status: true,
		specs: [{
				label: '分量',
				value: '约 400g / 条'
			},
			{
				label: '保存',
				value: '常温两天 冷冻两周'
			}
		],
		detail: [{
				title: '原料',
				content: '全麦粉  天然酵种  盐  无油无糖。'
			},
			{
				title: '保存与食用',
				content: '切片冷冻 烤箱回温五分钟即可  外脆内软。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g6001',
		categoryId: 'cat_congee',
		name: '南瓜小米糊',
		subtitle: '暖胃早餐首选 香甜绵滑',
		price: 8,
		image: img('congee-800.jpg'),
		badge: '',
		kcal: 150,
		tags: ['粗粮', '暖胃'],
		images: [
			img('congee-800.jpg')
		],
		sort: 1,
		status: true,
		specs: [{
				label: '分量',
				value: '约 350ml'
			}
		],
		detail: [{
				title: '原料',
				content: '贝贝南瓜  山西小米  无糖。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g6002',
		categoryId: 'cat_congee',
		name: '五谷杂粮粥',
		subtitle: '黑米  红豆  薏米  小米  糙米',
		price: 10,
		image: img('congee-800.jpg'),
		badge: '新品',
		kcal: 180,
		tags: ['粗粮'],
		images: [
			img('congee-800.jpg')
		],
		sort: 2,
		status: true,
		specs: [{
				label: '分量',
				value: '约 400ml'
			}
		],
		detail: [{
				title: '原料',
				content: '黑米  红豆  薏米  小米  糙米现煮  不加糖。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	},
	{
		goodsId: 'g7001',
		categoryId: 'cat_pan',
		name: '薄饼鸡胸卷',
		subtitle: '薄饼裹鸡胸 生菜番茄 减脂好搭档',
		price: 15,
		image: img('fit-bowl-800.jpg'),
		badge: '',
		kcal: 320,
		tags: ['高蛋白'],
		images: [
			img('fit-bowl-800.jpg')
		],
		sort: 1,
		status: true,
		specs: [{
				label: '主菜',
				value: '香煎鸡胸'
			}
		],
		detail: [{
				title: '原料',
				content: '现擀薄饼  香煎鸡胸  生菜  番茄  黄瓜。'
			}
		],
		notice: '图片仅供参考 以实物为准'
	}
]

// 空态与默认头像
export const emptyImage = img('empty-steamer-240.png')
export const defaultAvatar = img('avatar-default-432.png')

// 关于我们（静态说明页内容）
export const aboutInfo = {
	intro: '我们是一间藏在大学城的小小主食与轻食工坊，每天现蒸手工馒头，减脂餐按克称重，希望用一份朴实的暖食，陪你好好吃饭。',
	items: [{
			title: '关于图片',
			content: '页面内商品图片均为实物拍摄，因光线、显示器与手工差异，图片仅供参考，以实物为准。'
		},
		{
			title: '关于价格',
			content: '页面展示价格均为参考价，定制款会因尺寸、配料与数量浮动，最终价格以与老板沟通确认为准。'
		},
		{
			title: '关于预订',
			content: '批量订单与生日定制建议提前一天预约，当日单品以门店实际出品为准。'
		},
		{
			title: '关于取餐',
			content: '支持到店自提与校内配送，配送范围与时间请在微信中与老板确认。'
		}
	],
	contact: '有任何问题都可以在微信里直接问老板，看到都会回复。'
}

// 版本号（我的页底部展示）
export const version = 'V2.0.0'