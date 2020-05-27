<template>
  <div id="goods">
    <a-breadcrumb>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>商品分类</a-breadcrumb-item>
    </a-breadcrumb>
    <a-table
      :pagination="false"
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
    >
      <a-table
        slot="expandedRowRender"
        slot-scope="column"
        :columns="innerColumns"
        :data-source="column.cateArr"
        :pagination="false"
      >
        <a-avatar
          slot="image"
          shape="square"
          :size="60"
          slot-scope="imageColumn"
          :src="imageColumn"
        ></a-avatar>
        <!-- table上部区域 -->
        <template slot="title">
          <a-button @click="operationCategory({title:'新增类别', data: column.id})" icon="plus">新增类别</a-button>
        </template>
        <!-- 操作按钮区域 -->
        <template slot="operation" slot-scope="operationColumns">
          <div>
            <a-button
              type="primary"
              @click="operationCategory({title: '修改',data: operationColumns})"
            >修改</a-button>
          </div>
        </template>
      </a-table>
    </a-table>
    <!-- 新增或修改的对话框 -->
    <a-modal
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="modalCancel"
    >
      <a-form-model :rules="dialogRules" :model="editCateForm" ref="dialogRef" v-bind="layout">
        <a-form-model-item label="父级ID">
          <span>{{ editCateForm.pid }}</span>
        </a-form-model-item>
        <a-form-model-item v-if="title === '修改'" label="类别ID">
          <span>{{ editCateForm.id }}</span>
        </a-form-model-item>
        <a-form-model-item label="类别名" prop="name">
          <a-input v-model="editCateForm.name" />
        </a-form-model-item>
        <a-form-model-item label="类别图片地址" prop="image">
          <a-input v-model="editCateForm.image" />
          <a-avatar shape="square" :src="editCateForm.image" :size="80" v-if="editCateForm.image"></a-avatar>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort">
          <a-input v-model="editCateForm.sort" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      //   表格数据
      data: [],
      //   外层表格数据结构
      columns: [
        {
          dataIndex: 'id',
          title: '分类ID',
          width: '80'
        },
        {
          dataIndex: 'group_name',
          title: '分类名',
          width: '80'
        }
      ],
      //   内层表格数据结构
      innerColumns: [
        {
          dataIndex: 'parent_id',
          width: '80',
          title: '上级ID'
        },
        {
          dataIndex: 'category_id',
          width: '80',
          title: '类别ID'
        },
        {
          dataIndex: 'name',
          width: '80',
          title: '类别名'
        },
        {
          dataIndex: 'image',
          width: '80',
          title: '类别图片',
          scopedSlots: { customRender: 'image' }
        },
        {
          width: '80',
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 表单验证规则
      dialogRules: {
        name: [
          {
            required: true,
            message: '请输入类别名',
            trigger: 'blur'
          }
        ],
        image: [
          {
            required: true,
            message: '请输入图片地址',
            trigger: 'blur'
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }
        ]
      },
      // 控制对话框
      visible: false,
      // 动态生成title
      title: '',
      // 确定按钮加载中
      confirmLoading: false,
      // 修改或新增的参数
      editCateForm: {
        pid: '',
        name: '',
        image: '',
        sort: '10',
        id: ''
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      }
    }
  },
  methods: {
    //   获取类别列表
    getCategoryList () {
      this.$api.goods.cateList().then(res => {
        this.data = res
      })
    },
    // 对话框点击取消
    modalCancel (e) {
      this.$refs.dialogRef.resetFields()
      // 重置表单数据
      this.editCateForm = {
        pid: '',
        name: '',
        image: '',
        sort: '10',
        id: ''
      }
      this.visible = false
    },
    // 点击新增或修改类别按钮回触发该方法
    operationCategory (e) {
      const { editCateForm } = this
      const { title, data } = e
      if (title === '修改') {
        editCateForm.pid = data.parent_id
        editCateForm.id = data.category_id
        editCateForm.name = data.name
        editCateForm.image = data.image
        editCateForm.sort = data.sort
      } else {
        this.editCateForm.pid = data
      }
      // 设置对话款标题
      this.title = title
      // 打开对话框
      this.visible = true
    },
    // 当点击对话款确认
    async handleOk () {
      // console.log(111)
      const rule = await this.$refs.dialogRef.validate().catch(err => err)
      if (rule) {
        this.$api.goods.editCate(this.editCateForm).then(res => {
          this.$message.success(this.title + '成功')
          // 重置表单
          this.modalCancel()
        })
      }
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
#goods {
  background-color: #fff;
  padding: 15px;
}
</style>
