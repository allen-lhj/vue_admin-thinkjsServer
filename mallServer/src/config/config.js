// default config
module.exports = {
  workers: 1,
  jwt: {
    secret: 'password',
    cookie: 'jwt-token', // 设置一下cookie的字段，就是取一个名字，和x-token一样
    expire: 3000// 口令有效时间
  }
};
