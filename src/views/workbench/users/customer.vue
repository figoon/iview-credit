<template>
  <div id="i-workbench-users">
    <Row>
      <Col>
        <Card>
          <Tabs :value="active_tab" :animated="false" @on-click="handleTabs">
            <TabPane v-for="(item, index) in items" :key="index" 
              :label="item.label" 
              :name="item.name">
              <Form ref="formSearch" :model="formSearch[index]" >
                <Row :gutter="10">
                  <Col span="5">
                    <FormItem label="证件类型" :label-width="75">
                      <Select v-model="formSearch[index].selectType">
                        <Option v-for="item in formSearch[index].cardType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="5" v-if="formSearch[index].selectType">
                    <FormItem :label-width="0">
                      <Input v-model="formSearch[index].code" placeholder="请输入证件信息"></Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="受理时间" :label-width="75">
                      <DatePicker type="date" placement="bottom-end" placeholder="选择日期" v-model="formSearch[index].dateRange" @on-change="handleDate"></DatePicker>              
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="客户名称" :label-width="75"> 
                      <Input v-model="formSearch[index].name"></Input>
                    </FormItem>
                  </Col>
                  <Col span="2">
                    <FormItem> 
                      <Button type="primary" @click="onSearch(index)">搜索</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>

              <Table :columns="customerColumns" :data="customerList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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
                    <Col span="24"><p style="height:18px;font-size:14px;color:#f60;">客户名称：{{modelInfo.customer_name}}</p></Col>
                    <Col span="24"><p style="height:18px;font-size:14px;color:#f60;">客户编号：{{modelInfo.customer_code}} &nbsp;&nbsp;&nbsp;&nbsp;<span v-if="infoType == '2'">贷款编号：{{modelInfo.loans_code}}</span></p></Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Tabs size="small">
              <TabPane v-for="(info, key, index) in infos" :key="index" 
                :label="key" 
                :name="key">
                <Row type="flex" justify="start" :gutter="20">
                  <Col span="12" v-for="(value, key) in info" :key="key">
                    <p v-if="key=='实体经营客户名'">{{key}}： <Button type="primary" size="small" @click="companyModel = true">{{value}}</Button></p>
                    <p v-else>{{key}}：{{value}}</p>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
            <div slot="footer">
              <Button type="error" size="large" long :loading="modal_loading" @click="onConfirm">确定</Button>
            </div>
          </Modal>

          <Modal v-model="companyModel" width="750" :styles="{top: '30px'}">
            <div slot="header" style="color:#f60;text-align:left">
              <Row :gutter="15">
                <Col span="2">
                  <Icon type="android-person" size="50"></Icon>
                </Col>
                <Col span="18">
                  <Row style="margin-top: 8px;">
                    <Col span="24"><p style="height:18px;font-size:14px;color:#f60;">客户名称：{{modelInfo.customer_name}}</p></Col>
                    <Col span="24"><p style="height:18px;font-size:14px;color:#f60;">客户编号：{{modelInfo.customer_code}} &nbsp;&nbsp;&nbsp;&nbsp;<span v-if="infoType == '2'">贷款编号：{{modelInfo.loans_code}}</span></p></Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Tabs size="small">
              <TabPane v-for="(info, key, index) in comInfos" :key="index" 
                :label="key" 
                :name="key">
                <Row type="flex" justify="start" :gutter="20">
                  <Col span="12" v-for="(value, key) in info" :key="key">
                    <p>{{key}}：{{value}}</p>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
            
            <div slot="footer">
              <Button type="error" size="large" long :loading="modal_loading" @click="onSeConfirm">确定</Button>
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
    name: 'workbench_customer',
    data () {
      return {
        totalNum: 100,
        size: 10,
        num: 1,
        type: 'total',
        active_num: 0,
        searchObj: {},
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
          positionTime: '',
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
          positionTime: '',
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
          positionTime: '',
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
          positionTime: '',
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
        comInfos: infos.companyInfos,
        modelInfo: {
          customer_name: '',
          customer_code: '',
          loans_code: 'DK12345567788652384901234'
        },
        infoType: '',
        showInfo: false,
        companyModel: false,
        modal_loading: false,
        customerList: [],
        customerColumns: this.getColumns()
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
        this.getCustomerList(this.type, 10, 1);
      },
      // 动态插入表格列
      getColumns () {
        if(columns.draft_columns.length < 6) {
          columns.draft_columns.splice(4,0,{
            key: 'draft_type',
            title: '客户类型',
            width: 150,
            render: (h, params) => {
              const row = params.row;
              const type = row.draft_type === '1' ? 'primary' :  'success';
              const text = row.draft_type === '1' ? '客户具体信息' : '贷款具体信息';
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
      // 获取客户信息
      getCustomerList (type, size, num, search) {
        this.$Loading.start();

        if(!search) {
          search = {
            cusName: null,
            certificateType: null,
            certificateCode: null,
            positionTime: null
          };
        }

        // 调用后台接口
        this.$http.get("/poc/draftInfo/getList", {params: {
          requestData: type,
          pageNumParam: num,
          pageSizeParam: size,
          cusName: search['cusName'],
          certificateType: search['certificateType'],
          certificateCode: search['certificateCode'],
          positionTime: search['certificateType']}
        })  
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let users = res.data.data.list,
                  user_list = [];
              this.totalNum = res.data.data.total;
              user_list = this.dealCustomer(users, user_list);

              this.customerList = user_list;
              this.$Loading.finish();
						} else{
              this.$Loading.error();
							this.$Message.error('获取用户列表失败！')
						}
					}, (err) => {
            this.$Loading.error();
						this.$Message.error('连接服务器出错！');
					})
        
      },
      // 格式化草稿数据
      dealCustomer (users, arr) {
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
        this.num = num;
        this.getCustomerList(this.type, this.size, num, this.searchObj);
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        this.size = size;
        this.getCustomerList(this.type, size, 1, this.searchObj);
      },
      // 选择日期范围
      handleDate (date) {
        this.formSearch[this.active_num].positionTime = date;
      },
      // Tabs点击事件
      handleTabs (name) {
        switch (name) {
          case 'reg':
            this.active_num = 0;
            this.onSearch(0);
            break;
          case 'add':
            this.active_num = 1;
            this.onSearch(1);
            break;
          case 'access':
            this.active_num = 2;
            this.onSearch(2);
            break;
          case 'deny':
            this.active_num = 3;
            this.onSearch(3);
            break;
        }
      },
      // 显示客户相关信息
      onShow (info) {
        this.infoType = info.row.draft_type;
        this.modelInfo.customer_name = info.row.cus_name;
        this.modelInfo.customer_code = info.row.cus_no;

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
      // 二级模态窗口确认
      onSeConfirm () {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.companyModel = false;
          this.$Message.success('成功关闭组织机构窗口！');
        }, 500);
      },
      // 搜索事件
      onSearch (index) {
        let search = {
          cusName: this.formSearch[index].name,
          certificateType: this.formSearch[index].selectType,
          positionTime: this.formSearch[index].positionTime,
          certificateCode: this.formSearch[index].code
        }

        this.searchObj = search;

        switch (index) {
          case 0:
            this.type = 'total';
            this.getCustomerList('total',this.size,this.num,search);
            break;
          case 1:
            this.type = 'todayCount';
            this.getCustomerList('todayCount',this.size,this.num,search);
            break;
          case 2:
            this.type = 'access';
            this.getCustomerList('access',this.size,this.num,search);
            break;
          case 3:
            this.type = 'refulse';
            this.getCustomerList('refulse',this.size,this.num,search);
            break;
        }
      }
    },
    mounted () {
      this.init();
    }
  }
</script>