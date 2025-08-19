import { reactive, Ref } from 'vue'

export function useDraggable(props: any, emit: any, selectedCells: Ref<Set<string>>) {
  const dragState = reactive({
    isDragging: false,
    startCell: null as null | { row: number; col: string },
    dragData: [] as Array<{ row: number; col: string; value: any }>,
    isSelecting: false,
    startSelection: null as null | { row: number; col: string }
  })

  /**
   * 处理拖拽开始事件
   * @param event - 拖拽事件对象
   * @param row - 当前行数据
   * @param column - 当前列配置
   * @param rowIndex - 当前行索引
   * @returns 如果拖拽未被选中单元格触发则返回false，否则无返回值
   */
  const handleDragStart = (event: DragEvent, row: any, column: any, rowIndex: number) => {
    const cellKey = `${rowIndex}-${column.property}`
    
    // 检查当前单元格是否被选中，未选中则不处理拖拽
    if (!selectedCells.value.has(cellKey)) {
      return false
    }
    
    // 设置拖拽状态和起始单元格位置
    dragState.isDragging = true
    dragState.startCell = { row: rowIndex, col: column.property }
    
    // 构造拖拽数据，包含所有选中单元格的行列信息和值
   dragState.dragData = Array.from(selectedCells.value).map((key: any) => {
  const [r, c] = key.split('-')
  return {
    row: parseInt(r),
    col: c,
    value: props.data[parseInt(r)][c]
  }
})
    
    // 设置拖拽效果和传输数据
    event.dataTransfer!.effectAllowed = 'move'
    event.dataTransfer!.setData('text/plain', JSON.stringify(dragState.dragData))
  }

    /**
     * 处理拖拽悬停事件的回调函数
     * @param event - 拖拽事件对象，包含拖拽相关的数据和操作信息
     */
    const handleDragOver = (event: DragEvent) => {
      // 当前处于拖拽状态时，阻止默认行为并设置拖拽效果
      if (dragState.isDragging) {
        event.preventDefault()
        event.dataTransfer!.dropEffect = 'move'
        const cellElement = event.currentTarget as HTMLElement
        cellElement.classList.add('drag-over')
      }
    }

  const handleDrop = (event: DragEvent, row: any, column: any, rowIndex: number) => {
    if (!dragState.isDragging || !dragState.dragData.length) return

    event.preventDefault()

    const dropRowIndex = rowIndex
    const dropColProp = column.property

    if (!dragState.startCell) return

    const startRow = dragState.startCell.row
    const startColIndex = props.columns.findIndex((col: any) => col.prop === dragState.startCell!.col)
    const dropColIndex = props.columns.findIndex((col: any) => col.prop === dropColProp)

    const rowOffset = dropRowIndex - startRow
    const colOffset = dropColIndex - startColIndex

    const movedCells = dragState.dragData.map(item => {
      const newRow = item.row + rowOffset
      const newColIndex = props.columns.findIndex((col: any) => col.prop === item.col) + colOffset
      const newColProp = props.columns[newColIndex]?.prop

      return {
        from: { row: item.row, col: item.col },
        to: { row: newRow, col: newColProp },
        value: item.value
      }
    })

    emit('drag-complete', movedCells)
    
    dragState.isDragging = false
    dragState.startCell = null
    dragState.dragData = []
  }

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDrop
  }
}