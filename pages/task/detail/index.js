const App = getApp()

Page({
    data: {
        order: {},
        is_daigou: !true,
        total_price: 0,
    },
    onLoad(order) {
      console.log(order);
      console.log(order.order)
      this.setData({
        order: JSON.parse( order.order),
        is_daigou: order.is_daigou == 'true'
      })
      console.log(order.is_daigou)
      console.log(this.data.is_daigou)
      if (this.data.is_daigou){
        let that = this.data.order
        this.setData({
          total_price: (that.task_price-0) + (that.daigou_price-0)
        })
        console.log("------------")
      }else{
        let that = this.data.order
        this.setData({
          total_price: that.task_price
        })
      }
    },
    onShow() {
        
    },
    getOrderDetail(id) {
        // App.HttpService.getOrderDetail(id)
        this.order.getAsync({id: id})
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                this.setData({
                    'order.item': data.data
                })
            }
        })
    },
})