<template>
  <div id="i-user-manage">
    <Row :gutter="10">
      <Col span="4">
        <Card>
          <p slot="title">
            <Icon type="social-buffer"></Icon>
            组织机构
          </p>
          <Row type="flex" justify="start" align="middle">
            <Tree ref="tree" 
              :data="orgList" 
              @on-select-change="onSelect"></Tree>
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
              <Form ref="formInline" :model="formInline" :label-width="75" >
                <Row :gutter="10">
                  <Col span="10">
                    <FormItem label="归属机构">
                      <org-selector ref="orgSelec" v-model="formInline.orgValue" @on-change="onSearch" level="1"/>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem label="登录名">
                      <Input v-model="formInline.loginName" @on-change="onSearch"></Input>
                    </FormItem>
                  </Col>
                  <Col span="7">
                    <FormItem label="姓名">
                      <Input v-model="formInline.name" @on-change="onSearch"></Input>
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
  import Tree from '../../my-components/tree/tree.vue';
  import orgSelector from '../../my-components/cascade/components/al-selector.vue';

  export default {
    name: 'users_user',
    components: {
      Tree,
      orgSelector
    },
    data () {
      return {
        formInline: {
          orgValue: [],
          loginName: '',
          name: ''
        },
        columns1: table.columns1,
        data2: [],
        initTable2: [],
        treeSelect: [], // 实际选择的目录
        orgList: []
      };
    },
    methods: {
      init () {
        this.data2 = this.initTable2 = table.searchTable2;
      },
      dealTree () {
        let orgData = JSON.parse(localStorage.getItem('org')),
            companyData = orgData['company'];

        for(let key of Object.keys(companyData)){
          let orgObj = {};
          orgObj.title = companyData[key];
          orgObj.expand = true;
          orgObj.children = [];

          for(let dep of Object.keys(orgData[key])){
            let depObj = {};
            depObj.title = orgData[key][dep];
            orgObj.children.push(depObj);
          };

          this.orgList.push(orgObj);
        }
      },
      // 组织机构选择触发
      onSelect (selectedArray) {
        this.formInline.orgValue = selectedArray;
        this.$refs.orgSelec.$emit('cascade-bridge');
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
      this.dealTree();
    }
  };
</script>

<style lang="less">
  #i-user-manage {
    .ivu-col-span-10 {
      .ivu-form-item {
        .ivu-form-item-label {
          width: 70px!important;
        }
      }
    }
    .ivu-form-item {
      margin-bottom: 5px;
    }
  }
</style>

