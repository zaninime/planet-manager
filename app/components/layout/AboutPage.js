import React from 'react';
import Radium, { Style } from 'radium';
import BackButton from 'app/components/connected/BackButton';
import Section from 'app/components/layout/Section';
import disclaimerText from './AboutPage/license-disclaimer.txt';

const styles = {
    body: {
        backgroundColor: 'white',
        WebkitUserSelect: 'none',
    },
    backButton: {
        position: 'absolute',
        left: '20px',
        top: '20px',
        zIndex: 1,
    },
    content: {
        position: 'fixed',
        top: '0px',
        bottom: '0px',
        width: '100%',
        overflowY: 'auto',
        zIndex: 0,
    },
    planetManager: {
        textAlign: 'left',
    },
    disclaimer: {
        whiteSpace: 'pre-wrap',
        fontFamily: 'Roboto, sans-serif',
    },
};

const AboutPage = () => (
    <div>
        <Style rules={{ body: styles.body }} />

        <BackButton style={styles.backButton} />

        <div style={styles.content}>
            <Section title="About us">
                <div style={styles.planetManager}>
                    <h1>Planet Manager</h1>

                    <p>
                      Copyright &copy; 2016-present ELOS Planet Manager contributors. All rights reserved.
                    </p>

                    <p>
                      This program is free software; you can redistribute
                      it and/or modify it under the terms of the GNU
                      General Public License version 2 as published by
                      the Free Software Foundation.
                    </p>

                    <p>
                      You can find a copy of the source code and licensing terms at:&nbsp;
                      <a
                          href="https://github.com/zaninime/planet-manager"
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          https://github.com/zaninime/planet-manager
                      </a>
                      .
                    </p>

                    <h2>Open Source Licenses</h2>
                    <pre style={styles.disclaimer}>
                        <p>{disclaimerText}</p>
                    </pre>
                </div>
            </Section>
        </div>
    </div>
);

export default Radium(AboutPage);
