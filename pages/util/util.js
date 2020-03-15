function WxRequrst(){
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
        success: function (result) {
            console.log(result.data)
            if (!result.data) {
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

        fail: function (res) {
            console.log("fail")
            App.WxService.showModal({
                title: '友情提示',
                content: '登陆失败，请重新登录',
                showCancel: !1,
            })
        }
    })
}