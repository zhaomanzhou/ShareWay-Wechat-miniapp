const App = getApp()

Page({
    data: {
        order: {},
        is_daigou: !true,
        total_price: 0,
    },
    onLoad(order) {
        console.log(order.order)
        if (!order.order) {
            order.order = wx.getStorageSync('order')
            console.log("null order")
            order.is_daigou = 'true';
        }else{
            wx.setStorage({
                key: 'order',
                data: order.order,
            })
        }
        console.log(order);
        console.log(order.order)
        
        this.setData({
            order: JSON.parse(order.order),
            is_daigou: order.is_daigou == 'true'
        })
        if (this.data.is_daigou) {
            let that = this.data.order
            this.setData({
                total_price: (that.task_price - 0) + (that.daigou_price - 0)
            })
            console.log("------------")
        } else {
            let that = this.data.order
            this.setData({
                total_price: that.task_price
            })
        }
    },
    submit() {
        let that = this;
        console.log("submit")
        wx.showLoading({
            title: '发布中',
        })
        wx.request({
            url: App.server.basePath + '/task/add',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
                ...that.data.order,
                "is_daigou": that.data.is_daigou,
                "publicUserId": wx.getStorageSync("user_id")

            },
            success: function(result) {
                wx.hideLoading()
                console.log(result);
                if(result.data.status == "200")
                {
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(() => wx.switchTab({
                        url: '/pages/index/index'
                    }), 500)
                }else
                {
                    App.WxService.showModal({
                        title: '友情提示',
                        content: '发布失败',
                        showCancel: !1,
                    })
                    
                }
                
            },
            fail(){
                wx.hideLoading();
                App.WxService.showModal({
                    title: '友情提示',
                    content: '发布失败',
                    showCancel: !1,
                })
            }
        })
    }
})