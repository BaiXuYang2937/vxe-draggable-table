import { Component } from 'vue'

export interface ColumnConfig {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
}

export interface CellPosition {
  row: number
  col: string
}

export interface CellChangeEvent {
  row: number
  col: string
  value: any
  oldValue: any
}

export interface DragCompleteEvent {
  from: CellPosition
  to: CellPosition
  value: any
}

declare const _default: {
  install: (app: any, options?: any) => void
}

export declare const DraggableTable: Component

export default _default