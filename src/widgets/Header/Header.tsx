import React from 'react';
import { AppBar,Typography, Link, Toolbar} from "@mui/material"
import logo from './logo.svg';
import styles from './Header.module.css'
import ProfileButton from '../ProfileButton/ProfileButton';


const Header: React.FC = () => {
  return (
    <AppBar >
      <Toolbar className={styles.header}>

      <Link href='home'>
        <img src={logo} alt="Logo" />
      </Link>

      <div className={styles.links}>
        {[{title: "spot", href: 'fasdf'}].map((link, index) => (
          <Typography variant="h5">

              <a key={index} href={link.href}>
                {link.title}
              </a>
          </Typography>
        ))}
      </div>


      <div>
        <Typography variant="h6" align="right">
          <ProfileButton/>
        </Typography>
      </div>
      </Toolbar>

    </AppBar>
  );
};

export default Header;
