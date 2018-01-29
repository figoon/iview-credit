<template>
  <div>
    <tree-grid 
      :items='data' 
      :columns='columns'
      @on-row-click='rowClick'
      @on-selection-change='selectionClick'
      @on-sort-change='sortClick'
    ></tree-grid>

     <Modal
      v-model="modalEdit"
      title="编辑信息"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formUser" :model="formOrg" :label-width="75">
        <FormItem label="机构名称">
          <Input v-model="formOrg.orgName" placeholder="请输入机构名称"></Input>
        </FormItem>
        <FormItem label="机构编号">
          <Input v-model="formOrg.orgCode" placeholder="请输入机构编号"></Input>
        </FormItem>
        <FormItem label="机构级别">
          <Select v-model="formOrg.grade">
            <Option value="1级">1级</Option>
            <Option value="2级">2级</Option>
            <Option value="3级">3级</Option>
          </Select>
        </FormItem>
        <FormItem label="机构地址">
          <Input v-model="formOrg.address" placeholder="请输入机构地址"></Input>
        </FormItem>
        </FormItem>
        <FormItem label="机构电话">
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
          key:  'orgName'
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
          id: '1',
          orgCode: '0001',
          orgName: '测试数据1',
          grade: '2级',
          address: '测试数据测试数据'
        }, {
          id: '2',
          orgCode: '0002',
          orgName: '测试数据2',
          grade: '1级',
          address: '测试数据测试数据',
          children: [{
            id: '01',
            orgCode: '00001',
            orgName: '测试数据01',
            grade: '3级',
            address: '测试数据测试数据',
          }, {
            id: '02',
            orgCode: '00002',
            orgName: '测试数据02',
            grade: '1级',
            address: '测试数据测试数据',
          }]
        }, {
          id: '3',
          orgCode: '0003',
          orgName: '测试数据3',
          grade: '2级',
          address: '测试数据测试数据'
        }, {
          id: '4',
          orgCode: '0004',
          orgName: '测试数据4',
          grade: '1级',
          address: '测试数据测试数据'
        }]
      }
    },
    components: {
      TreeGrid
    },
    methods: {
      rowClick(data, event, index,text) {
        switch(text) {
          case '编辑':
            this.onEdit(data, event, index);
            break;
          case '添加下级':
            this.addLower(data, event, index);
            break;
          case '删除':
            console.log('点击事件:' + event)
            break;
        }
      },
      onEdit (data, event, index) {
        this.modalEdit = true;
        this.formOrg = data;
      },
      addLower (data, event, index) {
        this.modalEdit = true;
        console.dir(data)
        if(!this.data[data.id].children) {
          this.$set(this.data[data.id], 'children', []);
        }
        this.data[data.id].children.push({
          id: 333,
          orgCode: this.formOrg.orgCode,
          orgName: this.formOrg.orgName,
          grade: this.formOrg.grade,
          address: this.formOrg.address
        })
        console.dir(this.data)

      },
      selectionClick (arr) {
        console.log('选中数据id数组:' + arr)
      },
      sortClick (key, type) {
        console.log('排序字段:' + key)
        console.log('排序规则:' + type)
      },
      ok () {
        this.$Message.info('Clicked ok');
      },
      cancel () {
        this.$Message.info('Clicked cancel');
      }
    }
  }
</script>

<style>
</style>