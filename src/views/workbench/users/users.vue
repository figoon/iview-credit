<template>
  <div id="i-workbench-users">
    <Row>
      <Col :md="20" :sm="18">
        <Card>
          <p slot="title">
            <Icon type="ios-list"></Icon>
            数据列表
          </p>
          <Table :columns="userColumns" :data="userList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
            <Row type="flex" justify="end">
              <Col span="20">
                <Page :total="totalNum" show-sizer show-total
                  :style="{float: 'right',marginBottom: '20px'}"
                  :page-size="10"
                  :page-size-opts="[10,20,50,100]"
                  placement="top"
                  @on-change="handleCurrentChange"
                  @on-page-size-change="handleSizeChange">
                </Page>
              </Col>
            </Row>
        </Card>
      </Col>
      <Col :md="4" :sm="6" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="settings"></Icon>
            操作
          </p>
          <div style="text-align:center">
            <i-circle :percent="percent" :size="80" :stroke-color="color">
              <icon v-if="count == 0" type="ios-stopwatch" size="50" style="color:#ccc"></icon>
              <span v-else style="font-size:20px">{{ count }}秒</span>
            </i-circle>
            <ButtonGroup>
              <Button icon="ios-plus-empty" @click="add"></Button>
              <Button icon="ios-minus-empty" @click="minus"></Button>
            </ButtonGroup>
            <Button type="primary" @click="timeing" :loading="loading" long style="margin:10px 0 10px;">定时刷新</Button>
            <Row class="publish-button-con">
              <Button type="primary" @click="handleCustomer('reg')" long style="margin:0 0 10px;">注册客户(总量)</Button>
              <Button type="primary" @click="handleCustomer('add')" long style="margin:0 0 10px;">新增注册客户(当天)</Button>
              <Button type="primary" @click="handleCustomer('access')" long style="margin:0 0 10px;">准入客户(总量)</Button>
              <Button type="primary" @click="handleCustomer('deny')" long style="margin:0 0 10px;">拒绝客户(总量)</Button>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import * as columns from '../../tables/columns/workbench_columns';  
  import util from '@/libs/util.js';

  export default {
    data () {
      return {
        percent: 0,
        count: 0,
        loading: false,
        totalNum: 100,
        userList: [],
        userColumns: columns.user_columns
      }
    },
    mounted () {
      this.init();
    },
    computed: {
      color () {
        let color = '#2db7f5';
        if (this.percent == 100) {
          color = '#5cb85c';
        }
        return color;
      }
    },
    methods: {
      // 初始化
      init () {
        // 获取用户列表
        this.getUserList();
      },
      // 增加定时刷新时间
      add () {
        if (this.count >= 60) {
          return false;
        }
        switch (this.count) {
          case 0:
            this.count = 10;
            this.percent = 10*(10/6);
            break;
          case 10:
            this.count = 20;
            this.percent = 20*(10/6);
            break;
          case 20:
            this.count = 30;
            this.percent = 30*(10/6);
            break;
          case 30:
            this.count = 60;
            this.percent = 60*(10/6);
            break;
          default:
            this.count = 60;
            this.percent = 60*(10/6);
            break;
        }
      },
      // 减少定时刷新时间
      minus () {
        if (this.percent <= 0) {
          return false;
        }
        switch (this.count) {
          case 10:
            this.count = 0;
            this.percent = 0*(10/6);
            break;
          case 20:
            this.count = 10;
            this.percent = 10*(10/6);
            break;
          case 30:
            this.count = 20;
            this.percent = 20*(10/6);
            break;
          case 60:
            this.count = 30;
            this.percent = 30*(10/6);
            break;
        }
      },
      // 定时刷新
      timeing () {
        if(this.count <= 0) {
          this.$Message.error('请设置定时刷新数据的时间！');
          return;
        }
        this.loading = true;

        let countDown = setInterval(() => {
          this.count--;
          this.percent = this.count*(10/6);
          
          // 判断清除定时器
          if(this.count <= 0) {
            this.loading = false;
            clearInterval(countDown);
            // 重新获取数据
            this.getUserList();
          }
        },1000)
      },
      // 客户相关跳转
      handleCustomer (type) {
        util.openNewPage(this, 'workbench_customer');
        this.$router.push({
          name: 'workbench_customer'
        });
        this.$store.commit('setCustomerActive', type);
      },
      // 页码切换回调
      handleCurrentChange (val) {
        this.getUserList();
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        this.getUserList();
      },
      // 获取用户列表
      getUserList (size, num, id) {
        //调用后台接口
        this.$http.get('/poc/visualization/getPocCustomerCount')
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let users = res.data.data,
                  user_list = [];
              this.totalNum = res.data.count;

              // 遍历用户列表
              users.forEach(function(user) {
                let _user = {};

                // 格式化用户数据
                for(let key of Object.keys(user)) {
                  if(key !== 'isCorpCustomer') {
                    _user[key] = user[key]; 
                  } else {
                    if(user[key]=='0') {
                      _user[key] = '自然人客户';
                    } else {
                      _user[key] = '实体经营客户';
                    }
                  }
                };

                // 添加到用户列表数组中
                user_list.push(_user);
              }, this);
              
							this.userList = user_list;
						} else{
							this.$Message.error('获取用户信息失败！')
						}
					}, (err) => {
						this.fullscreenLoading = false;
						this.$Message.error('连接服务器出错！');
					})
      }
    }
  }
</script>