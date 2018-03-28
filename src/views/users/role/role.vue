<template>
  <div id="i-users-role">
    <Row :gutter="10">
      <Col>
        <Row :gutter="10">
          <Col span="24" :style="{marginBottom: '10px'}">
            <Card>
              <p slot="title">
                <Icon type="ios-search"></Icon>
                查询条件
              </p>
              <Form ref="formSearch" :model="formSearch">
                <Row :gutter="10">
                  <Col span="7">
                    <FormItem label="角色名称" :label-width="90">
                      <Input v-model="formSearch.positonName"></Input>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem label="机构名称" :label-width="90">
                      <Input v-model="formSearch.orgName"></Input>
                    </FormItem>
                  </Col>
                  <Col span="2">
                    <FormItem> 
                      <Button type="primary" @click="onSearch">搜索</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col :style="{marginBottom: '10px'}">
            <Card>
              <p slot="title">
                <Icon type="ios-list"></Icon>
                数据列表
              </p>
              <div slot="extra">
                <Button type="primary" size="small" icon="person-add" @click="onAdd">添加角色</Button>
                <Modal
                  v-model="modalDict"
                  :title="isAdd ? '添加角色信息' : '编辑角色信息'"
                  @on-ok="onConfirm"
                  @on-cancel="onCancel"
                  :styles="{top: '30px'}">
                  <Form ref="formRole" :model="formRole" :rules="rules" :label-width="100">
                    <FormItem label="角色名称" prop="positonName">
                      <Input v-model="formRole.positonName" placeholder="请输入角色名称"></Input>
                    </FormItem>
                    <FormItem label="归属机构" prop="orgName">
                      <Select v-model="formRole.orgName">
                        <Option value="0">1级</Option>
                        <Option value="1">2级</Option>
                        <Option value="2">3级</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="角色权限" prop="positionPermission">
                      <Input v-model="formRole.orgName" placeholder="请输入角色名称"></Input>
                    </FormItem>
                  </Form>
                </Modal>
              </div>
              <Table :columns="dictColumns" :data="roleList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>


<script>
  import * as columns from '../../tables/columns/users_columns';  

  export default {
    name: 'users_role',
    data () {
      return {
        formSearch: {
          positonName: '',
          orgName: ''
        },
        formRole: {
          positonName: '',
          orgName: '',
          codeCd: ''
        },
        rules: {
          userName: [
            { required: true, message: '角色名不能为空', trigger: 'blur' }
          ]
        },
        modalDict: false,
        isAdd: true,
        dictColumns: [].concat(columns.role_columns,
          [{
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
                      this.onEdit(params)
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
                      this.onRemove(params.positionNum)
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
        roleList: []
        
      };
    },
    methods: {
      // 初始化
      init () {
        // 获取角色列表
        this.getRoleList();
      },
      // 获取角色列表
      getRoleList () {
        //调用后台接口
        this.$http.get('/poc/position/getAllPosition')
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let roles = res.data.data,
                  role_list = [];
              this.totalNum = res.data.total;
              role_list = this.dealRole(roles, role_list);

              this.roleList = role_list;
						} else{
							this.$Message.error('获取角色信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 格式化贷款数据
      dealRole (roles, arr) {
        // 遍历用户列表
        roles.forEach(function(role) {
          let _role = {};

          // 格式化贷款数据
          for(let key of Object.keys(role)) {
            if(key !== 'operator') {
              _role[key] = role[key]; 
            }
          };

          // 添加到用户列表数组中
          arr.push(_role);
        }, this);

        return arr;
      },
      // 添加角色
      onAdd () {
        this.$refs['formRole'].resetFields();
        this.isAdd = true;
        this.modalDict = true;
      },
      // 添加角色确定
      onAddConfirm () {
        this.$http.post('/poc/positon/creatPosition', {
          orgNum: this.formRole.orgNum,
          orgName: this.formRole.orgName,
          positionPermission: this.formRole.positionPermission,
          positonName: this.formRole.positonName,
          organization: {
            orgName: this.formRole.orgName,
            orgNum: this.formRole.orgNum
          },
          userCd: this.formRole.userCd
        })
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              this.$Message.success(res.data.errmsg);
              this.getRoleList();
            }
          }, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 编辑角色
      onEdit (params) {
        this.isAdd = false;

        this.formRole.positonName = params.row.positonName;
        this.formRole.orgName = params.row.orgName;

        this.modalDict = true;
      },
      // 编辑角色确定
      onEditConfirm () {
        this.$http.post('/poc/positon/updatePosition', {
          orgName: this.formRole.orgName,
          orgNum: this.formRole.orgNum,
          positionNum: this.formRole.positionNum,
          positionPermission: this.formRole.positionPermission,
          positonId: this.formRole.positonId,
          positonName: this.formRole.positonName,
          userCd: this.formRole.userCd
        })
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              this.$Message.success(res.data.errmsg);
              this.getRoleList();
            }
          }, (err) => {
            this.$Loading.error();
						this.$Message.error('连接服务器出错！');
					})
      },
      // 删除角色
      onRemove (num) {
        this.$http.get('/poc/positon/deletePosition?positionNum='+num)
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              if(res.data.errcode != "0" ) {
                this.$Message.error(res.data.errmsg);
              } else {
                this.$Message.success('删除角色信息成功！')
                this.getRoleList();
              }
            } else{
							this.$Message.success('删除角色信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 确定按钮
      onConfirm () {
        if(this.isAdd) {
          this.onAddConfirm();
        } else {
          this.onEditConfirm();
        }
      },
      // 取消操作
      onCancel () {
        this.$Message.info('您已取消了操作');
      },
      // 搜索事件
      onSearch () {
        let search = {
          orgName: this.formSearch.orgName,
          positonName: this.formSearch.positonName,
        }

        this.getRoleList();
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

