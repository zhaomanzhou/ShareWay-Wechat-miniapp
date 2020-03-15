const App = getApp()

Page({
    data: {
        show: false,
        contact:'',
        order: {},
        is_daigou: !true,
        total_price: 0,
        tel: "",
        content: "",
        fake_tel: "接单后显示",
        comment: "",
        fake_comment: "接单后显示"
    },
    onLoad(order) {
      console.log(order);
      this.setData({
        order: JSON.parse(order.task),
          is_daigou: JSON.parse(order.task).is_daigou == 'true'
      })
      if (this.data.is_daigou){
        let that = this.data.order
        console.log(that);
        this.setData({
          total_price: (that.taskPrice-0) + (that.daigouPrice-0)
        })
        console.log("------------")
      }else{
        let that = this.data.order
          console.log(that);
        this.setData({
          totalPrice: (that.taskPrice-0)
        })
      }
    },
    onShow() {
        let that  = this;
        wx.request({
            url: App.server.basePath + '/task/' + this.data.order.id,
            method: "GET",
            header: {
                'content-type': 'json'
            },

            success: function (result) {

                console.log(result.data.data);
                that.setData({
                    content: result.data.data.content,
                    tel: result.data.data.tel
                })
            }
        })
    },
   

    showdialog(){
        this.setData({
            show: true
        })
    },
    confim(){
        console.log("confim")
    },

   get(){

      
       let that = this;
       let get_user_id = wx.getStorageSync("user_id");
       let task_id = this.data.order.id;
       console.log(`user_id ${get_user_id}`);
       console.log(`task_id ${task_id}`)
       wx.request({
           url: App.server.basePath + '/taskuser/get',
           method: "POST",
           header: {
               'content-type': 'application/x-www-form-urlencoded',
           },
           data: {
               "get_user_id": get_user_id,
               "task_id": task_id
           },
           success(res){

               wx.showToast({
                   title: '接单成功',
               })
               console.log(res);
               if(res.data.status == "200"){
                   that.setData({
                       fake_tel: that.data.tel,
                       fake_comment: that.data.comment
                   })
               }
           }

       })
   }
})