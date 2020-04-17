// 系统变量配置
// const JSESSIONID = '1182b9c425fe49c19f598b444c693cde' // 无机构
const JSESSIONID = '5dfcbdeb84494741942a6f01113c3fcd' // 有机构
// const env = 'development' // 本地
// const env = 'production' // 生产
const env = 'test' // 测试
const config = {
  development: {
    env: 'dev',
    // api: 'http://192.168.1.246:9800', // 鹏飞
    api: 'http://192.168.1.220:9800', // 曹禺
    // api: 'http://192.168.1.199:9801', // 王
    codeUrl: `/mpmct/common/verifycode?random=`, // 验证码
    uploadUrl: 'http://192.168.1.230', // 上传接口
    JSESSIONID,
    appid: 'wx2c6e602f031d05f8'
  },
  test: {
    env: 'test',
    api: 'https://h5.shikra.ichuangye.cn',
    codeUrl: '/mpmct/common/verifycode?random=', // 验证码
    uploadUrl: 'https://file.shikra.ichuangye.cn', // 上传接口
    appid: 'wx2c6e602f031d05f8'
  },
  production: {
    env: 'prod',
    api: 'https://h5.nczgh.com',
    codeUrl: '/wxh5/common/verifycode?random=', // 验证码
    uploadUrl: 'https://file.nczgh.com', // 上传接口
    appid: 'wxd974fbe12741036a'
  }
}
export default config[env]
