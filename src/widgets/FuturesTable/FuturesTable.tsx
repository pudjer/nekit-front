import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { StoreInstance } from '@/Store/Store';
import { observer } from 'mobx-react-lite';
import { FuturesPosition } from '@/Store/FuturesPosition';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import styles from "./FuturesTable.module.css"
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format: (value: any) => React.ReactNode;
}

const initColumns: Column[] = [
  {
    id: 'type',
    label: 'type',
    format: (value: FuturesPosition) => value.quantity < 0 ? <div style={{color: "red"}}>SHORT</div> : <div style={{color: "lightgreen"}}>LONG</div>
  },
  { 
    id: 'symbol',
    label: 'symbol',
    format: (value: FuturesPosition) => <div style={{display: "flex", alignItems: "flex-end"}}><img style={{width: 40}} src={StoreInstance.tokensMap.get(value.symbol)?.image}/>{value.symbol}</div> },
  { 
    id: 'quantity',
    label: 'quantity',
    format: (value: FuturesPosition) => value.quantity>0 ? value.quantity : -value.quantity },
  {
    id: 'initialPrice',
    label: 'initialPrice',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.initialPrice
      return StoreInstance.stringFromUSD(price)
    },
  },
  {
    id: 'margin',
    label: 'margin',
    format: (value: FuturesPosition) =>{
      const price = value.margin
      if(!price){
        return 'N/A'
      }
      return StoreInstance.stringFromUSD(price)
    }
  },
  {
    id: 'value',
    label: 'value',
    format: (value: FuturesPosition) => {
      const price = value.getValue()
      if(!price){
        return 'N/A'
      }
      return StoreInstance.stringFromUSD(price)
    }
  },
  {
    id: 'timestamp',
    label: 'timestamp',
    align: 'right',
    format: (value: FuturesPosition) => (new Date(value.timestamp)).toLocaleString(),
  },
  {
    id: 'currentPrice',
    label: 'currentPrice',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getCurrentPrice()
      if(!price){
        return 'N/A'
      }
      return StoreInstance.stringFromUSD(price)
    },
  },
  {
    id: 'priceChange',
    label: 'priceChange',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getPriceChange()
      if(!price){
        return 'N/A'
      }
      if(StoreInstance.currency){
        return formatChange(price * StoreInstance.currency.exchangeRateToUsd, StoreInstance.currency.symbol)
      }else{
        return formatChange(price, "USD")
      }
    },
  },
  {
    id: 'changePricePerc',
    label: 'changePricePerc',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getPriceChangePerc()
      return formatChange(price, "%")
    },
  },
  {
    id: 'changeValuePerc',
    label: 'changeValuePerc',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getValueChangePerc()
      return formatChange(price, "%")
    },
  },
  {
    id: 'exitPrice',
    label: 'exitPrice',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.exitPrice
      if(!price){
        return 'N/A'
      }
      if(StoreInstance.currency){
        return formatChange(price * StoreInstance.currency.exchangeRateToUsd, StoreInstance.currency.symbol, value.getVolumeChange())
      }else{
        return formatChange(price, "USD", value.getVolumeChange())
      }
    },
  },

];



const formatChange = function(price: number, curr: string, nice = price){
  return <Typography color={nice<0?"error":"lightgreen"}>{(nice>0?'+':'')+price+' '+curr}</Typography>
}

export const FuturesTable : React.FC<{onSelect: (pos: FuturesPosition)=>void}> = observer(({onSelect}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [hidden, Hide] = useState<Column[]>([])
  const [columns, setColumns] = useState<Column[]>(initColumns)
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const ref = React.useRef<number>()
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper sx={{ width: '100vw', overflow: 'hidden'}}>
      <TableContainer sx={{height: "60vh" }} >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={styles.column}
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
                <span onClick={()=>{Hide([...hidden, column]); setColumns(columns.filter(e=>e!==column))}}>{column.label}</span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {StoreInstance.user?.portfolio?.futuresPositions
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((pos) => {
                return (
                  <TableRow onClick={()=>onSelect(pos)} hover role="checkbox" tabIndex={-1} key={pos._id}>
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
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={StoreInstance.user?.portfolio?.futuresPositions?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {
        hidden.map(e=><Button color='success' onClick={()=>{Hide(hidden.filter(el=>el!==e)); setColumns([...columns, e])}} className={styles.hidden}>{e.label+" "}</Button>)
      }
    </Paper>
  );
})
