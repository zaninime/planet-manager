import React from 'react';
import { Card } from 'material-ui/Card';
import Radium from 'radium';
import logo from './res/logo-elos.png';

var styles = {
  headerCard: {
    position: 'fixed',
    textAlign: 'center',
    width: '100%',
    height: '140px',
    zIndex: '5',
    color: '#fff',
    backgroundColor: '#00bcd4',
    padding: '30px',
    userSelect: 'none',
    pointerEvents: 'none'
  },
  elosLogo:{
    width: '200px',
    height: 'auto'
  },
  title: {
    color: 'white',
    margin: '20px 0 0 0'
  },
  planetTitle: {
    fontWeight: '100'
  },
  navSpan: {
    height: '140px'
  }
};

const Header = () => {
  return (
    <div>
      <Card style={styles.headerCard}>
        <img src={logo} style={styles.elosLogo}/>
        <h1 style={styles.title}>
          <span style={styles.planetTitle}>Planet</span>
          <span>Manager</span>
        </h1>
      </Card>
      <div style={styles.navSpan}></div>
    </div>
  );
};

export default Radium(Header);
