import React from 'react';
import Card from 'material-ui/card/Card';
import Logo from './res/logo-elos.png';
import styles from './styles.module.css';

const Header = () => {
  return (
    <div>
      <Card className={styles.headerCard}>
        <img src={Logo} className={styles.elosLogo}/>
        <h1 className={styles.title}>
          <span className={styles.planetTitle}>Planet</span>
          <span className={styles.managerTitle}>Manager</span>
        </h1>
      </Card>
      <div className={styles.navSpan}></div>
    </div>
  );
};

export default Header;
