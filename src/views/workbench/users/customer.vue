<template>
  <div id="i-workbench-users">
    <Row>
      <Col>
        <Card>
          <Tabs :value="active_tab" @on-click="handleTabs">
            <TabPane v-for="(item, index) in items" :key="index" 
              :label="item.label" 
              :name="item.name">
                <Form ref="formSearch" :model="formSearch[index]" >
                <Row :gutter="10">
                  <Col span="5">
                    <FormItem label="证件类型" :label-width="75">
                      <Select v-model="formSearch[index].selectType" @on-change="onSearch(index)">
                        <Option v-for="item in formSearch[index].cardType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="5" v-if="formSearch.selectType">
                    <FormItem :label-width="0">
                      <Input v-model="formSearch[index].code" placeholder="请输入证件信息" @on-change="onSearch(index)"></Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="日期范围" :label-width="75">
                      <DatePicker type="daterange" placement="bottom-end" placeholder="选择日期" v-model="formSearch[index].dateRange" @on-change="onSearch(index)"></DatePicker>              
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="客户名称" :label-width="75"> 
                      <Input v-model="formSearch[index].name" @on-change="onSearch(index)"></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Form>

              <Table :columns="draftColumns" :data="draftList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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
            </TabPane>
          </Tabs>
           
          <!-- 模态层 -->
          <Modal v-model="showInfo" width="750" :styles="{top: '30px'}">
            <div slot="header" style="color:#f60;text-align:left">
              <Row :gutter="15">
                <Col span="2">
                  <Icon type="android-person" size="50"></Icon>
                </Col>
                <Col span="18">
                  <Row style="margin-top: 8px;">
                    <Col span="24"><p style="height:18px;font-size:14px;color:#f60;">客户名称：张三</p></Col>
                    <Col span="24"><p style="height:18px;font-size:14px;color:#f60;">客户编号：1234556778865 &nbsp;&nbsp;&nbsp;&nbsp;<span v-if="infoType == '2'">贷款编号：DK12345567788652384901234</span></p></Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Row type="flex" justify="start" :gutter="20">
              <Col span="12" v-for="(value, key) in infos" :key="key"><p>{{key}}：{{value}}</p></Col>
            </Row>
            <div slot="footer">
              <Button type="error" size="large" long :loading="modal_loading" @click="onConfirm">确定</Button>
            </div>
          </Modal>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import * as columns from '../../tables/columns/workbench_columns'; 
  import * as infos from '../../data/workbench_draft';  

  export default {
    name: 'workbench_draft',
    data () {
      return {
        totalNum: 100,
        size: 10,
        formSearch: [{
          cardType: [
            {
              value: '10',
              label: '身份证'
            },
            {
              value: '11',
              label: '组织机构代码'
            }
          ],
          selectType: '',
          dateRange: '',
          beginDate: '20170101',
          endDate: '20181010',
          code: '',
          name: ''
        },{
          cardType: [
            {
              value: '10',
              label: '身份证'
            },
            {
              value: '11',
              label: '组织机构代码'
            }
          ],
          selectType: '',
          dateRange: '',
          beginDate: '20170101',
          endDate: '20181010',
          code: '',
          name: ''
        },{
          cardType: [
            {
              value: '10',
              label: '身份证'
            },
            {
              value: '11',
              label: '组织机构代码'
            }
          ],
          selectType: '',
          dateRange: '',
          beginDate: '20170101',
          endDate: '20181010',
          code: '',
          name: ''
        },{
          cardType: [
            {
              value: '10',
              label: '身份证'
            },
            {
              value: '11',
              label: '组织机构代码'
            }
          ],
          selectType: '',
          dateRange: '',
          beginDate: '20170101',
          endDate: '20181010',
          code: '',
          name: ''
        }],
        items: [
          {
            label: '注册用户',
            name: 'reg'
          },
          {
            label: '新增注册用户',
            name: 'add'
          },
          {
            label: '准入客户',
            name: 'access'
          },
          {
            label: '拒绝客户',
            name: 'deny'
          }
        ],
        infos: {},
        infoType: '',
        showInfo: false,
        modal_loading: false,
        draftList: [],
        draftColumns: this.getColumns()
      }
    },
    computed: {
      active_tab () {
				return this.$store.state.app.customerActive;
			}
    },
    methods: {
      // 初始化
      init () {
        // 获取用户列表
        this.getDraftList(10, 1);
      },
      // 动态插入表格列
      getColumns () {
        if(columns.draft_columns.length < 6) {
          columns.draft_columns.splice(4,0,{
            key: 'draft_type',
            title: '草稿类型',
            width: 150,
            render: (h, params) => {
              const row = params.row;
              const type = row.draft_type === '1' ? 'primary' :  'success';
              const text = row.draft_type === '1' ? '客户信息' : '贷款信息';
              const icon = row.draft_type === '1' ? 'person-stalker' : 'card';
              // 渲染自定义格式
              return h('div', [
                h('Button', {
                  props: {
                    type: type,
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {           
                      this.onShow(params)
                    }
                  }
                },[
                  h('Icon', {
                    props: {
                        type: icon
                    }
                  })," " + text
                ])
              ])
            }
          });
        }
        return columns.draft_columns;
      },
      // 获取草稿列表
      getDraftList (size, num) {
        // 调用后台接口
        this.$http.get('api/credit/draft/'+ size +'/'+ num)
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let users = res.data.rows,
                  user_list = [];
              this.totalNum = res.data.count;
              user_list = this.dealDraft(users, user_list);

							this.draftList = user_list;
						} else{
							this.$Message.error('获取草稿信息失败！')
						}
					}, (err) => {
						this.fullscreenLoading = false;
						this.$Message.error('连接服务器出错！');
					})
      },
      // 格式化草稿数据
      dealDraft (users, arr) {
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
          arr.push(_user);
        }, this);

        return arr;
      },
      // 页码切换回调
      handleCurrentChange (num) {
        this.getDraftList(this.size, num);
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        this.size = size;
        this.getDraftList(size,1);
      },
      // 选择日期范围
      handleDate (date) {
        this.beginDate = date[0];
        this.endDate = date[1];
        this.onSearch();
      },
      // Tabs点击事件
      handleTabs (name) {
        switch (name) {
          case 'reg':
            this.onSearch(0);
            break;
          case 'add':
            this.onSearch(1);
            break;
          case 'access':
            this.onSearch(2);
            break;
          case 'deny':
            this.onSearch(3);
            break;
        }
      },
      // 显示客户相关信息
      onShow (info) {
        this.infoType = info.row.draft_type;
        if(info.row.draft_type == '1') {
          this.infos = infos.userInfos;
        } else {
          this.infos = infos.creditInfos;
        }
        this.showInfo = true;
      },
      // 模态窗口确认
      onConfirm () {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.showInfo = false;
          this.$Message.success('成功关闭信息窗口！');
        }, 500);
      },
      // 搜索事件
      onSearch (index) {
        this.$http.get('/api/credit/draft/search/' + 
          (this.formSearch[index].selectType || '*')  + '/' + 
          (this.formSearch[index].code || '*') + '/' + 
          (this.formSearch[index].beginDate || '*') + '/' + 
          (this.formSearch[index].endDate || '*') + '/' + 
          (this.formSearch[index].name || '*'))
					.then((res) => {
						if(res.status == 200){
              let total_num = res.data.length,
                  users = res.data,
                  user_list = [];

              user_list = this.dealDraft(users, user_list);

              this.totalNum = total_num;
              this.draftList = user_list;
              
							// this.tags=[{name: '共搜索到 '+total_num+' 个结果', type: 'primary'}]
						} else{
							this.$Message.error('获取草稿信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
						console.error(err);
					})
      }
    },
    mounted () {
      this.init();
    }
  }
</script>