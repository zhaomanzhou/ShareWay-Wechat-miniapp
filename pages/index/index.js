const App = getApp()

Page({
    data: {
        school_choice:"north",
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
        imgUrls: [
            'http://m.qpic.cn/psb?/V103h8rK0TKoBI/6ffgqbNhtfj4x3wCiavPvg6VSyYJakV9y7MBqsAu7J4!/b/dL8AAAAAAAAA&bo=GwSWAgAAAAADB6k!&rf=viewer_4',
            'http://m.qpic.cn/psb?/V103h8rK0TKoBI/Gq3lED49R9HrCErP42ES0vZDpVN0VFcvDY7IY8Z1H9E!/b/dDcBAAAAAAAA&bo=EwSdAgAAAAADN5o!&rf=viewer_4',
            'http://m.qpic.cn/psb?/V103h8rK0TKoBI/DwDolnkhdbplAA*z4.YXM.ff4neZN7NvC8UXF91gDoE!/b/dMEAAAAAAAAA&bo=IASvAgAAAAADN5s!&rf=viewer_4'
        ],
        navList: [{
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
        s_style: "weui-form-preview__btn weui-form-preview__btn_default",
        task_list:[]
    },

    onLoad() {
        var that = this;
        //获取系统的参数，scrollHeight数值,微信必须要设置style:height才能监听滚动事件
        wx.getSystemInfo({
            success: function(res) {
                console.log(res.windowHeight)
                that.setData({
                    scrollHeight: parseInt(res.windowHeight) - 230
                })
            }
        });
    },
    onShow() {
        let that = this;
        wx.request({
            url: App.server.basePath + '/task/all/simple',
            method: "GET",
            header: {
                'content-type': 'json'
            },

            success: function(result) {

                console.log(result.data.data);
                that.setData({
                    task_list: result.data.data
                })
            }
        })
    },

    detail(e){
        console.log(e.currentTarget.id)
        let id = e.currentTarget.id;
        wx.navigateTo({
            url: '/pages/task/detail/index?task='+ this.getTaskById(id)
        })
    },

    getTaskById(id){
        let list = this.data.task_list;
        for(var j = 0; j < list.length; j++){
            if(list[j].id == id){
                return JSON.stringify(list[j])
            }

        }
    },

    initData() {
        const type = this.data.goods.params && this.data.goods.params.type || ''
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
            goods: goods
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },



    getList() {
        const goods = this.data.goods
        const params = goods.params

        // App.HttpService.getGoods(params)
        this.goods.queryAsync(params)
            .then(res => {
                const data = res.data
                console.log(data)
                if (data.meta.code == 0) {
                    data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
                    goods.items = [...goods.items, ...data.data.items]
                    goods.paginate = data.data.paginate
                    goods.params.page = data.data.paginate.next
                    goods.params.limit = data.data.paginate.perPage
                    this.setData({
                        goods: goods,
                        'prompt.hidden': goods.items.length,
                    })
                }
            })
    },

    //页面下拉刷新
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        //this.initData()
        //this.getList()
        this.onShow();
    },

    changeStyle(id) {
        if (id == "1") {
            this.setData({
                n_style: "weui-form-preview__btn weui-form-preview__btn_primary",
                s_style: "weui-form-preview__btn weui-form-preview__btn_default",
                school_choice:"north"
            })
        } else if (id == "2") {
            this.setData({
                s_style: "weui-form-preview__btn weui-form-preview__btn_primary",
                n_style: "weui-form-preview__btn weui-form-preview__btn_default",
                school_choice: "south"
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



    detailPage() {
        wx.navigateTo({
            url: '/pages/index/detail/detail',
        })
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