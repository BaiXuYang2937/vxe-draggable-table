<template>
    <div class="draggable-table-container">
        <el-table ref="tableRef" :data="processedData" style="width: 100%" v-bind="$attrs" @cell-click="handleCellClick"
            @cell-mouse-enter="handleCellMouseEnter" @cell-mouse-leave="handleCellMouseLeave">
            <el-table-column v-for="column in processedColumns" :key="column.prop" :prop="column.prop"
                :label="column.label" :width="column.width" :min-width="column.minWidth">
                <template #default="{ row, column, $index }">
                    <div :class="getCellClass(row, column, $index)" :data-row="$index" :data-col="column.property"
                        :draggable="selectedCells.has(`${$index}-${column.property}`)"
                        @mousedown="handleCellMouseDown($event, row, column, $index)"
                        @mouseup="handleCellMouseUp($event, row, column, $index)"
                        @dragstart="handleDragStart($event, row, column, $index)"
                        @dragover.prevent="handleDragOver($event, row, column, $index)"
                        @drop="handleDrop($event, row, column, $index)"
                        @dblclick="handleCellDoubleClick(row, column, $index)">
                        <slot name="cell" :row="row" :column="column" :index="$index"
                            :editing="isEditing($index, column.property)">
                            <input v-if="isEditing($index, column.property)" v-model="row[column.property]"
                                @blur="finishEdit" @keyup.enter="finishEdit" class="cell-input" ref="cellInput" />
                            <span v-else>{{ row[column.property] || '' }}</span>
                        </slot>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useDraggable } from '../composables/useDraggable'
import { useEditable } from '../composables/useEditable'
import { useSelectable } from '../composables/useSelectable'

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        default: () => []
    },
    draggable: {
        type: Boolean,
        default: true
    },
    editable: {
        type: Boolean,
        default: true
    },
    selectable: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:data', 'cell-change', 'drag-complete', 'selection-change'])

// 使用组合式函数
let { tableRef, selectedCells, handleCellClick, handleCellMouseDown,
    handleCellMouseUp, updateSelection } = useSelectable(props, emit)

let { editingCell, isEditing, handleCellDoubleClick,
    finishEdit, cellInput } = useEditable(props as {
        data: Record<string, any>[],
        columns: any[],
        draggable: boolean,
        editable: boolean,
        selectable: boolean
    }, emit)

let { dragState, handleDragStart, handleDragOver,
    handleDrop } = useDraggable(props, emit, selectedCells)

// 处理后的数据
const processedData = computed(() => [...props.data])

// 处理后的列配置
// 处理后的列配置
const processedColumns = computed(() => {
  return props.columns.map(col => {
    // 确保 col 是对象类型
    if (typeof col !== 'object' || col === null) {
      return {
        minWidth: 100
      }
    }

    return {
      ...(col as Record<string, any>),
      minWidth: (col as any).minWidth || (col as any).width || 100
    }
  })
})
// 获取单元格类名
const getCellClass = (row: any, column: any, rowIndex: number) => {
    const cellKey = `${rowIndex}-${column.property}`
    return {
        'draggable-cell': true,
        'selected-cell': selectedCells.value.has(cellKey),
        'drag-over': false
    }
}

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    selectedCells.value.forEach(cellKey => {
  const [rowIndex, colProp] = cellKey.split('-')
  const index = parseInt(rowIndex)
  const row = props.data[index]
  if (typeof row === 'object' && row !== null && colProp in row) {
    emit('cell-change', {
      row: index,
      col: colProp,
      value: '',
      oldValue: row[colProp]
    })
  }
})
  }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.account-container {
    padding: 20px;
}

.draggable-cell {
    position: relative;
    padding: 8px;
    cursor: pointer;
    user-select: none;
    height: 36px;
    transition: background-color 0.2s;
}

.draggable-cell:hover {
    background-color: #f5f7fa;
}

.selected-cell {
    background-color: #e6f7ff !important;
    border: 2px solid #1890ff;
}



.cell-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-size: inherit;
}

/* 表格样式优化 */
:deep(.el-table td) {
    padding: 0 !important;
}

:deep(.el-table .cell) {
    padding: 0 !important;
}

/* 拖拽时的视觉反馈 */
.draggable-cell.dragging {
    opacity: 0.5;
    transform: scale(0.95);
}

/* 选择框样式 */
.selection-box {
    position: absolute;
    border: 2px dashed #1890ff;
    background-color: rgba(24, 144, 255, 0.1);
    pointer-events: none;
    z-index: 1000;
}
</style>