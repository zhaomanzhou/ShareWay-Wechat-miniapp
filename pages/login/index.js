const App = getApp()

Page({
    data: {
        logged: !1,
    },
    onLoad() {},
    onShow() {
        const token = App.WxService.getStorageSync('token')
        this.setData({
            logged: !!token
        })
        token && setTimeout(this.goIndex, 1500)
    },

    //先getUserInfo然后发送login请求
    bindGetUserInfo(e) {
        console.log(e.detail.userInfo)
        //console.log(e.detail.rawData)
        //console.log(App.server.basePath)
        if (e.detail.userInfo == null) {
            this.showModal();
        } else {
            wx.login({
                success(res) {
                    console.log(res)
                    if (res.code) {
                        wx.request({
                            url: App.server.basePath + '/wxLogin',
                            method: "POST",
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                code: res.code,
                                nickname: e.detail.userInfo.nickName,
                                gender: e.detail.userInfo.gender,
                                avatarUrl: e.detail.userInfo.avatarUrl
                            },
                            success: function(result) {
                                console.log(result.data)
                                if(!result.data){
                                    App.WxService.showModal({
                                        title: '友情提示',
                                        content: '登陆失败，请重新登录',
                                        showCancel: !1,
                                    })
                                    return;
                                }
                                let return_msg = result.data;
                                console.log(result);
                                wx.setStorageSync("token", return_msg.token)
                                wx.setStorageSync("userInfo", e.detail.userInfo)
                                wx.setStorageSync("user_id", return_msg.user_id)
                                console.log(wx.getStorageSync("token"))
                                wx.showToast({
                                    title: '登陆成功',
                                    icon: 'success',
                                    duration: 2500
                                });

                                setTimeout(() => wx.switchTab({
                                    url: '../index/index'
                                }), 500)
                            },

                            fail: function(res) {
                                console.log("fail")
                                App.WxService.showModal({
                                    title: '友情提示',
                                    content: '登陆失败，请重新登录',
                                    showCancel: !1,
                                })
                            }

                        })
                    } else {
                        App.WxService.showModal({
                            title: '友情提示',
                            content: '登陆失败，请重新登录',
                            showCancel: !1,
                        })
                    }
                }
            })
        }
    },

    loginFailed() {
        App.WxService.showModal({
            title: '友情提示',
            content: '登陆失败，请重新登录',
            showCancel: !1,
        })
    },

    login(e) {
        this.signIn(e, this.goIndex)
    },
    goIndex() {
        App.WxService.switchTab('/pages/index/index')
    },
    showModal() {
        App.WxService.showModal({
            title: '友情提示',
            content: '获取用户登录状态失败，请重新登录',
            showCancel: !1,
        })
    },
    wechatDecryptData() {
        let code

        App.WxService.login()
            .then(data => {
                console.log('wechatDecryptData', data.code)
                code = data.code
                return App.WxService.getUserInfo()
            })
            .then(data => {
                return App.HttpService.wechatDecryptData({
                    encryptedData: data.encryptedData,
                    iv: data.iv,
                    rawData: data.rawData,
                    signature: data.signature,
                    code: code,
                })
            })
            .then(data => {
                console.log(data)
            })
    },
    wechatSignIn(cb) {
        if (App.WxService.getStorageSync('token')) return
        App.WxService.login()
            .then(data => {
                console.log('wechatSignIn', data.code)
                return App.HttpService.wechatSignIn({
                    code: data.code
                })
            })
            .then(res => {
                const data = res.data
                console.log('wechatSignIn', data)
                if (data.meta.code == 0) {
                    App.WxService.setStorageSync('token', data.data.token)
                    cb()
                } else if (data.meta.code == 40029) {
                    App.showModal()
                } else {
                    App.wechatSignUp(cb)
                }
            })
    },
    wechatSignUp(cb) {
        App.WxService.login()
            .then(data => {
                console.log('wechatSignUp', data.code)
                return App.HttpService.wechatSignUp({
                    code: data.code
                })
            })
            .then(res => {
                const data = res.data
                console.log('wechatSignUp', data)
                if (data.meta.code == 0) {
                    App.WxService.setStorageSync('token', data.data.token)
                    cb()
                } else if (data.meta.code == 40029) {
                    App.showModal()
                }
            })
    },
    signIn(e, cb) {
        console.log(e)
        if (App.WxService.getStorageSync('token')) return

        // App.HttpService.signIn({
        // 	username: 'admin', 
        // 	password: '123456', 
        // })
        // .then(res => {
        //         const data = res.data
        //         console.log(data)
        // 	if (data.meta.code == 0) {
        // 		App.WxService.setStorageSync('token', data.data.token)
        // 		cb()
        // 	}
        // })
    },
})