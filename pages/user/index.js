const App = getApp()

Page({
	data: {
		userInfo: {},
		items: [
			{
				icon: '../../assets/images/icon_public_active.png',
				text: '我的发布',
				path: '/pages/my/public/index'
			}, 
			{
				icon: '../../assets/images/get.png',
				text: '我的接单',
				path: '/pages/my/get/index'
			}, 
            {
                icon: '../../assets/images/iconfont-user-active.png',
                text: '我的信息',
                path: '/pages/my/info/index'
            }, 
			{
				icon: '../../assets/images/iconfont-kefu.png',
				text: '联系客服',
				path: '18521708248',
			}, 
            {
                icon: '../../assets/images/iconfont-about.png',
                text: '关于行享',
                path: '/pages/my/about/index'
            }, 

		]
	},
	onLoad() {
		this.getUserInfo()
		this.getStorageInfo()
	},
	navigateTo(e) {
		const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path

		switch(index) {
			case 3:
				App.WxService.makePhoneCall({
					phoneNumber: path
				})
				break
			default:
				App.WxService.navigateTo(path)
		}
    },
    getUserInfo() {
    	const userInfo = App.globalData.userInfo

		if (userInfo) {
			this.setData({
				userInfo: userInfo
			})
			return
		}

		App.getUserInfo()
		.then(data => {
            console.log(data)
			this.setData({
				userInfo: data
			})
		})
    },
    getStorageInfo() {
    	App.WxService.getStorageInfo()
    	.then(data => {
    		console.log(data)
    		this.setData({
    			'settings[0].path': `${data.currentSize}KB`
    		})
    	})
    },
    bindtap(e) {
    	const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path

		switch(index) {
			case 0:
				App.WxService.showModal({
		            title: '友情提示', 
		            content: '确定要清除缓存吗？', 
		        })
		        .then(data => data.confirm == 1 && App.WxService.clearStorage())
				break
			default:
				App.WxService.navigateTo(path)
		}
    },
    logout() {
    	App.WxService.showModal({
            title: '友情提示', 
            content: '确定要登出吗？', 
        })
        .then(data => data.confirm == 1 && this.signOut())
    },
    signOut() {
    	App.HttpService.signOut()
    	.then(res => {
    		const data = res.data
    		console.log(data)
    		if (data.meta.code == 0) {
    			App.WxService.removeStorageSync('token')
    			App.WxService.redirectTo('/pages/login/index')
    		}
    	})
    },
})