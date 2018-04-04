<template>
  <div id="i-users-flow">
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
                    <FormItem label="流程名称" :label-width="90">
                      <Input v-model="formSearch.procDefName"></Input>
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
                <Button type="primary" size="small" icon="person-add" @click="onAdd">添加流程</Button>
                <Modal
                  v-model="modalDict"
                  title="添加流程信息"
                  :styles="{top: '30px'}">
                  <Form ref="formFlow" :model="formFlow" :label-width="100">
                    <Upload
                      multiple
                      type="drag"
                      action="//jsonplaceholder.typicode.com/posts/">
                      <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或者拖拽jar包到此</p>
                      </div>
                    </Upload>
                  </Form>
                  <div slot="footer">
                    <Button type="primary" size="large" long @click="onConfirm">确定</Button>
                  </div>
                </Modal>
              </div>
              <Table :columns="dictColumns" :data="flowList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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
  import * as columns from '../../tables/columns/flow_columns';  

  export default {
    name: 'flow_manage',
    data () {
      return {
        totalNum: 100,
        size: 10,
        num: 1,
        formSearch: {
          procDefName: ''
        },
        formFlow: {
          procDefName: ''
        },
        modalDict: false,
        dictColumns: [].concat(columns.deploy_columns,
          [{
            key: 'operator',
            title: '操作',
            width: 150,
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
                      this.onHalt(params.row.procDefId)
                    }
                  }
                },[
                  h('Icon', {
                    props: {
                      type: 'alert-circled'
                    }
                  }),
                  ' 挂起'
                ]),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.onRemove(params.row.deployMentId)
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
        flowList: []
        
      };
    },
    methods: {
      // 初始化
      init () {
        // 获取流程列表
        this.getFlowList(this.size, this.num);
      },
      // 获取流程列表
      getFlowList (size, num, name) {
        //调用后台接口
        this.$http.post('/poc/bpm/deploylist', {
          data: {
            procDefName: name || ''
          },
          pageNum: num,
          pageSize: size
        })
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let flows = res.data.data.list,
                  flow_list = [];
              this.totalNum = res.data.data.total;
              flow_list = this.dealFlow(flows, flow_list);

              this.flowList = flow_list;
						} else{
							this.$Message.error('获取流程信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 格式化贷款数据
      dealFlow (flows, arr) {
        // 遍历用户列表
        flows.forEach(function(flow) {
          let _flow = {};

          // 格式化贷款数据
          for(let key of Object.keys(flow)) {
            if(key !== 'operator') {
              _flow[key] = flow[key]; 
            }
          };

          // 添加到用户列表数组中
          arr.push(_flow);
        }, this);

        return arr;
      },
      // 添加流程
      onAdd () {
        this.$refs['formFlow'].resetFields();
        this.isAdd = true;
        this.modalDict = true;
      },
      // 添加流程确定
      onAddConfirm () {
        this.$http.post('/poc/positon/creatPosition', {
          orgNum: this.formFlow.orgNum,
          orgName: this.formFlow.orgName,
          positionPermission: this.formFlow.positionPermission,
          procDefName: this.formFlow.procDefName,
          organization: {
            orgName: this.formFlow.orgName,
            orgNum: this.formFlow.orgNum
          },
          userCd: this.formFlow.userCd
        })
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              this.$Message.success(res.data.errmsg);
              this.getFlowList(this.size, this.num);
            }
          }, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 流程挂起
      onHalt (id) {
        this.$http.post('/poc/bpm/update/suspend?procDefId='+ id)
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              if(res.data.errcode != "0" ) {
                this.$Message.error(res.data.errmsg);
              } else {
                this.$Message.success('挂起流程成功！')
                this.getFlowList(this.size, this.num, this.formSearch.procDefName);
              }
            } else{
							this.$Message.success('挂起流程失败！')
						}
						
          }, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 删除流程
      onRemove (id) {
        this.$http.post('/poc/bpm/delete?deploymentId='+ id)
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              if(res.data.errcode != "0" ) {
                this.$Message.error(res.data.errmsg);
              } else {
                this.$Message.success('删除流程信息成功！')
                this.getFlowList(this.size, this.num, this.formSearch.procDefName);
              }
            } else{
							this.$Message.success('删除流程信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 页码切换回调
      handleCurrentChange (num) {
        this.num = num;
        this.getFlowList(this.size, num, this.formSearch.procDefName);
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        this.size = size;
        this.getFlowList(size, 1, this.formSearch.procDefName);
      },
      // 确定按钮
      onConfirm () {
        this.modalDict = false;
        this.$Message.success('关闭添加流程窗口成功！');
      },
      // 搜索事件
      onSearch () {
        let name =  this.formSearch.procDefName;

        this.getFlowList(this.size, this.num, name);
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

