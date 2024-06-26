import { Typography, Paper } from '@mui/material';
import styles from "./WelcomPage.module.css"
import { PortfolioList } from '@/widgets/PortfolioList/PortfolioList';
import { Portfolio } from '@/Store/Portfolio';
import { useState, useEffect } from 'react';
import { Axios } from '@/api/Axios';
import { StoreInstance } from '@/Store/Store';
import { useNavigate } from 'react-router-dom';


export function WelcomePage() {
  const [publicPortfs, setPublicPortfs] = useState<Portfolio[]>([])
  const nav = useNavigate()
  useEffect(()=>{
    const res = Axios.get("/portfolios/public").then(res=>res.data.map((portf: Portfolio)=>Portfolio.fromProps(portf)))
    res.then(e=>setPublicPortfs(e))
  }, [])
  const handleSelectPortfolio = (portfolio: Portfolio) => {
    StoreInstance.portfolio = (portfolio);
    nav("/portfolios?portfolio="+StoreInstance.portfolio?._id, {replace: true})
  };
  return (<div className={styles.page}>
      <Paper className={styles.description} sx={{borderRadius: 10, padding: 10, margin: 5}}>
        <Typography sx={{marginY: 5}} className={styles.typography} variant="h2" gutterBottom>
          CoinTrackX - Ваш персональный ассистент для учета криптовалютных сделок
        </Typography>
        <Typography className={styles.typography} variant="h3" gutterBottom>
          Особенности CoinTrackX:
        </Typography>
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
        <Typography className={styles.typography+" "+styles.listItems} variant="h6" paragraph>
          <strong>Простой и Интуитивный Интерфейс</strong>: Наш пользовательский интерфейс разработан с акцентом на простоту и понятность. Даже новички смогут легко освоиться и начать вести учет своих криптовалютных сделок.
        </Typography>
        <Typography className={styles.typography+" "+styles.listItems} variant="h6" paragraph>
          <strong>Мультивалютная Поддержка</strong>: CoinTrackX поддерживает широкий спектр криптовалют, позволяя вам отслеживать портфель с разнообразием активов.
        </Typography>
        <Typography className={styles.typography+" "+styles.listItems} variant="h6" paragraph>
          <strong>Автоматические Обновления Курсов</strong>: Мы автоматически обновляем курсы криптовалют, чтобы вы могли всегда видеть актуальную стоимость своих активов.
        </Typography>
        <Typography className={styles.typography+" "+styles.listItems} variant="h6" paragraph>
          <strong>Отчеты и Аналитика</strong>: Получайте детальные отчеты и аналитику о вашем портфеле для принятия осознанных решений о вашей стратегии инвестирования.
        </Typography>
        </div>
        <Typography className={styles.typography} variant="h6" gutterBottom>
          Начните Учет Прямо Сейчас!
        </Typography>
      </Paper>
      <div className={styles.list}>
        <Typography className={styles.listHeader} variant="h3" gutterBottom>
          Публичные портфели
        </Typography>
        <div style={{height: "90%"}}>
        <PortfolioList handleSelect={handleSelectPortfolio} portfolios={publicPortfs}/>
        </div>
      </div>
      </div>);
}

