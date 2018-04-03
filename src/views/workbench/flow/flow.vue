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
                <FormItem label="贷款产品" :label-width="75">
                  <Select clearable v-model="formSearch.selectType">
                    <Option v-for="item in formSearch.cardType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="受理时间" :label-width="75">
                  <DatePicker type="date" placement="bottom-end" placeholder="选择日期" v-model="formSearch.date" @on-change="handleDate"></DatePicker>              
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="客户名称" :label-width="75"> 
                  <Input v-model="formSearch.cusName"></Input>
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
          <Modal v-model="showInfo" width="1000" :styles="{top: '30px'}">
            <p slot="header" style="margin:5px;color:#f60;text-align:center">
              <span>流程号：{{modelInfo.instance_num}}具体信息</span>
            </p>
            <Table :columns="flowDetailsColumns" :data="flowDetailsList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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

  export default {
    name: 'workbench_draft',
    data () {
      return {
        totalNum: 100,
        size: 10,
        formSearch: {
          cardType: columns.card_type,
          selectType: '',
          cusName: '',
          beginDate: '',
          endDate: ''
        },
        modelInfo: {
          instance_num: ''
        },
        infoType: '',
        showInfo: false,
        modal_loading: false,
        flowList: [],
        flowColumns: this.getColumns(),
        flowDetailsList: [],
        flowDetailsColumns: columns.flow_details_columns
      }
    },
    methods: {
      // 初始化
      init () {
        // 获取用户列表
        this.getFlowList(10, 1);
        this.getFlowDict();
      },
      // 动态插入表格列
      getColumns () {
        if(columns.flow_columns.length < 5) {
          columns.flow_columns.splice(3,0,{
            key: 'draftType',
            title: '流程具体信息',
            width: 200,
            render: (h, params) => {
              const row = params.row;
              const type = 'primary';
              const text = '流程具体信息';
              const icon = 'ios-list';
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
      // 获取流程列表
      getFlowList (size, num, search) {

        let postData = {
          data: {},
          pageNum: num,
          pageSize: size
        };

        if(search) {
          postData.data = search;
        }

        // 调用后台接口
        this.$http.post('/poc/messageInfo/getLoanProcessList', postData)
					.then((res) => {
            // 按状态处理返回结果
            if(res.status == 200) {
              if(res.data.errcode === "0"){
                let flows = res.data.data.list,
                    flow_list = [];
                this.totalNum = res.data.data.total;
                flow_list = this.dealFlow(flows, flow_list);

                this.flowList = flow_list;
              } else{
                this.$Message.error('获取流程数据列表出错！')
              }
            }
					}, (err) => {
						this.fullscreenLoading = false;
						this.$Message.error('连接服务器出错！');
					})
      },
      // 格式化流程数据
      dealFlow (flows, arr) {
        // 遍历用户列表
        flows.forEach(function(flow) {
          let _flow = {};

          // 格式化用户数据
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
      // 获取码值字典
      getFlowDict () {
        // return this.$http.post('/poc/dictionary/getAllDictInfosMap');
        this.$http.get('/poc/dictionary/getAllDictInfosMap')
          .then((res) => {
            let dictData = res.data.data;
            sessionStorage.setItem("flowDict", JSON.stringify(dictData));
          }, (err) => {
						this.$Message.error('获取字典数据发生错误！');
						console.error(err);
					})
      },
      // 返回码值字典
      returnDict (name) {
        let dictData = sessionStorage.getItem("flowDict");
        if(dictData === null){
          return false
        } else {
          return JSON.parse(dictData);
        }
      },
      // 流程具体信息
      dealFlowInfo (code) {
        this.$http.post('/poc/messageInfo/getLoanProcessData',{
          data: {
            instanceNum: 'SUP0117122800070'//code
          },
          pageNum: 1,
          pageSize: 50
        })
          .then((res) => {
            if(res.data.errcode === "0") {
              let flows = res.data.data.list,
                  flow_list = [];
              this.totalNum = res.data.data.total;
              flow_list = this.dealFlow(flows, flow_list);

              this.flowDetailsList = flow_list;
            }
          }, (err) => {
						this.fullscreenLoading = false;
						this.$Message.error('连接服务器出错！');
        	})

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
        this.formSearch.beginDate = date; //+' 00:00:00';
        this.formSearch.endDate = date; //+' 23:59:59';
      },
      // 显示流程相关信息
      onShow (info) {
        this.modelInfo.instance_num = info.row.instanceNum;
        this.dealFlowInfo(info.row.instanceNum);
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
      onSearch () {
        let search_obj = {
          productName: this.formSearch.selectType || null,
          cusName: this.formSearch.cusName || "",
          beginDate: this.formSearch.beginDate || "",
          endDate: this.formSearch.endDate || ""
        };

        this.getFlowList(10,1,search_obj);
      },
      formatDate(timestramp){  
        return new Date(timestramp).Format('yyyy-MM-dd');  
      }
    },
    mounted () {
      this.init();
    }
  }
</script>
