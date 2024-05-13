import { Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, Button, Table } from "@mui/material";
import styles from "./PosTable.module.css"

import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { DefaultComponentProps, OverridableTypeMap } from "@mui/material/OverridableComponent";

export interface Column<T = any> {
  id: string;
  label: string;
  minWidth?: number;
  align?: "center" | "left" | "right" | "inherit" | "justify" | undefined
  format: (value: T) => React.ReactNode, [key: string]: any,
  toCompare?: (a: T, b: T)=>number
}




type TTable = <T extends {_id: string, [key: string]: any}[], TypeMap extends OverridableTypeMap>(props: {onSelect: (pos: T[number])=>void, positions: T, cols: Column<T[number]>[], highlighted?: (value: T[number])=>"darkred" | "darkgreen" |undefined} & DefaultComponentProps<TypeMap>)=>React.ReactNode
enum Compare{
  NOT,
  GREATER,
  LESS
}
export const PosTable: TTable = observer(({onSelect, positions, cols, highlighted,  ...rest}) => {
  const [hidden, Hide] = useState<Column[]>([])
  const [columns, setColumns] = useState<Column[]>(cols)
  const [compare, setCompare] = useState<{column: string, how: Compare, compareFn: (a: any, b:any)=>number}>()


  const ref = React.useRef<number>()

  return (
    <Paper {...rest}>
      <TableContainer sx={{height: "100%", width: '100%' }} >
        {
          hidden.map(e=><Button color='success' onClick={()=>{Hide(hidden.filter(el=>el!==e)); setColumns([...columns, e])}} className={styles.hidden}>{e.label+" "}</Button>)
        }
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  
                  draggable
                  onDragStart={()=>ref.current = index}
                  onDragEnd={()=>ref.current = undefined}
                  onDrop={()=>{
                    if(ref.current===undefined)return
                    const copy = [...columns]
                    const started = copy[ref.current]
                    copy[ref.current] = column
                    copy[index] = started
                    setColumns([...copy])
                  }}
                  onDragOver={e=>{e.preventDefault() ; e.stopPropagation()}}
                >
                <span className={styles.column} onClick={()=>{Hide([...hidden, column]); setColumns(columns.filter(e=>e!==column))}}>{column.label}</span>
                {column.toCompare && <>
                  <span 
                    style={(compare?.column===column.id) && (compare.how===Compare.LESS) ? {color: "cyan", margin:5} : {margin:5}}
                    onClick={()=>setCompare({
                      compareFn: column.toCompare!.bind(column),
                      column: column.id,
                      how: (compare?.column===column.id) && (compare.how===Compare.LESS) ? Compare.NOT : Compare.LESS 
                    })}>↓</span>
                  <span
                    style={(compare?.column===column.id) && (compare.how===Compare.GREATER) ? {color: "cyan", margin:5} : {margin:5}}
                    onClick={()=>setCompare({
                      compareFn: column.toCompare!.bind(column),
                      column: column.id,
                      how: (compare?.column===column.id) && (compare.how===Compare.GREATER) ? Compare.NOT : Compare.GREATER 
                    })}>↑</span>
                </>}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {positions
              ?.slice()
              .sort(compare?.how && (compare.how === Compare.GREATER ? compare.compareFn : ((a:any, b:any)=>compare.compareFn(b, a))) || (()=>0))
              .map((pos) => {
                const highlight = highlighted && highlighted(pos)
                return (
                  <TableRow id={pos._id} onClick={()=>onSelect(pos)} hover sx={highlight ? {backgroundColor: highlight} : {}}role="checkbox" tabIndex={-1} key={pos._id} >
                    {columns.map((column) => {
                      const value = column.format(pos);
                      
                      return (
                        <TableCell key={column.id} align={column.align}>
                            {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
})
