import React from 'react';
import { Container, Typography, Button } from '@mui/material';

export function WelcomePage() {
  return (
    <Container maxWidth="md" sx={{ width: "100%" }}>
      <Typography variant="h2" gutterBottom>
        CoinTrackX: Ваш персональный ассистент для учета криптовалютных сделок
      </Typography>
      <Typography variant="h3" paragraph>
        Приветствуем вас на CoinTrackX – вашем интуитивно понятном помощнике для эффективного учета криптовалютных операций. Независимо от того, являетесь ли вы опытным трейдером или новичком в мире криптовалют, CoinTrackX обеспечивает все необходимое для того, чтобы упростить ваш опыт учета и анализа.
      </Typography>
      <Typography variant="h3" gutterBottom>
        Особенности CoinTrackX:
      </Typography>
      <Typography variant="h2" paragraph>
        1. <strong>Простой и Интуитивный Интерфейс</strong>: Наш пользовательский интерфейс разработан с акцентом на простоту и понятность. Даже новички смогут легко освоиться и начать вести учет своих криптовалютных сделок.
      </Typography>
      <Typography variant="h3" paragraph>
        2. <strong>Полная История Транзакций</strong>: Ведите учет всех ваших покупок, продаж и обменов криптовалют с подробными данными истории транзакций.
      </Typography>
      <Typography variant="body1" paragraph>
        3. <strong>Мультивалютная Поддержка</strong>: CoinTrackX поддерживает широкий спектр криптовалют, позволяя вам отслеживать портфель с разнообразием активов.
      </Typography>
      <Typography variant="body1" paragraph>
        4. <strong>Автоматические Обновления Курсов</strong>: Мы автоматически обновляем курсы криптовалют, чтобы вы могли всегда видеть актуальную стоимость своих активов.
      </Typography>
      <Typography variant="body1" paragraph>
        5. <strong>Отчеты и Аналитика</strong>: Получайте детальные отчеты и аналитику о вашем портфеле для принятия осознанных решений о вашей стратегии инвестирования.
      </Typography>
      <Typography variant="h5" gutterBottom>
        Начните Учет Прямо Сейчас!
      </Typography>
    </Container>
  );
}

