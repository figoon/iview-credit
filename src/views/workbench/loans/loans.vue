<template>
  <div id="i-workbench-loans">
    <Row>
      <Col :md="20" :sm="18">
        <Card>
          <p slot="title">
            <Icon type="ios-list"></Icon>
            数据列表
          </p>
          <Table :columns="loanColumns" :data="loanList" size="small" stripe :style="{marginBottom: '10px'}"></Table>
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
      <Col :md="4" :sm="6" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="settings"></Icon>
            操作
          </p>
          <div style="text-align:center">
            <i-circle :percent="percent" :size="80" :stroke-color="color">
              <icon v-if="count == 0" type="ios-stopwatch" size="50" style="color:#ccc"></icon>
              <span v-else style="font-size:20px">{{ count }}秒</span>
            </i-circle>
            <ButtonGroup>
              <Button icon="ios-plus-empty" @click="add"></Button>
              <Button icon="ios-minus-empty" @click="minus"></Button>
            </ButtonGroup>
            <Button type="primary" @click="timeing" :loading="loading" long style="margin:10px 0 10px;">定时刷新</Button>
            <Row class="publish-button-con">
              <Button type="primary" @click="handleCredit('apply')" long style="margin:0 0 10px;">申请笔数</Button>
              <Button type="primary" @click="handleCredit('access')" long style="margin:0 0 10px;">审批笔数</Button>
              <Button type="primary" @click="handleCredit('deny')" long style="margin:0 0 10px;">拒绝笔数</Button>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import * as columns from '../../tables/columns/workbench_columns';  
  import util from '@/libs/util.js';

  export default {
    data () {
      return {
        percent: 0,
        count: 0,
        loading: false,
        totalNum: 100,
        loanList: [],
        loanColumns: columns.loan_columns
      }
    },
    mounted () {
      this.init();
    },
    computed: {
      color () {
        let color = '#2db7f5';
        if (this.percent == 100) {
          color = '#5cb85c';
        }
        return color;
      }
    },
    methods: {
      // 初始化
      init () {
        // 获取用户列表
        this.getloanList(1,10);
      },
      // 增加定时刷新时间
      add () {
        if (this.count >= 60) {
          return false;
        }
        switch (this.count) {
          case 0:
            this.count = 10;
            this.percent = 10*(10/6);
            break;
          case 10:
            this.count = 20;
            this.percent = 20*(10/6);
            break;
          case 20:
            this.count = 30;
            this.percent = 30*(10/6);
            break;
          case 30:
            this.count = 60;
            this.percent = 60*(10/6);
            break;
          default:
            this.count = 60;
            this.percent = 60*(10/6);
            break;
        }
      },
      // 减少定时刷新时间
      minus () {
        if (this.percent <= 0) {
          return false;
        }
        switch (this.count) {
          case 10:
            this.count = 0;
            this.percent = 0*(10/6);
            break;
          case 20:
            this.count = 10;
            this.percent = 10*(10/6);
            break;
          case 30:
            this.count = 20;
            this.percent = 20*(10/6);
            break;
          case 60:
            this.count = 30;
            this.percent = 30*(10/6);
            break;
        }
      },
      // 定时刷新
      timeing () {
        if(this.count <= 0) {
          this.$Message.error('请设置定时刷新数据的时间！');
          return;
        }
        this.loading = true;

        let countDown = setInterval(() => {
          this.count--;
          this.percent = this.count*(10/6);
          
          // 判断清除定时器
          if(this.count <= 0) {
            this.loading = false;
            clearInterval(countDown);
            // 重新获取数据
            this.getloanList();
          }
        },1000)
      },
      // 客户相关跳转
      handleCredit (type) {
        util.openNewPage(this, 'workbench_credit');
        this.$router.push({
          name: 'workbench_credit'
        });
        this.$store.commit('setCreditActive', type);
      },
      // 页码切换回调
      handleCurrentChange (val) {
        this.getloanList();
      },
      // 切换每页条数触发
      handleSizeChange (size) {
        this.getloanList();
      },
      // 获取贷款数据列表
      getloanList (size, num, id) {
        //调用后台接口
        this.$http.get('poc/loan/comprehensiveQuery?pageNo='+num+'&pageSize='+size) //'/api/actdetails/'+ size +'/'+ num +'/'+ id)
					.then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let loans = res.data.data.list,
                  loan_list = [];
              this.totalNum = res.data.data.total;

              // 遍历用户列表
              loans.forEach(function(loan) {
                let _loan = {};

                // 格式化用户数据
                for(let key of Object.keys(loan)) {
                  if(key !== 'operator') {
                    _loan[key] = loan[key]; 
                  }
                };

                // 添加到用户列表数组中
                loan_list.push(_loan);
              }, this);
              
							this.loanList = loan_list;
						} else{
							this.$Message.error('获取贷款数据列表失败！')
						}
					}, (err) => {
						this.fullscreenLoading = false;
						this.$Message.error('连接服务器出错！');
					})
      }
    }
  }
</script>