<template>
  <div>
    <Row :gutter="10">
      <Col span="4">
        <Card>
          <p slot="title">
            <Icon type="social-buffer"></Icon>
            组织机构
          </p>
          <Row type="flex" justify="start" align="middle">
            <Tree :data="orgList" @on-select-change="onSelect"></Tree>
          </Row>
        </Card>
      </Col>
      <Col span="20">
        <Row :gutter="10">
          <Col span="24" :style="{marginBottom: '10px'}">
            <Card>
              <p slot="title">
                <Icon type="ios-search"></Icon>
                查询条件
              </p>
              <Form ref="formInline" :model="formInline" :label-width="60" inline>
                <FormItem label="归属公司">
                  <Select v-model="formInline.company" @on-change="onSearch">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
                <FormItem label="归属部门">
                  <Select v-model="formInline.department" @on-change="onSearch">
                      <Option value="beijing">New York</Option>
                      <Option value="shanghai">London</Option>
                      <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
                <FormItem label="登录名">
                  <Input v-model="formInline.loginName" @on-change="onSearch"></Input>
                </FormItem>
                <FormItem label="姓名">
                  <Input v-model="formInline.name" @on-change="onSearch"></Input>
                </FormItem>
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
              <Table :columns="columns1" :data="data2" size="small" stripe></Table>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>


<script>
  import * as table from '../../tables/data/search';

  export default {
    name: 'international_index',
    data () {
      return {
        formInline: {
          company: '',
          department: '',
          loginName: '',
          name: ''
        },
        columns1: table.columns1,
        data2: [],
        initTable2: [],
        treeSelect: [], // 实际选择的目录
        orgList: [
          {
            title: '高伟达公司',
            expand: true,
            children: [
              {
                title: '研发中心',
              },
              {
                title: '北京分软',
              },
              {
                title: '厦门研发',
              }
            ]
          }
        ]
      };
    },
    methods: {
      init () {
        this.data2 = this.initTable2 = table.searchTable2;
      },
      onSelect (selectedArray) {
        // this.treeSelect = selectedArray.map(item => {
        //   return item.title;
        // });
        console.dir(selectedArray)
      },
      search (data, argumentObj) {
        let res = data;
        let dataClone = data;
        for (let argu in argumentObj) {
          if (argumentObj[argu].length > 0) {
            res = dataClone.filter(d => {
              return d[argu].indexOf(argumentObj[argu]) > -1;
            });
            dataClone = res;
          }
        }
        return res;
      },
      onSearch () {
        this.data2 = this.initTable2;
        this.data2 = this.search(this.data2, {name: this.formInline.loginName, tel: this.formInline.name});
      }
    },
    mounted () {
      this.init();
    }
  };
</script>

<style lang="less" scoped>
  .ivu-form-item {
    margin-bottom: 5px;
    .ivu-select {
      width: 100px;
    }
  }
</style>

