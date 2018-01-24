export const draft_columns = [
  {
    key: 'cus_no',
    title: '客户编号',
    width: 120
  },
  {
    key: 'cus_name',
    title: '客户名称',
    width: 100
  },
  {
    key: 'certificate_type',
    title: '证件类型',
    width: 150,
    render: (h, params) => {
      const row = params.row;
      return row.certificate_type === '10' ? '身份证' :  '组织机构代码';
    }
  },
  {
    key: 'certificate_code',
    title: '证件号码',
    width: 200
  },
  {
    key: 'dispose_time',
    title: '受理时间'
  }
];

export const user_columns = [
  {
    key: 'area',
    title: '地理区域',
    width: 110
  },
  {
    key: 'user_type',
    title: '客户类型',
    width: 130
  },
  {
    key: 'date',
    title: '日期',
    width: 100
  },
  {
    key: 'reg_num',
    title: '注册客户(总量)'
  },
  {
    key: 'add_num',
    title: '新增注册客户(当天)'
  },
  {
    key: 'access_num',
    title: '准入客户(总量)'
  },
  {
    key: 'deny_num',
    title: '拒绝客户(总量)'
  }
]