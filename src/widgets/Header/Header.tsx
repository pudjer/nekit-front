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
    <AppBar >
      <Toolbar className={styles.header}>

      <Link to={'/home'}>
        <img src={logo}/>
      </Link>

      {[{title: "ДОМОЙ", to: '/home'}, {title: "ПОРТФЕЛИ", to: '/portfolios'}].map((link, index) => (
        <Typography variant="h5" margin={1}  key={index}>
            <Link to={link.to}>
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
