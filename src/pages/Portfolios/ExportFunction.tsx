import { StoreInstance } from "@/Store/Store";
import { futuresColumns } from "@/widgets/FuturesTable/FuturesTable";
import { PosTable } from "@/widgets/PosTable/PosTable";
import { spotColumns } from "@/widgets/SpotTable/SpotTable";
import ReactDOMServer from 'react-dom/server';


export const ExportFunction = () => {
  if(!StoreInstance.portfolio){
    alert("select portfolio!!")
    return
  }
  if(!StoreInstance.currency){
    alert("select currency!!")
    return
  }

  let html = "<div><div>Futures</div>"
  html = html + ReactDOMServer.renderToStaticMarkup(<PosTable onSelect={()=>undefined} cols={futuresColumns} positions={StoreInstance.portfolio.futuresPositions || []}/>)
  html = html + "<div>Spot</div>"
  html = html + ReactDOMServer.renderToStaticMarkup(<PosTable onSelect={()=>undefined} cols={spotColumns} positions={StoreInstance.portfolio.spotPositions || []}/>)
  html = html + "</div>"
  
  return cleanUp(html)

}



function cleanUp(htmlString: string) {
  htmlString = htmlString.replace(/class="[^"]*"/g, '');

  htmlString = htmlString.replace(/style="[^"]*"/g, '');
  htmlString = htmlString.replace(/<img[^>]*>/g, '');
  return htmlString;
}

export function download() {
  const text = ExportFunction()
  if(!text)return
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', "report.html");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

