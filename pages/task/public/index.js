const App = getApp()

Page({
    data: {
      daigoushow:true,
    	form: {
        title   : '',
        content : '',
        tel: '',
        destination : '', 
        product_location: '',
        comment: '', 
        is_daigou: true,
        daigou_price: null,
        task_price: null,
				school_place: 'south'
      },
        radio: [
            {
            	name: '南校', 
            	value: 'south', 
            	checked: !0, 
            },
            {
            	name: '北校', 
            	value: 'north', 
            },
        ],
    },
    onLoad() {
    	this.WxValidate = App.WxValidate(
			{
			title: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			content:{
				required: true, 
			},
			tel: {
				required: true, 
				tel: true, 
			},
			destination:{
				required: true, 
			},
			product_location:{
				required: true, 
			},
			task_price:{
				required: true, 
				number: true,
				min: 0
			},
		}, {
			title: {
				required: '请输入任务标题', 
			},
			content:{
				required: '请输入任务内容', 
			},
			tel: {
				required: '请输您的人电话', 
				tel: '请输入正确的电话号码'
			},
			destination:{
				required: '请输入送达地址', 
			},
			product_location:{
				required: '请输入物品所在地', 
			},
			task_price:{
				required: '请输入跑腿费', 
				number: '跑腿费必须是数字',
				min: '跑腿费必须大于零'
			},
		})

        this.address = App.HttpResource('/address/:id', {id: '@id'})
    },
	radioChange(e) {		 
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		const params = e.detail.value
		const value = e.detail.value
		const radio = this.data.radio
		radio.forEach(n => n.checked = n.value === value)
		this.setData({
			radio: radio, 
			'form.school_place': value, 
		})
	},

  daigou(e)
  {
    this.setData({
      daigoushow: !this.data.daigoushow,
      'form.is_daigou': !this.data.form.is_daigou,
    })
    console.log(this.data.daigoushow)
  },

	submitForm(e) {
		const params = e.detail.value

		console.log(params)
    let data = this.data.form;

		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
			App.WxService.showModal({
				title: '友情提示', 
					content: `${error.msg}`, 
					showCancel: !1, 
			})
			//return false
		} 

    wx.navigateTo({
      url: '../confim/index?order='+JSON.stringify(params) + '&is_daigou='+data.is_daigou,
    })
    wx.setStorage({
      key: 'public_task',
      data: params,
    })
    // wx.request({
    //   url: App.server.basePath + '/add',
    //   method: "POST",
    //   header: { 'content-type': 'application/x-www-form-urlencoded' },
    //   data:this.data.form
    // })
		// App.HttpService.postAddress(params)
    //this.showToast('jjj')
		
	},
	showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
		})
		.then(() => App.WxService.navigateBack())
	},
	chooseLocation() {
		App.WxService.chooseLocation()
	    .then(data => {
	        console.log(data)
	        this.setData({
	        	'form.address': data.address
	        })
	    })
	},
})