# A Nodejs Crawler for crawling user's article from csdn.com.
> Only for Node.js Application, not work on browser.

- Offer `options.username` will return you the user's article list(default length is 5);
- Upload the Article's image to your own Qiniu Cloud Server when you offer the config: `options.qiniu<object>`
- Offer `options.page`, `options.size` can limit the page and size config for api

### 为什么写这个？ / Why would I code this?

- > I want some data to fill my database for big-data's test, but it seems hard to me to write it myself(because I am so lazy).
- > May be so many coder face the same things like me. So, let me make this job become easier.
- > WARN: This repo is only for test and study, do not use this to run Pressure-Test on csdn.com. 

### 使用指南 / Usages

#### 1、Fill you own config
```javascript
// Example:
const options = {
    username: 'weixin_45534242', // target username
    page: 1, // the page index you are crawling
    size: 5, // page size
    link: '', // the user center article list api, you can find it on csdn.com using: F12
    businessType: 'blog', // crawl article type. only support 'blog' now.
    sleepTime: null, // Unit is: ms. sleep time when you crawling the data, it may save your ip from blocking.
    supportImageType: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'mp4', 'bmp', 'svg'], // support uplaod image
    imagePrefixName: 'crawl-', // upload image name prefix
    contentNodeIdentify: '#article_content', // the html id name in article node
    qiniu: {
        zone: '', // Your qiniu cloud zone
        scope: '', // Your qiniu scope name. Storage name.
        useHttpsDomain: true, // like what you see. this is https setting
        useCdnDomain: true, // config your cdn domain, it use on Article List Image
        baseQiNiuCdnApi: '', // you CDN domain name
        remoteFilePath: '/openStatic', // the folder path where you want to save img
        isNeedWaterMark: false, // if `true`, you will need to offer qiniu image style name, write it below:
        imageStyleSplitQuote: '&', // the quote you use in image src link like: https://qiniu.com/asd.png&scale-my-img
        imageStyleName: '', // your qiniu style name
        accessKey: '', // Qiniu cloud accessKey
        secretKey: '', // Qiniu secretKey
        imageBaseAlt: '' // image base alt message prefix
    }
}
```

#### 2、开始使用csdnCrawler / Fly your code now.
```javascript
// You can find this code on `./demo.js`
const csdnCrawler = require('./index')
const exampleOptions = {
    username: 'weixin_45534242',
    page: 1,
    size: 5,
    link: '',
    businessType: 'blog',
    sleepTime: null, // Unit is: ms
    supportImageType: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'mp4', 'bmp', 'svg'],
    imagePrefixName: 'crawl-',
    contentNodeIdentify: '#article_content',
    qiniu: {}
}

csdnCrawler(exampleOptions, data => {
    console.log(data)
    console.log(`==============================`)
    console.log(`===  Demo Crawl Succeed !!!===`)
    console.log(`==============================`)
    console.log(`Total Data length : ${data.length}`)
})
```

### 再次警告 / FBI WARN AGAIN( to save me from trouble)
- Don't use this for bad purpose.
- It may cause something bad result in CN(Maybe break the law...) and will drive you crazy.
- Plz only use this for testing and study purpose.