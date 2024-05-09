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
import { Typography } from '@mui/material';
import { useState } from 'react';
import styles from "./FuturesTable.module.css"
interface Column {
  id: 'symbol' | 'quantity' | 'initialPrice' | 'timestamp' | "currentPrice" | "currentVolume" | "initialVolume" | "volumeChange" | "priceChange";
  label: string;
  minWidth?: number;
  align?: 'right';
  format: (value: any) => React.ReactNode;
}

const columns: Column[] = [
  { id: 'symbol', label: 'symbol', format: (value: FuturesPosition) => value.symbol, },
  { id: 'quantity', label: 'quantity', format: (value: FuturesPosition) => value.quantity.toString(), },
  {
    id: 'initialPrice',
    label: 'initialPrice',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.initialPrice
      if(StoreInstance.currency){
        return price * StoreInstance.currency.exchangeRateToUsd +' '+ StoreInstance.currency.symbol
      }else{
        return price.toString()+' USD'
      }
    },
  },
  {
    id: 'timestamp',
    label: 'timestamp',
    align: 'right',
    format: (value: FuturesPosition) => (new Date(value.timestamp)).toLocaleString(),
  },
  {
    id: 'currentVolume',
    label: 'currentVolume',
    align: 'right',
    format: (value: FuturesPosition) => {
      const volume = value.getCurrentVolume()
      if(!volume){
        return 'N/A'
      }
      if(StoreInstance.currency){
        return volume * StoreInstance.currency.exchangeRateToUsd +' '+ StoreInstance.currency.symbol
      }else{
        return (volume).toString() +' USD'
      }
    },
  },
  {
    id: 'initialVolume',
    label: 'initialVolume',
    align: 'right',
    format: (value: FuturesPosition) => {
      const volume = value.getInitialVolume()
      if(!volume){
        return 'N/A'
      }
      if(StoreInstance.currency){
        return volume * StoreInstance.currency.exchangeRateToUsd +' '+ StoreInstance.currency.symbol
      }else{
        return (volume).toString() +' USD'
      }
    },
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
      if(StoreInstance.currency){
        return price * StoreInstance.currency.exchangeRateToUsd +' '+ StoreInstance.currency.symbol
      }else{
        return price.toString()+' USD'
      }
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
    id: 'volumeChange',
    label: 'volumeChange',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getVolumeChange()
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

];



const formatChange = function(price: number, curr: string){
  return <Typography color={price<0?"error":"lightgreen"}>{(price>0?'+':'')+price+' '+curr}</Typography>
}

export const FuturesTable : React.FC<{onSelect: (pos: FuturesPosition)=>void}> = observer(({onSelect}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [hidden, Hide] = useState<Column['label'][]>([])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const filteredColumns = columns.filter(e=>!(hidden.includes(e.label)))
  return (
    <Paper sx={{ width: '100vw', overflow: 'hidden'}}>
      <TableContainer sx={{height: "60vh" }} >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {filteredColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={styles.column}
                >
                  <div onClick={()=>{Hide([...hidden, column.label])}}>{column.label}</div>
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
                    {filteredColumns.map((column) => {
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
        hidden.map(e=><div onClick={()=>{Hide(hidden.filter(el=>el!==e))}} className={styles.hidden}>{'+'+e+" "}</div>)
      }
    </Paper>
  );
})
