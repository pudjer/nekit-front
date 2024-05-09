import React from 'react';
import { AppBar,Typography, Toolbar, Button} from "@mui/material"
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import styles from './Header.module.css'
import ProfileButton from '../ProfileButton/ProfileButton';
import { observer } from 'mobx-react-lite';
import PortfolioSelect from '../PortfolioSelect/PortfolioSelect';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';
import { StoreInstance } from '@/Store/Store';


const Header: React.FC = observer(() => {
  const nav = useNavigate()
  return (
    <AppBar >
      <Toolbar className={styles.header}>

      <Link to={'/home'}>
        <img src={logo}/>
      </Link>

      {[{title: "home", to: '/home'}, {title: "portfolios", to: '/portfolios'}].map((link, index) => (
        <Typography variant="h5" margin={1}>
            <Link key={index} to={link.to}>
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
