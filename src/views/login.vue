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
          <Button @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  data () {
    return {
      easeout: false,
      zoomout: false,
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
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          Cookies.set('user', this.form.userName);
          Cookies.set('password', this.form.password);
          this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
          if (this.form.userName === 'iview_admin') {
            Cookies.set('access', 0);
          } else {
            Cookies.set('access', 1);
          }

          this.easeout = true;
          this.zoomout = true;
          setTimeout(() => {
            // 进入管理页面，登录成功
            this.$router.push({
              name: 'home_index'
            }); 
          }, 1800)
        }
      });
    }
  }
};
</script>

<style lang="less">
  @import '../styles/login/login.less';
</style>

