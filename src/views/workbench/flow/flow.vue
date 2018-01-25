<template>
  <div id="i-workbench-draft">
    <Row :gutter="10" :style="{marginBottom: '10px'}">
      <Col>
        <Card>
          <p slot="title" class="card-title">
            <Icon type="ios-search"></Icon>
            查询条件
          </p>
          <Form ref="formSearch" :model="formSearch" >
            <Row :gutter="10">
              <Col span="7">
                <FormItem label="贷款产品" :label-width="75">
                  <Select v-model="formSearch.selectType">
                    <Option v-for="item in formSearch.cardType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="日期范围" :label-width="75">
                  <DatePicker type="date" placement="bottom-end" placeholder="选择日期" v-model="formSearch.date" @on-change="handleDate"></DatePicker>              
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="客户名称" :label-width="75"> 
                  <Input v-model="formSearch.name"></Input>
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
      <Col span="24" :style="{marginBottom: '10px'}">
        <Card>
          <p slot="title">
            <Icon type="ios-list"></Icon>
            数据列表
          </p>
          <Table :columns="flowColumns" :data="flowList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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
          <!-- 模态层 -->
          <Modal v-model="showInfo" width="750" :styles="{top: '30px'}">
            <div slot="header" style="color:#f60;text-align:left;font-size:16px;font-weight: bold;padding: 7px 0;">
              流程具体信息
            </div>
            <Table :columns="flowColumns" :data="flowList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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
        formSearch: {
          cardType: [
            {
              value: '10',
              label: '房地产抵押非额度项下个人商务贷款'
            },
            {
              value: '11',
              label: '非额度项下个商信用贷贷款'
            },
            {
              value: '12',
              label: '个人经营性车辆按揭贷款'
            }
          ],
          selectType: '',
          date: '',
          beginDate: '20100101',
          endDate: '20181010',
          code: '',
          name: ''
        },
        infos: {},
        infoType: '',
        showInfo: false,
        modal_loading: false,
        flowList: [],
        flowColumns: this.getColumns()
      }
    },
    methods: {
      // 初始化
      init () {
        // 获取用户列表
        this.getFlowList(10, 1);
      },
      // 动态插入表格列
      getColumns () {
        if(columns.flow_columns.length < 5) {
          columns.flow_columns.splice(3,0,{
            key: 'draft_type',
            title: '流程具体信息',
            render: (h, params) => {
              const row = params.row;
              const type = row.draft_type === '1' ? 'primary' :  'primary';
              const text = row.draft_type === '1' ? '流程具体信息' : '流程具体信息';
              const icon = row.draft_type === '1' ? 'ios-briefcase' : 'ios-briefcase';
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
        return columns.flow_columns;
      },
      // 获取草稿列表
      getFlowList (size, num) {
        // 调用后台接口
        this.$http.get('api/credit/draft/*/'+ size +'/'+ num)
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let users = res.data.rows,
                  user_list = [];
              this.totalNum = res.data.count;
              user_list = this.dealDraft(users, user_list);

							this.flowList = user_list;
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
        this.getFlowList(this.size, num);
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        this.size = size;
        this.getFlowList(size,1);
      },
      // 选择日期范围
      handleDate (date) {
        this.formSearch.endDate = date;
      },
      // 显示客户相关信息
      onShow (info) {
        console.dir(info)
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
      // 二级模态窗口确认
      onSeConfirm () {
        this.modal_loading = true;
        setTimeout(() => {
          this.modal_loading = false;
          this.$Message.success('成功关闭组织机构窗口！');
        }, 500);
      },
      // 搜索事件
      onSearch () {
        this.$http.get('/api/credit/draft/search/*/' + 
          (this.formSearch.selectType || '*')  + '/' + 
          (this.formSearch.code || '*') + '/' + 
          (this.formSearch.beginDate || '*') + '/' + 
          (this.formSearch.endDate || '*') + '/' + 
          (this.formSearch.name || '*'))
					.then((res) => {
						if(res.status == 200){
              let total_num = res.data.length,
                  users = res.data,
                  user_list = [];

              user_list = this.dealDraft(users, user_list);

              this.totalNum = total_num;
              this.flowList = user_list;
              
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
