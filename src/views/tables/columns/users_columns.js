export const role_columns = [
  {
    key: 'positonName',
    title: '角色名称',
    width: 150
  },
  {
    key: 'orgName',
    title: '归属机构',
  },
  {
    key: 'positionPermission',
    title: '角色权限',
    width: 130
  },
  {
    key: 'fixedTime',
    title: '创建时间',
    width: 160,
    render: (h, params) => {
      const row = params.row;
      return h('div',   
        new Date(row.fixedTime).Format('yyyy-MM-dd hh:mm:ss'));
    }
  },
  {
    key: 'fixedTime',
    title: '更改时间',
    width: 160,
    render: (h, params) => {
      const row = params.row;
      return h('div',   
        new Date(row.fixedTime).Format('yyyy-MM-dd hh:mm:ss'));
    }
  }
];

export const user_columns = [
  {
    key: 'userNum',
    title: '用户编号',
    width: 123
  },
  {
    key: 'userName',
    title: '用户名',
    width: 100
  },
  {
    key: 'orgName',
    title: '组织机构',
    width: 120
  },
  {
    key: 'orgNum',
    title: '机构编号',
    width: 90
  },
  {
    key: 'positonName',
    title: '角色名称',
    width: 120
  },
  {
    key: 'fixedTime',
    title: '加入时间',
    width: 150,
    render: (h, params) => {
      const row = params.row;
      return h('div',   
        new Date(row.fixedTime).Format('yyyy-MM-dd hh:mm:ss'));
    }
  }
];