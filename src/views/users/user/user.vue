<template>
  <div id="i-user-manage">
    <Row :gutter="10">
      <Col span="4">
        <Card>
          <p slot="title">
            <Icon type="social-buffer"></Icon>
            组织机构
          </p>
          <Row type="flex" justify="start" align="middle">
            <Tree ref="tree" 
              :data="orgList" 
              @on-select-change="onSelect"></Tree>
          </Row>
        </Card>
      </Col>
      <Col span="20">
        <Row :gutter="10">
          <Col span="24" :style="{marginBottom: '10px'}">
            <Card>
              <p slot="title">
                <Icon type="ios-search"></Icon>
                查询条件
              </p>
              <Form ref="formSearch" :model="formSearch" :label-width="75" >
                <Row :gutter="10">
                  <Col span="10">
                    <FormItem label="归属机构">
                      <org-selector ref="orgSelec" v-model="formSearch.orgValue" @on-change="onSearch" level="1"/>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem label="登录名">
                      <Input v-model="formSearch.loginName" @on-change="onSearch"></Input>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem label="姓名">
                      <Input v-model="formSearch.name" @on-change="onSearch"></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="24" :style="{marginBottom: '10px'}">
            <Card>
              <p slot="title">
                <Icon type="ios-list"></Icon>
                数据列表
              </p>
              <div slot="extra">
                <Button type="primary" size="small" icon="person-add" @click="modalAdd = true">添加用户</Button>
                <Modal
                  v-model="modalAdd"
                  title="添加用户信息"
                  @on-ok="onCreate"
                  @on-cancel="onCancel"
                  :styles="{top: '30px'}">
                  <Form ref="formUser" :model="formUser" :rules="rules" :label-width="75">
                    <FormItem label="用户名">
                      <Input v-model="formUser.userName" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="性别">
                      <RadioGroup v-model="formUser.sex">
                        <Radio label="male">男</Radio>
                        <Radio label="female">女</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="身份证号">
                      <Input v-model="formUser.idCard" placeholder="请输入身份证号"></Input>
                    </FormItem>
                    <FormItem label="手机">
                      <Input v-model="formUser.phone" placeholder="请输入手机号"></Input>
                    </FormItem>
                    <FormItem label="邮箱">
                      <Input v-model="formUser.email" placeholder="请输入邮箱"></Input>
                    </FormItem>
                    <FormItem label="所在城市">
                      <Select v-model="formUser.city">
                        <Option value="beijing">北京</Option>
                        <Option value="shanghai">上海</Option>
                        <Option value="shenzhen">深圳</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="归属机构">
                      <org-selector v-model="formUser.orgValue" level="1"/>
                    </FormItem>
                    <FormItem label="密码">
                      <Input type="password" v-model="formUser.password" placeholder="请输入密码"></Input>
                    </FormItem>
                    <FormItem label="用户状态">
                      <Select v-model="formUser.city">
                        <Option value="on">已启用</Option>
                        <Option value="off">停用</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="备注">
                      <Input v-model="formUser.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                    </FormItem>
                  </Form>
                </Modal>
              </div>
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
        </Row>
      </Col>
    </Row>
  </div>
</template>


<script>
  import * as columns from '../../tables/columns/users_columns';  
  import Tree from '../../my-components/tree/tree.vue';
  import orgSelector from '../../my-components/cascade/components/al-selector.vue';
  import Mock from 'mockjs'; // 模拟数据

  Mock.mock('User/users', {
    count: 111,
    'rows|10': [{
      'user_num|+1': 100001,
      'user_name': '@cword(3)',
      'org_name': '@cword(6)',
      'org_num|+1': 124964,
      'postion_name': '@cword(9)',
      'fixed_time': '@datetime',
      'user_state|1-2': true  
    }]
  })

  export default {
    name: 'users_user',
    // 引入组件
    components: {
      Tree,
      orgSelector
    },
    data () {
      return {
        formSearch: {
          orgValue: [],
          loginName: '',
          name: ''
        },
        formUser: {
          userName: '',

        },
        rules: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ]
        },
        modalAdd: false,
        userColumns: [].concat(columns.user_columns,
          [{
              key: 'user_state',
              title: '状态',
              width: 130,
              render: (h, params) => {
                const row = params.row;
                const color = row.user_state === true ? 'green' :  'red';
                const text = row.user_state === true ? '已启用' :  '禁用';

                return h('Tag', {
                  props: {
                    type: 'dot',
                    color: color
                  }
                }, text);
              }
            },{
            key: 'operator',
            title: '操作',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.dir(this)
                      this.onEdit(params.index)
                    }
                  }
                },[
                  h('Icon', {
                    props: {
                        type: 'edit'
                    }
                  })
                ]),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, [
                  h('Icon', {
                    props: {
                        type: 'trash-a'
                    }
                  })
                ]),
              ]);
            }
          }]
        ),
        userList: [],
        totalNum: 100,
        treeSelect: [], // 实际选择的目录
        orgList: []
      };
    },
    methods: {
      // 初始化
      init () {
        // 获取组织机构树
        this.dealTree();
        // 获取用户列表
        this.getUserList();
      },
      // 处理左侧组织机构菜单
      dealTree () {
        // 获取组件机构信息
        let orgData = JSON.parse(localStorage.getItem('org')),
            companyData = orgData['company'];
        
        // 按格式整理数据
        for(let key of Object.keys(companyData)) {
          let orgObj = {};
          orgObj.title = companyData[key];
          orgObj.expand = true;
          orgObj.children = [];

          for(let dep of Object.keys(orgData[key])) {
            let depObj = {};
            depObj.title = orgData[key][dep];
            orgObj.children.push(depObj);
          };

          // 赋值给Tree组件
          this.orgList.push(orgObj);
        }
      },
      // 获取用户列表
      getUserList (size, num, id) {
        //调用后台接口
        this.$http.get('User/users') //'/api/actdetails/'+ size +'/'+ num +'/'+ id)
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let users = res.data.rows,
                  user_list = [];
              this.totalNum = res.data.count;

              // 遍历用户列表
              users.forEach(function(user) {
                let _user = {};

                // 格式化用户数据
                for(let key of Object.keys(user)) {
                  if(key !== 'operator') {
                    _user[key] = user[key]; 
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
      },
      // 页码切换回调
      handleCurrentChange (val) {
        console.log(val)
        this.getUserList();
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        console.log(size)
        this.getUserList();
      },
      // 搜索方法
      search (data, argumentObj) {
        let res = data;
        let dataClone = data;
        for (let argu in argumentObj) {
          if (argumentObj[argu].length > 0) {
            res = dataClone.filter(d => {
              return d[argu].indexOf(argumentObj[argu]) > -1;
            });
            dataClone = res;
          }
        }
        return res;
      },
      // 添加用户
      onCreate () {

      },
      // 编辑用户
      onEdit (index) {
        this.$Modal.info({
          title: 'User Info',
          content: `${index}`
        })
      },
      // 删除用户
      onRemove (index) {
        this.splice(index, 1);
      },
      // 取消操作
      onCancel () {
        this.$Message.info('您已取消了操作');
      },
      // 组织机构选择事件
      onSelect (selectedArray) {
        this.formSearch.orgValue = selectedArray;
        this.$refs.orgSelec.$emit('cascade-bridge');
      },
      // 搜索事件
      onSearch () {
        this.userList = this.search(this.userList, {name: this.formSearch.loginName, tel: this.formSearch.name});
      }
    },
    mounted () {
      this.init();
    }
  };
</script>

<style lang="less">
  #i-user-manage {
    .ivu-card {
      .ivu-card-extra {
        top: 10px;
      }
    }
    .ivu-table-small {
      .ivu-table-header {
        table tr th {
          height: 40px;
          padding: 13px 0;
        }
      }
    }
  }

</style>

