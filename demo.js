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
    qiniu: {
        zone: '',
        scope: '', // Your qiniu scope name. Storage name.
        useHttpsDomain: true,
        useCdnDomain: true,
        baseQiNiuCdnApi: '',
        remoteFilePath: '/openStatic',
        isNeedWaterMark: false,
        imageStyleSplitQuote: '&',
        imageStyleName: '',
        accessKey: '', // Qiniu cloud accessKey
        secretKey: '', // Qiniu secretKey
        imageBaseAlt: '' // image base alt message prefix
    }
}
csdnCrawler(exampleOptions, data => {
    console.log(`==============================`)
    console.log(`===  Demo Crawl Succeed !!!===`)
    console.log(`==============================`)
    console.log(`Total Data length : ${data.length}`)
})