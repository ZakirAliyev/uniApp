import './index.scss'

import React from 'react';
import Chart1 from "../Chart1/index.jsx";
import Chart2 from "../Chart2/index.jsx";

function Index(props) {
    return (
        <>
            <h2 style={{
                padding: '16px',
                fontSize: '30px',
                color: '#252D37'
            }}>İdarəetmə paneli</h2>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: 'center',
                height: '100%',
                marginTop: '-67px',
                backgroundColor: '#f1f1f1'
            }}>
                <Chart1/>
                <Chart2/>
            </div>
            <p style={{
                width: '100%',
                textAlign: 'center',
            }}>© 2024 · v1.0.0</p>
        </>
    );
}

export default Index;