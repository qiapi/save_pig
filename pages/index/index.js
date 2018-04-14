//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    coin: 100,
    level: 1,
    blockWidth: 100,
    faceLeft: 0,
    pigLeft: 0,
    timer: null,
    canNext: false,
    btnText: "下一关",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    screenWidth: wx.getSystemInfoSync().screenWidth
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  startTimer: function (e) {
    let that = this
    let duration = 60-(this.data.level-1) * 5
    console.log(duration)
    if(this.data.coin>0){
      this.data.timer = setInterval(function () {
        that.setData({
          blockWidth: that.data.blockWidth > 0 ? that.data.blockWidth - 1 : 100,
        })
        that.setData({
          faceLeft: that.data.screenWidth * 0.5 * (100 - that.data.blockWidth) / 100,
          pigLeft: that.data.screenWidth * 0.5 * (100 - that.data.blockWidth) / 100
        })
      }, duration);
    }else {
      wx.showModal({
        title: '金币不足',
        content: '快去赚金币吧',
        showCancel: false
      })
    }
  },
  stopTimer: function () {
    if(this.data.coin>0) {
      clearInterval(this.data.timer)
      this.checkWin()
    }
  },
  checkWin: function () {
    if(this.data.blockWidth <=5) {
      this.setData({
        coin: this.data.coin+this.data.level*10,
        canNext: true
      })
      if (this.data.level === 10) {
        this.setData({
          canNext: false,
          btnText: "通关"
        })
        wx.showModal({
          title: '恭喜通关',
          content: '你真棒',
          showCancel: false
        })
      }
      else {
        wx.showModal({
          title: '成功解救居居女孩',
          content: '你真棒',
          showCancel: false
        })
      }
    }
    else {
      wx.showModal({
        title: '居居女孩被吃了',
        content: '哭泣',
        showCancel: false
      })
      this.setData({
        coin: (this.data.coin - this.data.level * 10)>0?this.data.coin - this.data.level*10:0
      })
    }
  },
  nextLevel: function () {
    this.setData({
      level: this.data.level+1,
      canNext: false,
      faceLeft: 0,
      pigLeft: 0,
      blockWidth: 100
    })
  }
})
