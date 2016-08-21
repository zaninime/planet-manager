import React from 'react';
import Radium from 'radium';

const styles = {
  container: {
    maxWidth: '700px',
    padding: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center'
  },
  header: {
    textTransform: 'uppercase',
    fontWeight: '300',
    marginTop: '0px',
    marginBottom: '40px'
  }
};

const Section = ({title, style, children}) => {
  return (
    <div style={[styles.container, style]}>
      <h1 style={styles.header}>{title}</h1>
      {children}
    </div>
  );
};

Section.propTypes = {
  title: React.PropTypes.string,
  style: React.PropTypes.object,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export default Radium(Section);
