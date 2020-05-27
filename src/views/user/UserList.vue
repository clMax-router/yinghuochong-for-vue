<template>
  <div id="UserList">
    <!-- 表格 -->
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="data.rows"
        :pagination="pagination"
        @change="paginationChange"
        :loading="loading"
      >
        <!-- 自定义表格外的头部和尾部 -->
        <!-- 用户头像 -->
        <a-avatar size="large" slot="avatarUrl" slot-scope="column" :src="column" />
        <!-- 性别栏 -->
        <span slot="gender" slot-scope="column">{{ column - 0 && '男' || '女' }}</span>
        <!-- 显示时间 -->
        <span slot="create_time" slot-scope="column">{{ formatTime(column - 0) }}</span>
        <template slot="title">
          <div class="header">
            <div class="txt">
              <div></div>
              <span>用户列表</span>
            </div>
            <div class="search">
              <a-input-group compact>
                <a-select style="width: 15%" @change="handleChange" default-value="所有人">
                  <a-select-option :value="-1">所有人</a-select-option>
                  <a-select-option :value="1">男</a-select-option>
                  <a-select-option :value="0">女</a-select-option>
                </a-select>
                <a-input-search style="width: 50%" placeholder="请输入微信昵称" enter-button @search="onSearch" />
              </a-input-group>
            </div>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
// 导入工具类转换时间戳
import { formatTime } from '@/utils/dateUtil'
export default {
  name: 'UserList',
  data () {
    return {
      // 表格的一栏数据格式
      columns: [
        {
          title: '用户ID',
          dataIndex: 'user_id',
          rowKey: 'user_id',
          width: 40
        },
        {
          title: '微信头像',
          dataIndex: 'avatarUrl',
          rowKey: 'avatarUrl',
          width: 80,
          scopedSlots: { customRender: 'avatarUrl' }
        },
        {
          title: '微信昵称',
          dataIndex: 'nickName',
          rowKey: 'nickName',
          width: 80
        },
        {
          title: '性别',
          dataIndex: 'gender',
          rowKey: 'gender',
          width: 40,
          scopedSlots: { customRender: 'gender' }
        },
        {
          title: '国家',
          dataIndex: 'country',
          rowKey: 'country',
          width: 80
        },
        {
          title: '余额',
          dataIndex: 'gold',
          rowKey: 'gold',
          width: 80
        },
        {
          title: '注册时间',
          dataIndex: 'create_time',
          rowKey: 'create_time',
          width: 80,
          scopedSlots: { customRender: 'create_time' }
        }
      ],
      // 页面数据
      data: {},
      // 分页器的配置
      pagination: {
        total: 0,
        defaultPageSize: 10
      },
      loading: false,
      // 查询性别 -1 : 所有   0 : 女   1 : 男
      selectValue: -1
    }
  },
  methods: {
    //   获取用户列表
    getUserList (params) {
      this.loading = true
      this.$api.user
        .getUserList({
          page: (params && params.page) || 1,
          gender: this.selectValue,
          name: (params && params.name) || ''
        })
        .then(res => {
          // 每页数量
          this.pagination.defaultPageSize = res.limit
          // 总数量
          this.pagination.total = res.count
          this.data = res
          this.loading = false
        })
    },
    formatTime,
    // 当点击分页时触发
    paginationChange (pagination) {
      const { current } = pagination
      this.getUserList({
        page: current
      })
    },
    // 点击查询按钮触发该事件
    onSearch (value) {
      this.getUserList({
        name: value.trim()
      })
    },
    // 选择器选择触发
    handleChange (value) {
      this.selectValue = value
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
#UserList {
  background-color: #fff;

  .table {
    padding: 0 20px;
  }
}
.header {
  padding: 20px 0;
  border-bottom: #eef1f5 1px solid;
  .txt {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    & > div {
      height: 14px;
      width: 4px;
      background-color: #00aeff;
      margin-right: 8px;
    }
  }
}
</style>
