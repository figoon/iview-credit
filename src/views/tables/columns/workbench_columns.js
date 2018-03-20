export const card_type = [
  {
    value: '10',
    label: '身份证'
  },
  {
    value: '11',
    label: '临时身份证'
  },
  {
    value: '20',
    label: '军人身份证'
  },
  {
    value: '21',
    label: '士兵证'
  },
  {
    value: '22',
    label: '军官证'
  },
  {
    value: '23',
    label: '文职干部证'
  },
  {
    value: '24',
    label: '军官退休证'
  },
  {
    value: '25',
    label: '文职干部退休证'
  },
  {
    value: '30',
    label: '武警身份证'
  },
  {
    value: '31',
    label: '武警士兵证'
  },
  {
    value: '32',
    label: '警官证'
  },
  {
    value: '33',
    label: '武警文职干部证'
  },
  {
    value: '34',
    label: '武警军官退休证'
  },
  {
    value: '35',
    label: '武警文职干部退休证'
  },
  {
    value: '40',
    label: '户口簿'
  },
  {
    value: '50',
    label: '本国护照'
  },
  {
    value: '51',
    label: '外国护照'
  },
  {
    value: '60',
    label: '港澳居民来往内地通行证'
  },
  {
    value: '61',
    label: '台湾居民来往大陆通行证'
  },
  {
    value: '70',
    label: '外国人永久居留证'
  },
  {
    value: '99',
    label: '其他'
  }
];

export const  code_value = {
  10:'居民身份证',
  31:'武警士兵证',
  32:'警官证',
  33:'武警文职干部证',
  34:'武警军官退休证',
  35:'武警文职干部退休证',
  40:'户口簿',
  50:'本国护照',
  51:'外国护照',
  60:'港澳居民来往内地通行证',
  61:'台湾居民来往大陆通行证',
  11:'临时身份证',
  70:'外国人永久居留证',
  99:'其他',
  20:'军人身份证',
  21:'士兵证',
  22:'军官证',
  23:'文职干部证',
  24:'军官退休证',
  25:'文职干部退休证',
  30:'武警身份证'
}

export const draft_columns = [
  {
    key: 'cusNo',
    title: '客户编号',
    width: 150
  },
  {
    key: 'cusName',
    title: '客户名称',
    width: 100
  },
  {
    key: 'certificateType',
    title: '证件类型',
    width: 180,
    render: (h, params) => {
      const row = params.row;
      return code_value[row.certificateType] || '未指定产品类型';
    }
  },
  {
    key: 'certificateCode',
    title: '证件号码',
    width: 200
  },
  {
    key: 'disposeTime',
    title: '受理时间',
    render: (h, params) => {
      const row = params.row;
      return h('div',   
        new Date(row.disposeTime).Format('yyyy-MM-dd hh:mm:ss'));
    }
  }
];

export const credit_columns = [
  {
    key: 'cusNo',
    title: '客户名称',
    width: 100
  },
  {
    key: 'lineAmount',
    title: '授信额度',
    width: 100
  },
  {
    key: 'lineNum',
    title: '贷款编号',
    width: 150
  },
  {
    key: 'productName',
    title: '贷款产品',
    width: 200
  },
  {
    key: 'loanAmount',
    title: '贷款金额',
    width: 100
  },
  {
    key: 'loanLength',
    title: '贷款期限',
    width: 100
  },
  {
    key: 'createDate',
    title: '受理时间',
    render: (h, params) => {
      const row = params.row;
      return h('div',   
        new Date(row.createDate).Format('yyyy-MM-dd hh:mm:ss'));
    }
  }
];

export const user_columns = [
  {
    key: 'city',
    title: '地理区域',
    width: 110
  },
  {
    key: 'isCorpCustomer',
    title: '客户类型',
    width: 130
  },
  {
    key: 'totalCount',
    title: '注册客户(总量)'
  },
  {
    key: 'todayCount',
    title: '新增注册客户(当天)',
    width: 150
  },
  {
    key: 'accessCount',
    title: '准入客户(总量)'
  },
  {
    key: 'refuseCount',
    title: '拒绝客户(总量)'
  }
]

export const loan_columns = [
  {
    key: 'customerProvinceZone',
    title: '地理区域',
    width: 110
  },
  {
    key: 'salesChannel',
    title: '渠道类型',
    width: 100
  },
  {
    key: 'productName',
    title: '贷款产品'
  },
  {
    key: 'creditAmoutAvg',
    title: '平均额度',
    width: 100
  },
  {
    key: 'applyingLoanRecord',
    title: '申请笔数',
    width: 90
  },
  {
    key: 'approvaLoanRecord',
    title: '审批笔数',
    width: 90
  },
  {
    key: 'rejectLoanRecord',
    title: '拒绝笔数',
    width: 90
  }
]

export const flow_columns = [
  {
    key: 'cus_name',
    title: '客户名称',
    width: 120
  },
  {
    key: 'cus_no',
    title: '贷款编号',
    width: 120
  },
  {
    key: 'certificate_type',
    title: '产品类型',
    width: 180,
    render: (h, params) => {
      const row = params.row;
      return row.certificate_type === '10' ? '个人经营性车辆按揭贷款' :  '非额度项下个商信用贷贷款';
    }
  },
  {
    key: 'dispose_time',
    title: '受理时间'
  }
]