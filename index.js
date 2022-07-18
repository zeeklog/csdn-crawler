const request = require('request-promise');
const pinyin = require('./lib/pinyin.lib')
const html2md = require('html-to-md')
const cheerio = require('cheerio');
const {sleep} = require("./lib/tools");
const {uploadImageByStream} = require("./lib/tools");

// let cookiejar = request.jar();
async function csdnCrawler (options, callback){
  if (!options) {
    throw new Error(`options is required!`)
  }
  if (!options.username) {
    throw new Error(`Expect username as String but got : ${options.username} as ${typeof options.username}`)
  }
  options = Object.assign({} , {
    username: '',
    page: 1,
    size: 50,
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
      baseQiNiuCdnApi: 'https://qiniu.meowparty.cn',
      remoteFilePath: '/openStatic',
      isNeedWaterMark: false,
      imageStyleSplitQuote: '&',
      imageStyleName: '',
      accessKey: '', // Qiniu cloud accessKey
      secretKey: '', // Qiniu secretKey
      imageBaseAlt: '' // image base alt message prefix
    }
  }, options)
  // cookiejar.setCookie(`ETHASH=${ADMIN_COOKIE}`, REMOTE_API);
  const responseData = await exec(options, callback)
  return responseData
}

async function exec (options, callback) {
  const RESPONSE_DATA_LIST = [];
  if (options) {
    console.error('>>>>>>  MISSING INIT OPTIONS: ' + options)
  }
  try {
    const pageLink = options.link || initLinkWithParam(options)
    if (!pageLink) console.error(new Error('pageLink can not be blank!!!'))
    console.log(`Start Crawl Page No: ${options.page + 1}： ${pageLink} `)
    const pageData = await getPageData(pageLink);
    if (!pageData) {
      console.error(new Error(`Expect PageData as Object but got ${typeof pageData} as empty`))
    } else {
      const pageDataJson = JSON.parse(pageData)
      console.log('Response Code：', pageDataJson.code)
      if (pageDataJson && Number(pageDataJson.code) === 200) {
        const pageList = pageDataJson.data.list
        if (pageList.length > 0) {
          for (let i =0;i<pageList.length;i++) {
            if (options.sleepTime) {
              // waiting sleep times
              console.info(`Waiting sleep time: ${options.sleepTime} ms`)
              await sleep(options.sleepTime).then(() => {
                console.info(`Sleep Finish! Continue.`)
              })
            }
            const articleContent = pageList[i] || {}
            let baseTitle = pageList[i].title;
            const CRAWL_URL = pageList[i].url;
            const newsAliasTitle = pinyin.match(baseTitle)
            console.log(`Start to Fetch Page Content： ${baseTitle}`)
            const detail = await REQUEST(CRAWL_URL);
            if (!detail) {
              console.log(new Error('Error Occur While Fetch Page Data.'))
              continue
            }
            const $detail = cheerio.load(detail);
            let baseContent = $detail(options.contentNodeIdentify || '#article_content').html()
            const $ = cheerio.load(baseContent);
            // Delete unused element
            $('.xs0').remove();
            $('a').remove();
            // Upload Image to Qi niu cloud
            if (options.qiniu && options.qiniu.accessKey) {
              const allImg = $('img');
              for (let j = 0 ;j < allImg.length; j ++) {
                let newImgItem = ''
                // use zoomfile as img src if valid
                if (allImg[j].attribs.zoomfile) {
                  newImgItem = allImg[j].attribs.zoomfile.split('?')[0]
                  allImg[j].attribs.zoomfile = '#'
                } else  if (allImg[j].attribs.file) {
                  // use file as img src if valid
                  newImgItem = allImg[j].attribs.file.split('?')[0]
                  allImg[j].attribs.file = '#'
                } else {
                  // use default img address
                  newImgItem = allImg[j].attribs.src.split('?')[0]
                }

                // Got file name
                const imageUrlSplit = newImgItem.split('.')
                let imgType = imageUrlSplit[imageUrlSplit.length -1]
                // only support these file type
                if (!options.supportImageType.includes(imgType) ) {
                  imgType = 'jpg'
                }

                const fileName = `${options.imagePrefixName}${Math.random().toString(16).substr(2)}.${imgType}`
                const stream = request(newImgItem);
                allImg[j].attribs = {
                  alt: '',
                  src: ''
                }
                allImg[j].attribs.alt = `${options.qiniu.imageBaseAlt}-${baseTitle}`
                allImg[j].attribs.src = await uploadImageByStream(stream, fileName, options).catch(e => {
                  console.log(e)
                })
                // Image style: like watermark and etc.
                allImg[j].attribs.src = allImg[j].attribs.src + options.qiniu.isNeedWaterMark ?
                    `${options.qiniu.imageStyleSplitQuote}${options.qiniu.imageStyleName}` : ''
              }
            }

            // Get Html Content String
            const newContent = $.html()
            articleContent['alias'] = newsAliasTitle
            articleContent['content'] = html2md(newContent)
            // articleContent = {
            //     "title": "",
            //      alias: '',
            //      content: ''
            //      description: '',
            //     "url": "https://blog.csdn.net/weixin_45534242/article/details/124653788",
            //     "type": 1,
            //     "top": true,
            //     "forcePlan": false,
            //     "viewCount": 1275,
            //     "commentCount": 37,
            //     "editUrl": "https://mp.csdn.net/console/editor/html/124653788",
            //     "postTime": "2022-05-08 22:23:12",
            //     "diggCount": 1,
            //     "formatTime": "2022.05.08"
            // }
            RESPONSE_DATA_LIST.push(articleContent)
          }
        }
      }
    }
    callback && callback(RESPONSE_DATA_LIST);
    return RESPONSE_DATA_LIST
  } catch (e) {
    console.log('Crawl article fail，fail message: ' )
    console.error(new Error(e))
  }
}

/**
 * 请求封装
 * @description 再发送请求前注入cookie
 * @description csdn获取推荐文章列表中，log_id_view写入了cookie
 * **/
async function REQUEST (options) {
  // options.jar = cookiejar
  options.timeout = 10000
  // eslint-disable-next-line no-undef
  return new Promise(function (resolve, reject) {
    const send = request(options);
    resolve(send)
  });
}

/**
 * 初始化每个连接参数
 * **/
function initLinkWithParam (options) {
  return `https://blog.csdn.net/community/home-api/v1/get-business-list?page=${options.page}&size=${options.size}&businessType=${options.businessType}&orderby=&noMore=false&year=&month=&username=${options.username}`
}

/**
 * Crawl page content
 * @description use to crawl page content, this will return a text content (with html string) about the page
 * **/
async function getPageData (api, startId, cateId) {
  if (!api) {
    console.error('【 api can not be null 】')
    return false
  }
  console.log('====== Starting Crawl =====')
  console.log(`Crawl Target：${api}`)
  const options = {
    uri: api,
    method: 'GET',
    // json: true,
    header: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
    },
    timeout: 10000
  }
  return await request(options)
      .catch((err) => {
        console.log(err.statusCode)
      })
}

module.exports=csdnCrawler
