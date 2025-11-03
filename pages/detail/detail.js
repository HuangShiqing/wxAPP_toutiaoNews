import { g_contentNews } from '../index/index.js';

Page({
  data: {
    newsDetail: {
      title: '',
      lead_jpg: '',        // 封面图片URL
      lead_jpg_desc: '',  // 图片描述
      content: '',
      publish_time: '',
      category_processed: '',
      source: '',
      jpg_dict: []
    },
    currentImageIndex: 0 // 当前显示的图片索引
  },
  // 图片加载失败处理
  onImageError: function(e) {
    console.log('图片加载失败', e.detail.errMsg);
    // 可以设置默认图片
    // this.setData({
    //   'newsDetail.lead_jpg': '/images/default-news.png'
    // });
  },

  // 图片点击预览
  onPreviewImage: function() {
    const imageUrl = this.data.newsDetail.lead_jpg;
    if (imageUrl) {
      wx.previewImage({
        urls: [imageUrl],
        current: imageUrl
      });
    }
  },
  onLoad: function() {
    let data = g_contentNews
    const urlArr = data.jpg.split('\n');
    const descArr = data.jpg_desc.split('\n');
    const jpg_dict = urlArr.map((url, idx) => ({
      url: url.trim(),
      description: descArr[idx] ? descArr[idx].trim() : ''
    })).filter(item => item.url); // 只保留 url 非空项;

    this.setData({
      newsDetail: {
        title: data.title,
        lead_jpg: data.lead_jpg, // 图片URL
        lead_jpg_desc: data.lead_jpg_desc, // 图片描述
        content: data.content,
        publish_time: data.publish_time,
        source: data.source,
        jpg_dict: jpg_dict,
        category_processed: data.category
      }
    });

  },
  // 轮播图切换事件
  onEndImageSwipe: function(e) {
    const current = e.detail.current;
    this.setData({
      currentImageIndex: current
    });
  },

  // 预览末尾图片
  onPreviewEndImage: function() {
    const images = this.data.newsDetail.jpg_dict;
    const currentIndex = this.data.currentImageIndex;
    const urls = images.map(item => item.url);
    
    wx.previewImage({
      urls: urls,
      current: urls[currentIndex]
    });
  }
})