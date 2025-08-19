基于 VXE Table 的增强版可拖拽表格组件，支持单元格拖拽、选区编辑等高级功能

功能特性
🖱️ 单元格拖拽 - 自由拖拽单元格调整数据位置

✏️ 双击编辑 - 双击单元格直接编辑内容

🎯 多选操作 - 支持Ctrl/Shift多选单元格

📋 框选区域 - 鼠标拖拽框选单元格区域

⌨️ 快捷键支持 - Delete/Backspace快速清空选中单元格

🔢 公式支持 - 内置基础公式计算功能

🎨 主题定制 - 支持自定义主题样式

安装
使用npm安装：

bash
npm install vxe-draggable-table
或使用yarn：

bash
yarn add vxe-draggable-table
快速开始
全局注册
javascript
import { createApp } from 'vue'
import VXETable from 'vxe-table'
import VXEDraggableTable from 'vxe-draggable-table'

const app = createApp(App)
app.use(VXETable)
app.use(VXEDraggableTable)

app.mount('#app')
组件使用
vue
<template>
  <vxe-draggable-table
    :data="tableData"
    :columns="tableColumns"
    :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
    @cell-change="handleCellChange"
  />
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25, department: '研发部' },
  { id: 2, name: '李四', age: 30, department: '市场部' }
])

const tableColumns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 100 },
  { field: 'department', title: '部门', width: 200 }
])

const handleCellChange = ({ row, column, value }) => {
  console.log('单元格内容变更：', row, column.field, value)
}
</script>
API 文档
Props
属性名	类型	默认值	说明
data	Array	[]	表格数据
columns	Array	[]	列配置
edit-config	Object	{ trigger: 'dblclick', mode: 'cell' }	编辑配置
drag-config	Object	{ enabled: true }	拖拽配置
selection-config	Object	{ type: 'cell' }	选择配置
Events
事件名	参数	说明
cell-change	{ row, column, value }	单元格内容变更时触发
drag-complete	{ from, to }	拖拽完成时触发
selection-change	{ selection }	选中项变更时触发
方法
方法名	说明
getSelection()	获取当前选中单元格
clearSelection()	清空选中状态
startEdit(row, column)	开始编辑指定单元格
高级功能
自定义单元格渲染
vue
<vxe-draggable-table :data="tableData" :columns="columns">
  <template #name="{ row }">
    <span style="color: blue">{{ row.name }}</span>
  </template>
</vxe-draggable-table>
禁用特定列拖拽
javascript
const columns = ref([
  { field: 'id', title: 'ID', dragable: false }, // 禁用拖拽
  { field: 'name', title: '姓名' }
])
主题定制
在项目中创建样式文件覆盖默认变量：

scss
// variables.scss
$vxe-draggable-border-color: #409eff;
$vxe-draggable-selection-bg: #ecf5ff;

@import 'vxe-draggable-table/dist/style.css';
浏览器支持
现代浏览器 (Chrome, Firefox, Safari, Edge)

IE11 (需要额外polyfill)