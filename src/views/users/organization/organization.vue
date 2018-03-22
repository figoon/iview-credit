<template>
  <div>
    <tree-grid 
      :items='data' 
      :columns='columns'
      @on-row-click='rowClick'
      @on-selection-change='selectionClick'
    ></tree-grid>

     <Modal
      v-model="modalEdit"
      :title="editFlag ? '编辑信息' : '添加下级'"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formOrg" :model="formOrg" :label-width="75">
        <FormItem label="机构名称" prop="orgName">
          <Input v-model="formOrg.orgName" placeholder="请输入机构名称"></Input>
        </FormItem>
        <FormItem label="机构编号" prop="orgCode">
          <Input v-model="formOrg.orgCode" placeholder="请输入机构编号"></Input>
        </FormItem>
        <FormItem label="机构级别" prop="grade">
          <Select v-model="formOrg.grade">
            <Option value="1级">1级</Option>
            <Option value="2级">2级</Option>
            <Option value="3级">3级</Option>
          </Select>
        </FormItem>
        <FormItem label="机构地址" prop="address">
          <Input v-model="formOrg.address" placeholder="请输入机构地址"></Input>
        </FormItem>
        </FormItem>
        <FormItem label="机构电话" prop="phone">
          <Input v-model="formOrg.phone" placeholder="请输入机构电话"></Input>
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
          orgCode: '',
          grade: '',
          address: '',
          phone: ''
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
          key: 'orgCode',
          width: 200
          // sortable: true
        }, {
          title: '机构级别',
          key: 'grade'
        }, {
          title: '机构地址',
          key: 'address'
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
        data: [{
          id: 0,
          parentId: 0,
          orgCode: '0001',
          orgName: 'root',
          grade: '1级',
          address: '测试数据测试数据',
          children: [{
            id: '1001',
            parentId: '0',
            orgCode: '0001',
            orgName: '测试数据1',
            grade: '2级',
            address: '测试数据测试数据'
          }, {
            id: '1002',
            parentId: '0',
            orgCode: '0002',
            orgName: '测试数据2',
            grade: '1级',
            address: '测试数据测试数据',
            children: [{
              id: '1101',
              parentId: '1002',
              orgCode: '00001',
              orgName: '测试数据01',
              grade: '3级',
              address: '测试数据测试数据',
            }, {
              id: '1102',
              parentId: '1002',
              orgCode: '00002',
              orgName: '测试数据02',
              grade: '1级',
              address: '测试数据测试数据',
            }]
          }, {
            id: '1003',
            parentId: '0',
            orgCode: '0003',
            orgName: '测试数据3',
            grade: '2级',
            address: '测试数据测试数据'
          }, {
            id: '1004',
            parentId: '0',
            orgCode: '0004',
            orgName: '测试数据4',
            grade: '1级',
            address: '测试数据测试数据'
          }],
          expanded: false
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
            console.log('点击事件:' + event)
            break;
        }
      },
      getOrgList () {
        this.$http.get('/poc/organization/findByParentIdsLike?orgNum=1')
          .then((res) => {
            // 按状态处理返回结果
						if(res.status == 200){
              this.$Message.success(res.data.errmsg);
              this.getdictList(10,1);
            }
          }, (err) => {
            this.$Loading.error();
						this.$Message.error('连接服务器出错！');
					})
      },
      onEdit (data, event, index) {
        this.modalEdit = true;
        this.formOrg = data;
        this.activeItem = data.id;
      },
      addLower (data, event, index) {
        this.$refs['formOrg'].resetFields();
        this.modalEdit = true;
        this.activeItem = data.id;
      },
      handleEdit () {
        this.callSelf(this.data);

        this.$Message.success('修改成功！');
      },
      callSelf (items) {
        items.forEach((item, index) => {
          if(item.id == this.activeItem) {
            if(this.editFlag) {
              item.orgName = this.formOrg.orgName;
              item.orgCode = this.formOrg.orgCode;
              item.address = this.formOrg.address;
              item.grade = this.formOrg.grade;
              item.phone = this.formOrg.phone;
            } else {
              if(!item.children) {
                this.$set(item, 'children', []);
              }
              item.children.push({
                id: 333,
                orgCode: this.formOrg.orgCode,
                orgName: this.formOrg.orgName,
                grade: this.formOrg.grade,
                address: this.formOrg.address
              })
            }
          } else {
            if(item.children) {
              this.callSelf(item.children);
            }
          }
        })
      },
      handleAdd () {
        this.callSelf(this.data);
        this.$Message.success('添加成功！');
      },
      selectionClick (arr) {
      },
      ok () {
        if(this.editFlag) {
          this.handleEdit();
        } else {
          this.handleAdd();
        }
      },
      cancel () {
        this.$Message.info('Clicked cancel');
      }
    },
    mounted () {
      this.init();
    }
  }
</script>

<style>
</style>