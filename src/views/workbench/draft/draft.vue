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
              <Col span="5">
                <FormItem label="证件类型" :label-width="75">
                  <Select v-model="formSearch.selectType">
                    <Option v-for="item in formSearch.cardType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="5" v-if="formSearch.selectType">
                <FormItem :label-width="0">
                  <Input v-model="formSearch.code" placeholder="请输入证件信息"></Input>
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
                    <p v-if="key=='实体经营客户名'">{{key}}： <Button type="primary" size="small" @click="companyModal = true">{{value}}</Button></p>
                    <p v-else>{{key}}：{{value}}</p>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
            
            <div slot="footer">
              <Button type="error" size="large" long :loading="modal_loading" @click="onConfirm">确定</Button>
            </div>
          </Modal>

          <Modal v-model="companyModal" width="750" :styles="{top: '30px'}">
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
    name: 'workbench_draft',
    data () {
      return {
        totalNum: 100,
        size: 10,
        formSearch: {
          cardType: columns.card_type,
          selectType: '',
          date: '',
          startTime: '',
          endTime: '',
          code: '',
          name: ''
        },
        infos: {},
        comInfos: infos.companyInfos,
        modelInfo: {
          customer_name: '',
          customer_code: '',
          loans_code: 'DK12345567788652384901234'
        },
        infoType: '',
        showInfo: false,
        companyModal: false,
        modal_loading: false,
        draftList: [],
        draftColumns: this.getColumns()
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
            key: 'draftType',
            title: '草稿类型',
            width: 150,
            render: (h, params) => {
              const row = params.row;
              const type = row.draftType === '1' ? 'primary' :  'success';
              const text = row.draftType === '1' ? '客户信息' : '贷款信息';
              const icon = row.draftType === '1' ? 'person-stalker' : 'card';
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
      getDraftList (size, num, search) {

        let postData = {
          data: {},
          pageNum: num,
          pageSize: size
        };

        if(search) {
          postData.data = search;
        }

        // 调用后台接口
        this.$http.post('/poc/draftInfo/list', postData)
					.then((res) => {
            // 按状态处理返回结果
            if(res.status == 200) {
              if(res.data.errcode === "0"){
                let users = res.data.data.list,
                    user_list = [];
                this.totalNum = res.data.data.total;
                user_list = this.dealDraft(users, user_list);

                this.draftList = user_list;
              } else{
                this.$Message.error('获取草稿信息失败！')
              }
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
        this.formSearch.startTime = date+' 00:00:00';
        this.formSearch.endTime = date+' 23:59:59';
      },
      // 显示客户相关信息
      onShow (info) {
        this.infoType = info.row.draftType;
        this.modelInfo.customer_name = info.row.cusName;
        this.modelInfo.customer_code = info.row.cusNo;

        if(info.row.draftType == '1') {
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
          this.companyModal = false;
          this.$Message.success('成功关闭组织机构窗口！');
        }, 500);
      },
      // 搜索事件
      onSearch () {
        let obj = {
          certificateType: this.formSearch.selectType || null,
          certificateCode: this.formSearch.code || null,
          cusName: this.formSearch.name || "",
          startTime: this.formSearch.startTime || "",
          endTime: this.formSearch.endTime || ""
        };

        this.getDraftList(10,1,obj);
      },
      formatDate(timestramp){  
        return new Date(timestramp).Format('yyyy-MM-dd');  
      },  
      initFormatter(){  
        Date.prototype.Format = function(fmt) { //  
          let o = {    
              "M+" : this.getMonth()+1,                 //月份    
              "d+" : this.getDate(),                    //日    
              "h+" : this.getHours(),                   //小时    
              "m+" : this.getMinutes(),                 //分    
              "s+" : this.getSeconds(),                 //秒    
              "q+" : Math.floor((this.getMonth()+3)/3), //季度    
              "S"  : this.getMilliseconds()             //毫秒    
          };    
          if(/(y+)/.test(fmt))    
              fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));    
          for(var k in o)    
              if(new RegExp("("+ k +")").test(fmt))    
                  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));    
          return fmt;    
        }  
      }  
    },
    created(){  
      // 为Date 对象添加Format方法
      this.initFormatter();  
    },  
    mounted () {
      this.init();
    }
  }
</script>
