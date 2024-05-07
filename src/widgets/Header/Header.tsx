import React from 'react';
import { AppBar,Typography, Toolbar} from "@mui/material"
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import styles from './Header.module.css'
import ProfileButton from '../ProfileButton/ProfileButton';
import { observer } from 'mobx-react-lite';
import PortfolioSelect from '../PortfolioButton/PortfolioButton';


const Header: React.FC = observer(() => {
  return (
    <AppBar >
      <Toolbar className={styles.header}>

      <Link to={'/home'}>
        <img src={logo} alt="Logo" />
      </Link>

      <div className={styles.links}>
        {[{title: "home", to: '/home'}, {title: "portfolios", to: '/portfolios'}].map((link, index) => (
          <>
            <Typography variant="h5" margin={1}>
                <Link key={index} to={link.to}>
                  {link.title}
                </Link>
            </Typography>
          </>
        ))}
      </div>

      <PortfolioSelect/>
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
