import { ref, nextTick, type Ref } from 'vue'

export interface EditingCell {
  row: number
  col: string
}

export interface UseEditableOptions {
  editable?: boolean,
  data: any[][] | Record<string, any>[]; // 根据实际数据结构调整类型
}

export function useEditable(
  props: UseEditableOptions,
  emit: (event: 'cell-change', payload: { 
    row: number, 
    col: string, 
    value: any, 
    oldValue: any 
  }) => void
) {
  // 当前正在编辑的单元格
  const editingCell = ref<EditingCell>({ row: -1, col: '' })
  // 输入框引用
  const cellInput = ref<HTMLInputElement | null>(null)

  // 检查指定单元格是否正在编辑
  const isEditing = (rowIndex: number, colProp: string) => {
    return props.editable && 
           editingCell.value.row === rowIndex && 
           editingCell.value.col === colProp
  }

  // 处理单元格双击事件
  const handleCellDoubleClick = (row: any, column: any, rowIndex: number) => {
    if (!props.editable) return
    
    const oldValue = row[column.property]
    
    editingCell.value = {
      row: rowIndex,
      col: column.property
    }

    nextTick(() => {
      if (cellInput.value) {
        cellInput.value.focus()
        // 全选文本方便直接编辑
        cellInput.value.select()
      }
    })

    // 返回旧值用于可能的撤销操作
    return oldValue
  }

  // 完成编辑
  const finishEdit = () => {
    if (editingCell.value.row === -1) return
    
    const { row, col } = editingCell.value
    emit('cell-change', {
      row,
      col,
      value: props.data[row][col],
      oldValue: props.data[row][col] // 实际应用中这里应该保存编辑前的值
    })
    
    editingCell.value = { row: -1, col: '' }
  }

  // 开始编辑指定单元格
  const startEdit = (rowIndex: number, colProp: string) => {
    editingCell.value = { row: rowIndex, col: colProp }
    nextTick(() => {
      if (cellInput.value) {
        cellInput.value.focus()
        cellInput.value.select()
      }
    })
  }

  // 取消编辑
  const cancelEdit = () => {
    editingCell.value = { row: -1, col: '' }
  }

  return {
    editingCell,
    cellInput,
    isEditing,
    handleCellDoubleClick,
    finishEdit,
    startEdit,
    cancelEdit
  }
}