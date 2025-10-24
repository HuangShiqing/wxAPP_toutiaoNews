const app = getApp()
const request = require('../../utils/request.js')
const shuffle = require('./utils/shuffle.js')

export let g_contentNewsList = [];

Page({
  data: {
    headerTitleName: [
      { name: '财经', nameID: '201701', newsType: 'business' },
      { name: '国际', nameID: '201702', newsType: 'world' },
    ],
    swiperIndex: '1/4',
    tapID: 201701, // 判断是否选中
    contentNewsList: [],
    showCopyright: false,
    refreshing: false
  },

  onLoad: function() {
    this.renderPage('business', false, () => {
      this.setData({
        showCopyright: true
      })
    })
  },

  // headerBar 点击
  headerTitleClick: function(e) {
    this.setData({ tapID: e.target.dataset.id })
    this.renderPage(e.currentTarget.dataset.newstype, false)
  },

  //跳转到新闻详情页
  viewDetail: function(e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../detail/detail?index=' + index
    })
  },

  handleSwiperChange: function(e) {
    this.setData({
      swiperIndex: `${e.detail.current + 1}/4`
    })
  },

  onPulldownrefresh_SV() {
    this.renderPage('business', true, () => {
      this.setData({
        refreshing: false
      })
    })
  },
  formatDateUTC(datas) {
    function parseToIOSCompatibleDate(dateStr) {
      // 通用方案：利用正则或Date.parse兼容地提取日期部分
      // 格式示例：Wed, 22 Oct 2025 00:00:00 GMT
      const arr = dateStr.match(/\w{3}, (\d{2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT/);
      if (!arr) return null;
    
      const months = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
    
      const yyyy = arr[3];
      const MM = months[arr[2]];
      const dd = arr[1];
      const HH = arr[4];
      const mm = arr[5];
      const ss = arr[6];
    
      // ISO8601的UTC日期字符串：2025-10-22T00:00:00Z
      return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}Z`;
    }
    datas.forEach(data => {
      let str = parseToIOSCompatibleDate(data.publish_time);
      const date = new Date(str);
    
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      const hour = date.getUTCHours().toString().padStart(2, '0');
      const min = date.getUTCMinutes().toString().padStart(2, '0');

      data.publish_time = `${month}月${day}日 ${hour}:${min}`;
    })
    return datas;
  },
  // isRefresh 是否为下拉刷新
  renderPage: function(newsType, isRefresh, calllBack) {
    if (!isRefresh) {
      wx.showLoading({
        title: '加载中'
      })
      request({ url: `/api/news?category=${newsType}&num=30`})
        .then(res => {
          wx.hideLoading()
          let articleList = this.formatDateUTC(res.result.data)
          this.setData({
            contentNewsList: articleList,
          })
          g_contentNewsList = articleList

          if (calllBack) {
            calllBack()
          }
        })
        .catch(error => {
          wx.hideLoading()
        })
    } else {
      // 数组随机排序，模拟刷新
      let contentNewsListTemp = shuffle(JSON.parse(JSON.stringify(this.data.contentNewsList)))
      /* contentNewsListTemp.sort(() => {
        return Math.random() > 0.5 ? -1 : 1
      }) */
      setTimeout(() => {
        this.setData({
          contentNewsList: contentNewsListTemp
        })
        if (calllBack) {
          calllBack()
        }
      }, 2000)
    }
  }
})
