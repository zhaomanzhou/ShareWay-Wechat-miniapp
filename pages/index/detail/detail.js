const App = getApp()

Page({
    data: {
        scrollHeight: 100,
        activeIndex: 0,
        temp: 0,
        navList: [],
        indicatorDots: !0,
        autoplay: !1,
        current: 0,
        interval: 10000,
        duration: 1000,
        circular: !0,
        goods: {},
        prompt: {
            hidden: true,
        },
        navList: [
            {
                _id: "1",
                name: "北校"
            },
            {
                _id: "2",
                name: "南校"
            }
        ],
        show_swagger: true,
        n_style: "weui-form-preview__btn weui-form-preview__btn_primary",
        s_style: "weui-form-preview__btn weui-form-preview__btn_default"
    },

    onLoad() {
        var that = this;
        //获取系统的参数，scrollHeight数值,微信必须要设置style:height才能监听滚动事件
        wx.getSystemInfo({
            success: function (res) {
                console.log(res.windowHeight)
                that.setData({
                    scrollHeight: parseInt(res.windowHeight) - 50
                })
            }
        });
    },






    //页面下拉刷新
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        //this.initData()
        //this.getList()
    },

    changeStyle(id) {
        if (id == "1") {
            this.setData({
                n_style: "weui-form-preview__btn weui-form-preview__btn_primary",
                s_style: "weui-form-preview__btn weui-form-preview__btn_default"
            })
        } else if (id == "2") {
            this.setData({
                s_style: "weui-form-preview__btn weui-form-preview__btn_primary",
                n_style: "weui-form-preview__btn weui-form-preview__btn_default"
            })
        }
    },

    //点击北校南校按钮
    onReachBottom1(e) {
        let id = e.target.dataset.id;
        //改变选中状态
        this.changeStyle(id);
        console.info(id)

    },



    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        const goods = {
            items: [],
            params: {
                page: 1,
                limit: 10,
                type: type,
            },
            paginate: {}
        }
        this.setData({
            activeIndex: index,
            goods: goods,
        })
        this.getList()
    },


})
