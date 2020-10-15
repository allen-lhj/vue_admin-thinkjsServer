const jsonwebtoken = require('jsonwebtoken');
module.exports = class extends think.Controller {
  __before() {

  }

  // JWT跨域身份验证方案
  // 1用户发送用户名和密码
  // 2验证用户名和密码，保存验证信息
  // 3返回口令给到前端
  // 4前端将口令保存起来
  // 5下次发送请求的时候，将口令在发送给服务器
  // 6服务器可以验证口令，判断用户的信息和登陆状态
  // 更新口令

  authFail() {
    this.json({error: 'JWT校验失败'});
    return false;
  }

  checkAuth() {
    // 在请求头中携带token,前端每次请求要把token从缓存中取出来放到请求头中
    const token = this.ctx.headers['x-token'];
    // 在jwt中提取三个配置: 加密，cookie， 保存时间
    const {secret, cookie, expire} = this.config('jwt');

    try {
      // 解析token，如果token是有效的解析后可以得到用户名
      var tokenObj = token ? jsonwebtoken.verify(token, secret) : {};
      // 通过ctx.state将数据传递到controller中的某个方法
      this.ctx.state.username = tokenObj.name;
    } catch (error) {
      return this.authFail();
    }
    // 如果验证失败
    if (!tokenObj.name) {
      return this.authFail();
    }

    this.updateAuth(token.name);
  }
  // 验证成功更新token
  updateAuth(userName) {
    const userInfo = {
      name: userName
    };
    const {secret, cookie, expire} = this.config('jwt');
    const token = jsonwebtoken.sign(userInfo, secret, { expiresIn: expire });
    this.cookie(cookie, token);
    this.header('authoriztion', token);
    return token;
  }
};
