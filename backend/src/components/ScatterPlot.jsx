import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload.data;
        return (
            <div className="custom-tooltip">
                <p>{`Número de habitaciones: ${data.numberOfRooms}`}</p>
                <p>{`Hash de la plataforma: ${data.platform_hash}`}</p>
            </div>
        );
    }

    return null;
};

const ScatterPlot = ({ data, bounds, xQuantiles, yQuantiles }) => {
    const formattedData = data.map(item => ({ x: item.x, y: item.y, data: item.data }));

    return (
        <ScatterChart width={600} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Superficie" unit="m²" domain={[bounds.min, bounds.max]} />
            <YAxis type="number" dataKey="y" name="Precio" unit="€" domain={[yQuantiles.bottom, yQuantiles.top]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Legend />
            <Scatter name="Propiedades" data={formattedData} fill="#8884d8" />
        </ScatterChart>
    );
};

export default ScatterPlot;
