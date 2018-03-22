<template>
  <div id="i-system-dictionaries">
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
                    <FormItem label="字典大类名称" :label-width="90">
                      <Input v-model="formSearch.codeTypeName"></Input>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem label="字典名称" :label-width="90">
                      <Input v-model="formSearch.codeName"></Input>
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
                <Button type="primary" size="small" icon="person-add" @click="onAdd">添加字典</Button>
                <Modal
                  v-model="modalDict"
                  :title="isAdd ? '添加字典信息' : '编辑字典信息'"
                  @on-ok="onConfirm"
                  @on-cancel="onCancel"
                  :styles="{top: '30px'}">
                  <Form ref="formDict" :model="formDict" :rules="rules" :label-width="100">
                    <FormItem label="字典大类名称" prop="codeTypeName">
                      <Input v-model="formDict.codeTypeName" placeholder="请输入字典大类名称"></Input>
                    </FormItem>
                    <FormItem label="字典大类编号" prop="codeTypeCd">
                      <Input v-model="formDict.codeTypeCd" placeholder="请输入字典大类编号"></Input>
                    </FormItem>
                    <FormItem label="字典名称" prop="codeName">
                      <Input v-model="formDict.codeName" placeholder="请输入字典名称"></Input>
                    </FormItem>
                    <FormItem label="字典编号" prop="codeCd">
                      <Input v-model="formDict.codeCd" placeholder="请输入字典编号"></Input>
                    </FormItem>
                  </Form>
                </Modal>
              </div>
              <Table :columns="dictColumns" :data="dictList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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
  import * as columns from '../../tables/columns/system_columns';  

  export default {
    name: 'system_dictionaries',
    data () {
      return {
        totalNum: 100,
        size: 10,
        num: 1,
        searchObj: {
          codeName: "",
          codeTypeName: "",
        },
        formSearch: {
          codeTypeName: '',
          codeName: ''
        },
        formDict: {
          codeId: '',
          codeTypeName: '',
          codeTypeCd: '',
          codeName: '',
          codeCd: ''
        },
        rules: {
          userName: [
            { required: true, message: '字典名不能为空', trigger: 'blur' }
          ]
        },
        modalDict: false,
        isAdd: true,
        dictColumns: [].concat(columns.dict_columns,
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
                      this.remove(params)
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
        dictList: []
        
      };
    },
    methods: {
      // 初始化
      init () {
        // 获取字典列表
        this.getdictList(10,1);
      },
      // 获取字典列表
      getdictList (size, num, search) {
        this.$Loading.start();

        if(!search) {
          search = this.searchObj;
        }

        //调用后台接口
        this.$http.post('/poc/tpCmnCodes/list',{
          "data": search,
          "pageNum": num,
          "pageSize": size}
        )
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let dicts = res.data.list,
                  dict_list = [];
              this.totalNum = res.data.total;
              dict_list = this.dealDict(dicts, dict_list);

              this.dictList = dict_list;
              this.$Loading.finish();
						} else{
              this.$Loading.error();
							this.$Message.error('获取字典信息失败！')
						}
					}, (err) => {
            this.$Loading.error();
						this.$Message.error('连接服务器出错！');
					})
      },
      // 格式化贷款数据
      dealDict (dicts, arr) {
        // 遍历用户列表
        dicts.forEach(function(dict) {
          let _dict = {};

          // 格式化贷款数据
          for(let key of Object.keys(dict)) {
            if(key !== 'operator') {
              _dict[key] = dict[key]; 
            }
          };

          // 添加到用户列表数组中
          arr.push(_dict);
        }, this);

        return arr;
      },
      // 页码切换回调
      handleCurrentChange (num) {
        this.num = num;
        this.getdictList(this.size, num, this.searchObj);
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        this.size = size;
        this.getdictList(size, 1, this.searchObj);
      },
      // 添加字典
      onAdd () {
        this.$refs['formDict'].resetFields();
        this.isAdd = true;
        this.modalDict = true;
      },
      // 添加字典确定
      onAddConfirm () {
        this.$http.post('/poc/tpCmnCodes/save', {
          codeCd: this.formDict.codeCd,
          codeName: this.formDict.codeName,
          codeTypeCd: this.formDict.codeTypeCd,
          codeTypeName: this.formDict.codeTypeName,
        })
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              this.$Message.success(res.data.errmsg);
              this.getdictList(10,1);
            }
          }, (err) => {
            this.$Loading.error();
						this.$Message.error('连接服务器出错！');
					})
      },
      // 编辑字典
      onEdit (params) {
        this.isAdd = false;

        this.formDict.codeId = params.row.codeId;
        this.formDict.codeTypeName = params.row.codeTypeName;
        this.formDict.codeTypeCd = params.row.codeTypeCd;
        this.formDict.codeName = params.row.codeName;
        this.formDict.codeCd = params.row.codeCd;

        this.modalDict = true;
      },
      // 编辑字典确定
      onEditConfirm () {
        this.$http.post('/poc/tpCmnCodes/update', {
          data: {
            codeCd: this.formDict.codeCd,
            codeId: this.formDict.codeId,
            codeName: this.formDict.codeName,
            codeTypeCd: this.formDict.codeTypeCd,
            codeTypeName: this.formDict.codeTypeName
          }
        })
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              this.$Message.success(res.data.errmsg);
              this.getdictList(10,1);
            }
          }, (err) => {
            this.$Loading.error();
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
      // 删除字典
      onRemove (index) {
        this.splice(index, 1);
      },
      // 取消操作
      onCancel () {
        this.$Message.info('您已取消了操作');
      },
      // 搜索事件
      onSearch () {
        let search = {
          codeName: this.formSearch.codeName,
          codeTypeName: this.formSearch.codeTypeName,
        }

        this.searchObj = search;
        this.getdictList(this.size, this.num, search);
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

