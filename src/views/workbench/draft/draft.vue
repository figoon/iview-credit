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
                  <Select clearable v-model="formSearch.selectType">
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
                <FormItem label="受理时间" :label-width="75">
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
                    <p v-if="key=='实体经营客户名'">{{key}}： <Button type="primary" size="small" @click="getCustomerCrop">{{value}}</Button></p>
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
        this.getDraftDict();
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
              const text = row.draftType === '1' ? '客户类型' : '贷款类型';
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
                this.$Message.error('获取暂存数据列表出错！')
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
      // 获取码值字典
      getDraftDict () {
        // return this.$http.post('/poc/dictionary/getAllDictInfosMap');
        this.$http.get('/poc/dictionary/getAllDictInfosMap')
          .then((res) => {
            let dictData = res.data.data;
            sessionStorage.setItem("draftDict", JSON.stringify(dictData));
          }, (err) => {
						this.$Message.error('获取字典数据发生错误！');
						console.error(err);
					})
      },
      // 返回码值字典
      returnDict (name) {
        let dictData = sessionStorage.getItem("draftDict");
        if(dictData === null){
          return false
        } else {
          return JSON.parse(dictData);
        }
      },
      // 获取客户信息数据
      getUserInfo () {
        return this.$http.get('/poc/getCustomerInfoByCusNo?cusNo=A01H17122801223');
      },
      // 客户类型信息
      dealUserInfo () {
        this.$http.all([this.getUserInfo(), this.returnDict()])
          .then(this.$http.spread((user, dict) => {
            if(user.data.errcode === "0") {
              let userData = user.data.data,
                  dictData = dict;
              
              // 拼装数据
              let userInfos = {
                '基本信息': {
                  '证件类型': dictData['CertificateTypeCd'][userData.certificateType],
                  '证件号码': userData.certificateCode,
                  '是否长期有效': userData.is_longTime,
                  '证件有效期': userData.certificateValid_deadline,
                  '国家地区': userData.countryDistrict,
                  '民族': dictData['NationalityCd'][userData.nationality],
                  '户籍区划': userData.nativePlaceCode,
                  '户籍地址': userData.nativePlace,
                  '是否本地户口': userData.isNativeAccount,
                  '最高学历': dictData['DegreeCd'][userData.degree],
                  '婚姻状况': dictData['MaritalStatusCd'][userData.maritalStatus],
                  '移动电话': userData.mobilePhone,
                  '健康状况': dictData['HealthStatusCd'][userData.healthStatus],
                  '客户标识': dictData['CusLabelCd'][userData.cusLabel],
                },
                '地址信息': {
                  '住所邮编': userData.residencePostcode,
                  '居住年限': userData.nativeLiveTime,
                  '通讯地址': dictData['ConnectAddressCd'][userData.isConnectAddress],
                  '是否本行关系人': userData.bankEmployeeFlag,
                  '住宅区划': userData.domicileAdministrativeDistri,
                  '住宅地址': userData.registeredAddress,
                  '住宅街道': userData.residenceStreetName,
                  '住宅电话': userData.residenceTelephone
                },
                '职业信息': {
                  '电子邮箱': userData.email,
                  '行业类别': dictData['WorkCorpTypeCd'][userData.workCorpType],
                  '就业类别': userData.employmentType,
                  '职业': dictData['MetierCd'][userData.metier],
                  '单位地址': userData.cropAddress,
                  '职称': dictData['JobtitleCd'][userData.jobtitle],
                  '职务': dictData['JobpositionCd'][userData.jobposition],
                  '从业年限': userData.tradeWorkYears,
                  '单位电话': userData.cropTelephone
                },
                '所属实体经营信息': {
                  '实体经营客户名': userData.corpCustmerName ,
                  '实体经营客户编号': userData.corpCustmerNo,
                  '证件类型': '营业执照',
                  '证件号码': '283712837491827358',
                  '证件有效止期': '2089-12-31',
                  '贷款卡号': '12321928319285',
                  '组织机构代码': '89347628'
                },
                '影像信息': {
                  'info': '影像资料'
                }
              }

              this.infos = userInfos;
            }
          }), (err) => {
						this.fullscreenLoading = false;
						this.$Message.error('连接服务器出错！');
        	})

      },
      // 获取经营客户信息
      getCustomerCrop () {
        this.$http.get('/poc/customerCrop/getCustomerCrop')
          .then((res) => {
            let corpData = res.data.data,
                dictData = dict.data.data;

            let customerCrop =  {
              '基本信息': {
                '实体经营客户名': corpData.corpCustmerName,
                '实体经营客户编号': corpData.corpCustmerNo,
                '证件类型': corpData.certificateType,
                '证件号码': corpData.certificateCode,
                '证件有效止期': corpData.certificateValidDeadline,
                '贷款卡号': corpData.loancardNo,
                '组织机构代码': corpData.corpCode,
                '客户类型': dictData['CorpTypeCd'][corpData.corpType],
                '授信额度': corpData.lineAmount,
                '客户政策': dictData['CreditPolicyCd'][corpData.creditPolicy],
                '客户状态': dictData['CusClassCd'][corpData.cusClass]
              },
              '企业信息': {
                '经济性质': dictData['EcoTypeCd'][corpData.ecoType],
                '营业期限': corpData.businessTerm,
                '员工人数': corpData.staff,
                '职场面积': corpData.workArea,
                '职场属权': dictData['WorkDutyCd'][corpData.workDuty],
                '注册资本': corpData.registeredCapital,
                '单位地址': corpData.runAddress,
                '登记注册号码': corpData.registerCode,
                '公司邮箱': corpData.email,
                '法定代表人': corpData.legalRepresentative,
                '成立时间': corpData.createTime,
                '国家地区': corpData.countryDistrict
              },
              '行业信息': {
                '注册类型': corpData['RegisterTypeCd'][corpData.registerType],
                '行业大类': corpData['WorkCorpTypeCd'][corpData.workcorpType],
                '行业中类': corpData['WorkcorpMiddleType'][corpData.workcorpMiddleType],
                '行业小类': corpData['WorkcorpSubdType'][corpData.workcorpSubdType],
                '是否有进出口权': corpData.exImrightsflag,
                '是否上市公司': corpData.quotedcompanyFlag,
                '是否集团客户': corpData.groupcorpFlag,
                '是否签定银企合作协议': corpData.bankEnterpriseCoopAgreement,
                '是否高新企业': corpData.advancedCorp,
                '农业产业化标志': corpData.agricultureFlag
              },
              '影像信息': {
                'info': '影像资料'
              }
            }

          }, (err) => {
						this.$Message.error('连接服务器出错！');
						console.error(err);
					})
      },

      // 获取贷款信息数据
      getCreditInfos (lineNum) {
        return this.$http.get('/poc/loan/getLoanInfo/'+ lineNum);
      },
      // 贷款类型信息
      dealCreditInfos (lineNum) {
        this.$http.all([this.getCreditInfos(lineNum), this.returnDict()])
          .then(this.$http.spread((credit, dict) => {
            if(credit.data.errcode === "0") {
              let creditData = credit.data.data,
                  dictData = dict;
              
              let creditInfos = {
                '贷款信息': {
                  '产品种类': dictData['AppParentCd'][creditData.tbLnLoan.productName],
                  '额度类别': creditData.tbLnLoan.lineType,//dictData['LineTypeCd'][creditData.tbLnLoan.lineType],
                  '授信额度': creditData.tbLnLoan.lineAmount,
                  '可用额度': creditData.tbLnLoan.lineBalance,
                  '额度期限': creditData.tbLnLoan.linePeriod,
                  '币种': dictData['CurrencyCd'][creditData.tbLnLoan.currency],
                  '支用期限': creditData.tbLnLoan.lineAjustendDate,
                  '贷款金额': creditData.tbLnLoan.loanAmount,
                  '贷款期限': creditData.tbLnLoan.loanLength,
                  '还款来源': dictData['RepaySourceCd'][creditData.tbLnLoan.repaySource],
                  '居住户籍': dictData['IsInTownCd'][creditData.tbLnLoan.isInTown],
                  '是否符合财税农户标准': creditData.tbLnLoan.isFitFarmerStand,
                  '是否创业贷款': creditData.tbLnLoan.isCarveOutLoan,
                  '营销渠道': dictData['SalesChannelCd'][creditData.tbLnLoan.salesChannel],
                  '营销网点': dictData['SalesInterbranchCd'][creditData.salesInterbranch]
                },
                '还款信息': {
                  '还款方式': dictData['RepayKindCd'][creditData.tbLnLoan.repayKind],
                  '月还款额': creditData.tbLnLoan.monthlyReturn,
                  '固定还款日': creditData.tbLnLoan.repayDay,
                  '首次还本': creditData.tbLnLoan.beginTerm,
                  '期还款额': creditData.tbLnLoan.repayAmount,
                  '月贷期限': creditData.tbLnLoan.endTerm,
                  '最低限额': creditData.tbLnLoan.advanceRepayAmount,
                  '是否收取违约金': creditData.tbLnLoan.isGetPrerepayForfeit,
                  '收取方式': dictData['PrerepayTypeCd'][creditData.tbLnLoan.prerepayType],
                  '收取金额': creditData.tbLnLoan.prerepayAmount,
                  '收取比例': creditData.tbLnLoan.prepaymentForeeitRate
                },
                '担保信息': {
                  '担保方式': dictData['GroupSecurityCd'][creditData.tbLnLoan.groupSecurityType],
                  '组合担保': dictData['ComSecurityCd'][creditData.tbLnLoan.comSecurityKind],
                  '用途类型': dictData['LoanPurposeCd'][creditData.tbLnLoan.loanPurposeKind],
                  '是否系统内贴息': creditData.tbLnLoan.isDiscount,
                  '最高限额': creditData.tbLnLoan.maxDiscountAmount,
                  '贴息模式': dictData['DiscountModeCd'][creditData.tbLnLoan.discountMode],
                  '贴息金额': creditData.tbLnLoan.settledDiscountAmount,
                  '贴息比例': creditData.tbLnLoan.fixedDiscountRate,
                  '贴息方式': dictData['DiscountKindCd'][creditData.tbLnLoan.discountSubKind],
                  '扣划时点': dictData['DiscountTimeCd'][creditData.tbLnLoan.discountRepaymentTime],
                  '账户类型': dictData['DiscountTypeCd'][creditData.tbLnLoan.discountType],
                  '贴息账号': creditData.tbLnLoan.discountAccNum,
                  '起始日期': creditData.tbLnLoan.discountBeginDate,
                  '终止日期': creditData.tbLnLoan.discountEndDate
                },
                '利率信息': {
                  '产品利率': creditData.tbLnLoan.productRate,
                  '定价方式': dictData['RatePriceCd'][creditData.tbLnLoan.ratePriceKind],
                  '是否分段': creditData.tbLnLoan.isAutoChgFa,
                  '浮动比例': creditData.tbLnLoan.floatingRatio,
                  '浮动起期': creditData.tbLnLoan.floatingCreate,
                  '浮动止期': creditData.tbLnLoan.floatingFinish,
                  '加点幅度': creditData.tbLnLoan.floatingValue,
                  '加点起期': creditData.tbLnLoan.floatValueCreate,
                  '加点止期': creditData.tbLnLoan.floatValueFinish,
                  '执行利率': creditData.tbLnLoan.loanRate,
                  '罚息利率': creditData.tbLnLoan.overdueRate,
                  '结息周期': dictData['InterestCycleCd'][creditData.tbLnLoan.interestCleanCycle],
                  '结息方式': dictData['InterestKindCd'][creditData.tbLnLoan.interestCleanKind],
                  '调整方式': dictData['RateAdjustCd'][creditData.tbLnLoan.rateAdjustKind]
                },
                '影像信息': {
                  'info': '影像资料'
                }
              };

              this.infos = creditInfos;
            }
          }), (err) => {
            this.fullscreenLoading = false;
            this.$Message.error('连接服务器出错！');
          })
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
          this.dealUserInfo();
        } else {
          this.dealCreditInfos(info.row.lineNum);
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
