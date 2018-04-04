export const deploy_columns = [
  {
    key: 'procDefId',
    title: '流程ID',
    width: 180
  },
  {
    key: 'procDefKey',
    title: '流程标识'
  },
  {
    key: 'procDefName',
    title: '流程名称'
  },
  {
    key: 'procDefVersion',
    title: '流程版本',
    width: 120
  },
  {
    key: 'procDefStatus',
    title: '流程状态',
    width: 120
  },
  {
    key: 'deployDate',
    title: '流程部署时间',
    width: 150,
    render: (h, params) => {
      const row = params.row;
      return h('div',   
        new Date(row.deployDate).Format('yyyy-MM-dd hh:mm:ss'));
    }
  }
];