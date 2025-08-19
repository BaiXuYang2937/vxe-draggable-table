import { ref, type Ref, reactive } from 'vue'

export interface UseSelectableOptions {
    selectable?: boolean
    data?: any[]
    columns?: any[]
}

export function useSelectable(
    props: UseSelectableOptions,
    emit: (event: 'selection-change', selectedCells: Set<string>) => void
) {
    // 选中的单元格集合 (格式: "rowIndex-colProp")
    const selectedCells = ref<Set<string>>(new Set())
    // 表格引用
    const tableRef = ref<any>(null)

    // 拖拽选择状态
    const dragState = reactive({
        isSelecting: false,
        startSelection: null as null | { row: number; col: string }
    })

    // 处理单元格点击事件
    const handleCellClick = (event: MouseEvent, row: any, column: any, rowIndex: number) => {
        if (!props.selectable) return

        const cellKey = `${rowIndex}-${column.property}`

        // 如果没有按住Ctrl/Cmd键，清空之前的选择
        if (!event.ctrlKey && !event.metaKey) {
            selectedCells.value.clear()
        }

        // 切换当前单元格的选中状态
        if (selectedCells.value.has(cellKey)) {
            selectedCells.value.delete(cellKey)
        } else {
            selectedCells.value.add(cellKey)
        }

        emitSelectionChange()
    }

    // 处理鼠标按下事件 - 开始框选
    const handleCellMouseDown = (event: MouseEvent, row: any, column: any, rowIndex: number) => {
        if (!props.selectable) return

        const cellKey = `${rowIndex}-${column.property}`

        // 只处理框选逻辑
        if (!selectedCells.value.has(cellKey)) {
            dragState.isSelecting = true
            dragState.startSelection = { row: rowIndex, col: column.property }

            if (!event.ctrlKey && !event.metaKey) {
                selectedCells.value.clear()
            }
            selectedCells.value.add(cellKey)
            emitSelectionChange()
            event.preventDefault()
        }
    }

    // 处理鼠标抬起事件
    const handleCellMouseUp = () => {
        if (dragState.isSelecting) {
            dragState.isSelecting = false
            dragState.startSelection = null
        }
    }

    // 处理鼠标进入单元格事件 - 更新框选区域
    const handleCellMouseEnter = (row: any, column: any, rowIndex: number) => {
        if (!props.selectable || !dragState.isSelecting || !dragState.startSelection) return

        updateSelection(dragState.startSelection, { row: rowIndex, col: column.property })
        emitSelectionChange()
    }

    // 更新选择区域
    const updateSelection = (start: { row: number; col: string }, end: { row: number; col: string }) => {
        if (!props.columns) return

        selectedCells.value.clear()

        const startRow = Math.min(start.row, end.row)
        const endRow = Math.max(start.row, end.row)

        const startColIndex = props.columns.findIndex((col: any) => col.prop === start.col)
        const endColIndex = props.columns.findIndex((col: any) => col.prop === end.col)
        const startCol = Math.min(startColIndex, endColIndex)
        const endCol = Math.max(startColIndex, endColIndex)

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const cellKey = `${r}-${props.columns[c].prop}`
                selectedCells.value.add(cellKey)
            }
        }
    }

    // 清除所有选择
    const clearSelection = () => {
        selectedCells.value.clear()
        emitSelectionChange()
    }

    // 获取当前选中的单元格数据
    const getSelectedData = () => {
        if (!props.data || !props.columns) return []

        return Array.from(selectedCells.value).map(key => {
            const [rowIndex, colProp] = key.split('-')
            return {
                row: parseInt(rowIndex),
                col: colProp,
                value: props.data?.[parseInt(rowIndex)]?.[colProp] ?? undefined
            }
        })
    }

    // 触发选择变化事件
    const emitSelectionChange = () => {
        emit('selection-change', new Set(selectedCells.value))
    }

    return {
        tableRef,
        selectedCells,
        handleCellClick,
        handleCellMouseDown,
        handleCellMouseUp,
        handleCellMouseEnter,
        clearSelection,
        getSelectedData,
        updateSelection
    }
}