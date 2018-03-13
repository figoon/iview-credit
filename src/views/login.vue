<template>
  <div class="login-wrap"
    @keyup.enter="handleSubmit">
    <div class="ms-title" :class="{'ease-out': easeout}">
      零售信贷管理系统
    </div>
    <div class="ms-login" :class="{'zoom-out': zoomout}">
      <Form
        ref="loginForm" 
        :model="form" 
        :rules="rules">
        <FormItem prop="userName">
          <Input v-model="form.userName" placeholder="请输入用户名">
            <span slot="prepend">
              <Icon :size="16" type="person"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="form.password" placeholder="请输入密码">
            <span slot="prepend">
              <Icon :size="14" type="locked"></Icon>
            </span>
          </Input>
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit" :loading="loading" type="primary" long>
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';

export default {
  data () {
    return {
      easeout: false,
      zoomout: false,
      loading: false,
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 获取网关服务地址
    getStn (name) {
      return this.$http.get('/uaa/stn?userName='+ name);
    },
    // 获取公钥服务地址
    getPublicKey () {
      return this.$http.get('/uaa/public_key');
    },
    handleSubmit () {
      this.loading = true;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 请求服务接口
          this.$http.all([this.getStn(this.form.userName), this.getPublicKey()]) // 将信息发送给后端
            .then(this.$http.spread((stn, pub_key) => {
                if(stn.data.errcode === "0") {
                  // 服务端返回salt
                  let salt = stn.data.data.salt; 
                  // bcrypt加密
                  let hash = bcrypt.hashSync(this.form.password, salt); 
                  
                  if(pub_key.data.errcode === "0") {
                    // sessionStorage.setItem('pubKey',pub_key.data.token); 
                    // rsa加密
                    let rsa = new window.JSEncrypt();
                    let pubKey = pub_key.data.data;
                    if (!pubKey) {
                      this.$Message.error("获取不到公钥，请刷新页面试试");
                    } else {
                      rsa.setPublicKey(pubKey);
                      // rsa加密
                      let hsn = hash + "," + stn.data.data.timeStamp + "," + stn.data.data.nonce;
                      let pwd = rsa.encrypt(hsn);
                      console.dir('最终密码为：'+pwd);

                      let user = {
                        username: this.form.userName,
                        password: pwd
                      };
                      this.$http.post('/poc/login', user) // 将信息发送给后端
                        .then((res) => {
                          if(res.data.errcode === "0") {  // 如果成功
                            sessionStorage.setItem('access_token', res.data.data.access_token); // 用sessionStorage把token存下来
                            // 设置cookie
                            Cookies.set('user', this.form.userName);
                            this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            // 权限测试
                            if (this.form.userName !== 'seadon') {
                              Cookies.set('access', 0);
                            } else {
                              Cookies.set('access', 1);
                            }

                            // 登录成功，显示提示语
                            this.$Message.success('登陆成功！');
                            this.easeout = true;
                            this.zoomout = true;
                            setTimeout(() => {
                              // 进入管理页面，登录成功
                              this.$router.push({
                                name: 'home_index'
                              }); 
                            }, 1800)
                          } else {
                            this.loading = false;
                            sessionStorage.setItem('access_token',null); // 将token清空
                            this.$Message.error(res.data.errmsg);
                          }
                        }, (err) => {
                          this.loading = false;
                          this.$Message.error('请求错误！');
                        })
                    }
                  } else {
                    this.loading = false;
                    this.$Message.error('请求pubKey错误！');
                  }
                  
                }
            }), (err) => {
              this.loading = false;
              this.$Message.error('获取认证服务错误！');
            });
        } else {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="less">
  @import '../styles/login/login.less';
</style>

