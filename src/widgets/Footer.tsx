import { Typography, Container } from '@mui/material';


export const Footer = () => {

  return (
    <footer style={{
      textAlign: 'center',
      position: "fixed",
      right: "0",
      bottom: "0"

      }}>
      <Container maxWidth="sm">
        <Typography variant="body1">
          Powered by CoinGecko
        </Typography>
      </Container>
    </footer>
  );
};


