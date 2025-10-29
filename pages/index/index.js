const request = require('../../utils/request.js')

export let g_contentNews = [];

Page({
  data: {
    headerTitleName: [
      { name: '财经', newsType: 'business' },
      { name: '国际', newsType: 'world' },
      { name: '科技', newsType: 'technology' },
      { name: '中国', newsType: 'china' },
      { name: '观点', newsType: 'opinion' },
    ],

    pageSize: 10,
    currentType: 'business',
    contentNewsList: {},
    page: {},
    hasMore: {},
  },

  onLoad: function() {
    // 初始化
    this.data.headerTitleName.forEach(item => {
      this.data.contentNewsList[item.newsType] = [];
      this.data.page[item.newsType] = 0;
      this.data.hasMore[item.newsType] = true;
    });

    this.updateNews(this.data.currentType)
    this.renderPage(this.data.currentType)
  },

  // 获取列表数据
  renderPage: function(newsType) {
    this.setData({
      currentType: newsType
    });
  },

  updateNews: function(newsType) {
    if (this.data.hasMore[newsType]) {
      wx.showLoading({
        title: '加载中'
      })
      let offset = this.data.page[newsType] * this.data.pageSize;
      request({ url: `/api/news?category=${newsType}&num=${this.data.pageSize}&offset=${offset}`})
      .then(res => {
        wx.hideLoading()
        let articleList = this.formatDateUTC(res.result.data)

        const oldList = this.data.contentNewsList[newsType] || [];
        this.setData({
          ['contentNewsList.' + newsType]: [...oldList, ...articleList],
          ['hasMore.' + newsType]: articleList.length >= this.data.pageSize,
        });
        this.data.page[newsType] += 1
      })
      .catch(error => {
        wx.hideLoading()
      })
    }
  },

  // 监听滚动到底部
  loadMore() {
    this.updateNews(this.data.currentType)
  },

  // headerBar 点击
  headerTitleClick: function(e) {
    // 首次点击需要拉取数据
    if(this.data.contentNewsList[e.currentTarget.dataset.newstype].length == 0) {
      this.updateNews(e.currentTarget.dataset.newstype)
    }
    this.renderPage(e.currentTarget.dataset.newstype)
  },

  //跳转到新闻详情页
  viewDetail: function(e) {
    let index = e.currentTarget.dataset.index
    g_contentNews = this.data.contentNewsList[this.data.currentType][index]
    wx.navigateTo({
      url: '../detail/detail'
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

      data.publish_time = `${month}月${day}日 ${hour}时`;
    })
    return datas;
  },
})
