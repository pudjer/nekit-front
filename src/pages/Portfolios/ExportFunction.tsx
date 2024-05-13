import { StoreInstance } from "@/Store/Store";
import { FuturesTable, futuresColumns } from "@/widgets/FuturesTable/FuturesTable";
import { PosTable } from "@/widgets/PosTable/PosTable";
import { SpotTable, spotColumns } from "@/widgets/SpotTable/SpotTable";
import ReactDOMServer from 'react-dom/server';


export const ExportFunction = () => {
  if(!StoreInstance.user?.portfolio){
    alert("select portfolio!!")
    return
  }
  if(!StoreInstance.currency){
    alert("select currency!!")
    return
  }

  let html = "<div><div>Futures</div>"
  html = html + ReactDOMServer.renderToStaticMarkup(<PosTable onSelect={()=>undefined} cols={futuresColumns} positions={StoreInstance.user.portfolio.futuresPositions || []}/>)
  html = html + "<div>Spot</div>"
  html = html + ReactDOMServer.renderToStaticMarkup(<PosTable onSelect={()=>undefined} cols={spotColumns} positions={StoreInstance.user.portfolio.spotPositions || []}/>)
  html = html + "</div>"
  
  download("report.html", cleanUp(html))

}



export function portfolioToString(){
  let FuturesTable = "Фьючерс-позиции\n"
  futuresColumns.forEach(e=>{
    FuturesTable += e.label + '\t'
  })
  StoreInstance.user?.portfolio?.futuresPositions?.forEach((pos)=>{
    FuturesTable += '\n'
    futuresColumns.forEach(e=>{
      FuturesTable += e.format(pos) + '\t'
    })
  })
  let SpotTable = "Спот-позиции\n"
  futuresColumns.forEach(e=>{
    SpotTable += e.label + '\t'
  })
  StoreInstance.user?.portfolio?.spotPositions?.forEach((pos)=>{
    SpotTable += '\n'
    spotColumns.forEach(e=>{
      SpotTable += e.format(pos) + '\t'
    })
  })
  return FuturesTable + SpotTable
}

function cleanUp(htmlString: string) {
  htmlString = htmlString.replace(/class="[^"]*"/g, '');

  htmlString = htmlString.replace(/style="[^"]*"/g, '');
  htmlString = htmlString.replace(/<img[^>]*>/g, '');
  return htmlString;
}

function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

