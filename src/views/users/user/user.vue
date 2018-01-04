<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="person-stalker"></Icon>
            用户列表
          </p>
          <Tabs>
            <TabPane 
              v-for="(users, key) in userList" 
              :label="key | convertType" 
              :name="key" 
              :key="key">
              <Row>
                <Col 
                  :xs="{ span: 12}" 
                  :lg="{ span: 8}"  
                  v-for='(user, index) in users' 
                  :key='index'>
                  <Card>
                    <div class="media user">
                      <a class="media-avatar pull-left" href="#">
                        <img :src="avatorImage">
                      </a>
                      <div class="media-body">
                        <h3 class="media-title">
                          {{user.name}}
                        </h3>
                        <p>
                          <Button type="primary" shape="circle" size="small" icon="edit" :data-id="index" @click="onEdit($event)">修改</Button>
                          <Poptip
                            confirm
                            title="您确认删除吗？"
                            @on-ok="onDelete"
                            @on-cancel="onCancel">
                            <Button type="error" shape="circle" size="small"  icon="trash-a" :data-id="index">删除</Button>
                          </Poptip>
                        </p>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>

export default {
  name: 'users-user',
  created: function(){
    this.dealUsers()
  },
  data () {
    return {
      userList: {},
      info: {
        name: [{
          user: 'seadon',
          age: '10'
        }]
      }
    };
  },
  computed: {
    avatorImage() {
      return localStorage.avatorImgPath;
    }
  },
  filters: {
    convertType: (type) => {
      switch (type) {
        case 'root':
          return '管理员';
        case 'operator':
          return '操作员';
        case 'guest':
          return '访客';
        default:
          return '未定义';
      }
    }
  },
  methods: {
    // 封装用户数据
    dealUsers() {
      this.$http.get('/api/user')
        .then((res) => {
          if(res.status == 200){
            res.data.forEach(function(element,aindex,arr){
              let users = {};
              users.name = element.user_name;
              users.pwd = element.password;

              users.role = element.role;
              users.role_name = (function() {
                switch(element.role) {
                  case 'root':
                    return '管理员';
                  case 'operator':
                    return '操作员';
                  case 'guest':
                    return '访客';
                };
              })();
              users.hover = 0;
              users.form = 0;

              // 如列表中不存在，则创建列表
              if(!this.userList[element.role]) {
                //this.userList[element.role] = [];
                this.$set(this.userList, element.role, [])
                // 对象push到数组中
                this.userList[element.role].push(users);
              } else {
                this.userList[element.role].push(users);
              }
            }, this)
           
          } else{
            this.$message.error('获取用户信息失败！')
          }
        }, (err) => {
          this.$message.error('连接服务器出错！');
          console.error(err);
        })

    },
    // 编辑用户
    onEdit(e) {
      let target=e.target;
      if(target.nodeName!="BUTTON")
        target=target.parentNode;
      let i = target.getAttribute('data-id');
      console.dir(i)
    },
    // 删除用户
    onDelete() {

      this.$Message.success('删除成功！');
    },
    // 取消操作
    onCancel() {
      console.log('取消')
    }
  }
};
</script>

<style lang="less" scoped>
  .ivu-col {
    padding: 10px;
  }
  .pull-left {
    float: left;
  }
  .media {
    position: relative;
    zoom: 1;
    display: table;
    width: 100%;
      
    &.user {
      -webkit-transition: all .2s ease-in-out;
      -moz-transition: all .2s ease-in-out;
      transition: all .2s ease-in-out;
      border: 1px solid transparent;

      &:hover {
        .media-avatar {
          background: #fff;
          border-color: #bbb;
        }

        .media-body {
          .media-title {
            border-bottom-color: #2d8cf0;
          }
        }
      }
    }

    .media-avatar {
      border: 1px solid rgba(204, 204, 204, 0.5);
      -webkit-border-radius: 50px;
      -moz-border-radius: 50px;
      border-radius: 50px;
      height: 100px;
      width: 100px;
      margin-right: 15px;

      img {
        -webkit-border-radius: 45px;
        -moz-border-radius: 45px;
        border-radius: 45px;
        height: 90px;
        width: 90px;
        margin: 4px;
      }
    }
      
    .media-body {
      overflow: hidden;
      zoom: 1;

      .media-title {
        font-size: 18px;
        line-height: 20px;
        margin: 18px 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #dddee1;
        letter-spacing: 2px;
        transition: border-bottom-color 1s;
      }
    }
  }
</style>

