<template>
  <div>
    <tree-grid 
      :items='orgData' 
      :columns='columns'
      ref="treeOrg"
      @on-row-click='rowClick'
      @on-selection-change='selectionClick'
    ></tree-grid>

     <Modal
      v-model="modalEdit"
      :title="editFlag ? '编辑信息' : '添加下级'"
      @on-ok="handleInfo"
      @on-cancel="cancel">
      <Form ref="formOrg" :model="formOrg" :label-width="75">
        <FormItem label="机构名称" prop="orgName">
          <Input v-model="formOrg.orgName" placeholder="请输入机构名称"></Input>
        </FormItem>
        <FormItem label="机构编号" prop="orgNum">
          <Input v-model="formOrg.orgNum" placeholder="请输入机构编号"></Input>
        </FormItem>
        <FormItem label="机构级别" prop="orgLevelCd">
          <Select v-model="formOrg.orgLevelCd">
            <Option value="0">1级</Option>
            <Option value="1">2级</Option>
            <Option value="2">3级</Option>
          </Select>
        </FormItem>
        <FormItem label="机构地址" prop="orgAddress">
          <Input v-model="formOrg.orgAddress" placeholder="请输入机构地址"></Input>
        </FormItem>
        </FormItem>
        <FormItem label="机构电话" prop="orgTelephone">
          <Input v-model="formOrg.orgTelephone" placeholder="请输入机构电话"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import TreeGrid from '../../my-components/treetable/treetable'
  export default {
    data() {
      return {
        modalEdit: false,
        editFlag: true,
        activeItem: '',
        formOrg: {
          orgName: '',
          orgNum: '',
          orgLevelCd: '',
          orgAddress: '',
          orgTelephone: '',
          orgId: '',
          superOrgName: '',
          superOrgNum: '',
        },
        columns: [{
          type: 'selection',
          align: 'center'
        }, {
          title: '机构名称',
          key:  'orgName',
          width: 300
        }, {
          title: '机构编码',
          key: 'orgNum',
          width: 200
        }, {
          title: '机构级别',
          key: 'orgLevelCd'
        }, {
          title: '机构地址',
          key: 'orgAddress'
        }, {
          title: '操作',
          type: 'action',
          width: 180,
          actions: [{
            type: 'primary',
            text: '编辑'
          },{
            type: 'primary',
            text: '添加下级'
          },{
            type: 'error',
            text: '删除'
          }]
        }],
        orgData: [{
          orgNum: '0',
          orgName: '根目录',
          orgLevelCd: '',
          orgAddress: ''
        }]
      }
    },
    components: {
      TreeGrid
    },
    methods: {
      // 初始化
      init () {
        // 获取字典列表
        this.getOrgList();
      },
      rowClick(data, event, index,text) {
        switch(text) {
          case '编辑':
            this.editFlag = true;
            this.onEdit(data, event, index);
            break;
          case '添加下级':
            this.editFlag = false;
            this.addLower(data, event, index);
            break;
          case '删除':
            this.onDelete(data.orgNum);
            break;
        }
      },
      // 获取组织机构列表
      getOrgList () {
        this.$http.get('/poc/organization/findByParentIdsLike?orgNum=1')
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              let orgData = res.data.data,
                  root = {
                    orgNum: '0',
                    orgName: '根目录',
                    orgLevelCd: '',
                    orgAddress: '',
                    superOrgNum: 'root',
                    expanded: false
                  };
              
              orgData.push(root);

              // 生成组织机构数据
              let tree = this.dealOrgList(orgData,'root');
              // 赋值TreeTable组件
              this.orgData = tree;
              this.$refs.treeOrg.$emit('showtree');
              // 禁用根目录编辑功能
              document.getElementsByClassName('ivu-btn-primary')[1].setAttribute('disabled',true);
            }
          }, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      dealOrgList (orgData, parentId) {
        let orgObj = {};

        // 获取每个节点的直属子节点
        for (let i = 0; i < orgData.length; i++) {
          let key = orgData[i].superOrgNum;
          if (orgObj[key]) {
            orgObj[key].push(orgData[i]);
          } else {
            orgObj[key] = [];
            orgObj[key].push(orgData[i]);
          }
        }
        return this.formatTree(orgObj, parentId);
      },
      // 递归格式化每个节点
      formatTree(items, parentId) {
        let result = [];
        if (!items[parentId]) {
          return result;
        }
        for (let t of items[parentId]) {
          t.children = this.formatTree(items, t.orgNum)
          result.push(t);
        }
        return result;
      },
      // 弹出编辑窗口
      onEdit (data, event, index) {
        this.modalEdit = true;

        // 表单填充
        this.formOrg.orgName = data.orgName;
        this.formOrg.orgNum = data.orgNum;
        this.formOrg.orgLevelCd = data.orgLevelCd;
        this.formOrg.orgAddress = data.orgAddress;
        this.formOrg.orgTelephone = data.orgTelephone;
        this.formOrg.orgId = data.orgId;
        this.formOrg.superOrgName = data.superOrgName;
        this.formOrg.superOrgNum = data.superOrgNum;

        this.activeItem = data.orgNum;
      },
      // 删除机构信息
      onDelete (orgNum) {
        this.$http.get('/poc/organization/delete?orgNum='+orgNum)
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              if(res.data.errcode != "0" ) {
                this.$Message.error(res.data.errmsg);
              } else {
                this.$Message.success('删除机构信息成功！')
                this.getOrgList();
              }
            } else{
							this.$Message.success('删除机构信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 添加下级机构
      addLower (data, event, index) {
        this.$refs['formOrg'].resetFields();
        this.modalEdit = true;
        console.dir(data)
        this.formOrg.superOrgName = data.orgName;
        this.formOrg.superOrgNum = data.orgNum;
      },
      // 编辑机构信息
      handleEdit () {
        //调用后台接口
        this.$http.post('/poc/organization/update',this.formOrg)
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              if(res.data.errcode != "0" ) {
                this.$Message.error(res.data.errmsg);
              } else {
                this.$Message.success('修改机构信息成功！')
                this.getOrgList();
              }
            } else{
							this.$Message.success('修改机构信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      // 添加机构信息
      handleAdd () {
        //调用后台接口
        this.$http.post('/poc/organization/save',{
          orgAddress: this.formOrg.orgAddress,
          orgLevelCd: this.formOrg.orgLevelCd,
          orgName: this.formOrg.orgName,
          orgTelephone: this.formOrg.orgTelephone,
          superOrgName: this.formOrg.superOrgName,
          superOrgNum: this.formOrg.superOrgNum}
        )
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              if(res.data.errcode != "0" ) {
                this.$Message.error(res.data.errmsg);
              } else {
                this.$Message.success('添加机构信息成功！');
                this.getOrgList();
              }
            } else{
							this.$Message.error('添加机构信息失败！')
						}
					}, (err) => {
						this.$Message.error('连接服务器出错！');
					})
      },
      selectionClick (arr) {
      },
      handleInfo () {
        if(this.editFlag) {
          this.handleEdit();
        } else {
          this.handleAdd();
        }
      },
      cancel () {
        this.$Message.info('取消操作成功！');
      }
    },
    mounted () {
      this.init();
    }
  }
</script>

<style>
</style>