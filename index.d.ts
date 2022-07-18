declare module 'csdnCrawler' {
  interface csdnCrawlerOptions {
    username: string,
    page: number,
    size: number,
    link: string,
    businessType: string,
    sleepTime: object, // Unit is: ms
    supportImageType: string,
    imagePrefixName: string,
    contentNodeIdentify: string,
    qiniu: {
      zone: string,
      scope: string, // Your qiniu scope name. Storage name.
      useHttpsDomain: boolean,
      useCdnDomain: boolean,
      baseQiNiuCdnApi: string,
      remoteFilePath: string,
      isNeedWaterMark: boolean,
      imageStyleSplitQuote: string,
      imageStyleName: string,
      accessKey: string, // Qiniu cloud accessKey
      secretKey: string, // Qiniu secretKey
      imageBaseAlt: string // image base alt message prefix
    }
  }

  function csdnCrawler(
    options?: Partial<csdnCrawlerOptions>,
    callback?: Function
  ): string

  export default csdnCrawler
}
