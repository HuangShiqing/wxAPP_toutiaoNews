import { g_contentNewsList } from '../index/index.js';

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
  // 在设置数据前处理内容
  processNewsContent(content) {
    // 将单个换行符替换为双换行符（创建一个空行）
    return content.replace(/\n/g, '\n\n');
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
  onLoad: function(options) {
    let {index} = options
    let data = g_contentNewsList[index]

    const urlArr = data.jpg.split('\n');
    const descArr = data.jpg_desc.split('\n');
    const jpg_dict = urlArr.map((url, idx) => ({
      url: url.trim(),
      description: descArr[idx] ? descArr[idx].trim() : ''
    }));

    this.setData({
      newsDetail: {
        title: data.title,
        lead_jpg: data.lead_jpg, // 图片URL
        lead_jpg_desc: data.lead_jpg_desc, // 图片描述
        content: this.processNewsContent(data.content),
        publish_time: data.publish_time,
        source: data.source,
        jpg_dict: jpg_dict,
        category_processed: data.category_processed
      }
    });

    // // 模拟数据
    // setTimeout(() => {
    //   this.setData({
    //     newsDetail: {
    //       title: '人工智能助力医疗行业发展',
    //       lead_jpg: 'https://static01.nyt.com/images/2025/10/20/multimedia/17Biz-China-Factories-01-tcbj/17Biz-China-Factories-01-tcbj-master1050.jpg', // 图片URL
    //       lead_jpg_desc: 'AI技术在医疗诊断中的应用场景', // 图片描述
    //       content: this.processNewsContent('近年来，人工智能技术在医疗领域的应用越来越广泛。从辅助诊断到药物研发，AI正在改变传统医疗模式...\n测试换行符'),
    //       publish_time: '2024-01-15 10:30:00',
    //       category_processed: '科技日报',
    //       source: '新华网',
    //       jpg_dict: [{url: 'https://static01.nyt.com/images/2025/10/20/multimedia/17Biz-China-Factories-gvhw/17Biz-China-Factories-gvhw-master1050.jpg',description: 'test1'},{url: 'https://static01.nyt.com/images/2025/10/17/multimedia/17Biz-China-Factories-05-tcbj/17Biz-China-Factories-05-tcbj-master1050.jpg',description: 'test2'}]
    //     }
    //   });
    // }, 500);
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