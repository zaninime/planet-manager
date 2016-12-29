import React from 'react';
import { Link } from 'react-router';
import disclaimerText from './AboutPage/license-disclaimer.txt';

const styles = {
    container: {
        padding: '1em',
    },
};

const AboutPage = () => (
    <div style={styles.container}>
        <h1>Planet Manager</h1>
        <Link to="/">Go back</Link>
        <p>Copyright &copy; 2016-present ELOS Planet Manager contributors. All rights reserved.</p>
        <p>
            This program is free software; you can redistribute
            it and/or modify it under the terms of the GNU
            General Public License version 2 as published by
            the Free Software Foundation.
        </p>
        <p>
            You can find a copy of the source code and licensing terms at:&nbsp;
            <a href="https://github.com/zaninime/planet-manager" target="_blank" rel="noopener noreferrer">
                https://github.com/zaninime/planet-manager
            </a>.
        </p>
        <h2>Open Source Licenses</h2>
        <pre style={{ fontFamily: 'Roboto, sans-serif' }}>
            {disclaimerText}
        </pre>
    </div>
);

export default AboutPage;
