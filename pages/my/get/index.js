const App = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["全部", "进行中", "已完成"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    task: {}
  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.initData();
  },
  listtap: function (event) {
    var that = this;
    let taskId = event.currentTarget.dataset.category;
    console.log(taskId);
    wx.request({
      url: App.server.basePath + "/taskuser/my/get/status/" + taskId + "?get_status=1",
      method: "PUT",
      header: {
        'content-type': 'json'
      },
      success: function (result) {
        console.log("修改成功");
      }
    })
    this.initData();
  },
  initData() {
    var that=this;
    let user_id = wx.getStorageSync("user_id");
    console.log(user_id);
    wx.request({
      url: App.server.basePath + "/taskuser/my/get/" + user_id,
      method: "GET",
      header: {
        'content-type': 'json'
      },
      success: function(result) {
        console.log(result.data);
        that.setData({
          task: result.data
        });
      },
      fail: function (res) {
        console.log('submit fail');
      }  
      
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});