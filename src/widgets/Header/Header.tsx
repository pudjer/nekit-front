import React from 'react';
import { AppBar,Typography, Toolbar, Button} from "@mui/material"
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import styles from './Header.module.css'
import ProfileButton from '../ProfileButton/ProfileButton';
import { observer } from 'mobx-react-lite';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';


const Header: React.FC = observer(() => {
  const nav = useNavigate()
  return (
    <AppBar sx={{width: "100vw", margin: 0}}>
      <Toolbar className={styles.header}>

      <Link to={'/'}>
        <Typography className={styles.icon}  variant='h4'>CoinTrackX</Typography>
      </Link>

      {[{title: "ОБЗОР РЫНКА", to: '/home'}, {title: "ПОРТФЕЛИ", to: '/portfolios'}].map((link, index) => (
        <Typography  variant="h5" margin={1}  key={index}>
            <Link to={link.to} className={styles.links}>
              {link.title}
            </Link>
        </Typography>
      ))}

      <CurrencySelect/>
      <div>
        <Typography variant="h6" align="right">
          <ProfileButton/>
        </Typography>
      </div>
      </Toolbar>

    </AppBar>
  );
});

export default Header;
