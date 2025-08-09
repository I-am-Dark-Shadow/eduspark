// THIS IS THE CORRECTED LINE: All necessary chart components are now imported.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

// Uses the new color palette from your tailwind.config.js
const COLORS = ['#FF6B00', '#00C49F', '#f59e0b', '#ef4444', '#3b82f6'];

const ChartComponent = ({ type, data, dataKey, nameKey, performanceText  }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-on-surface-secondary">No data available to display chart.</div>
  }

  const legendStyle = { fontSize: '12px' };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={nameKey} tick={{ fill: '#A0A0B8', fontSize: 12 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#A0A0B8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'rgba(255, 107, 0, 0.1)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #EFF0F6', borderRadius: '0.5rem' }} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey={dataKey} fill="#FF6B00" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie 
              data={data} 
              dataKey={dataKey} 
              nameKey={nameKey} 
              cx="50%" 
              cy="50%" 
              outerRadius="80%"
              fill="#8884d8" 
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                if (percent < 0.05) return null;
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #EFF0F6', borderRadius: '0.5rem' }} />
            <Legend wrapperStyle={legendStyle} iconSize={12} />
          </PieChart>
        );
      case 'line':
       return (
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey={nameKey} tick={{ fill: '#A0A0B8', fontSize: 12 }} interval="preserveStartEnd" axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill: '#A0A0B8', fontSize: 12 }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #EFF0F6', borderRadius: '0.5rem' }}/>
            <Legend wrapperStyle={legendStyle} />
            <Line type="monotone" dataKey={dataKey} stroke="#00C49F" strokeWidth={3} activeDot={{ r: 8 }} dot={false} />
          </LineChart>
        );
      case 'radial':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart 
              innerRadius="80%" 
              outerRadius="100%" 
              data={data} 
              startAngle={180} 
              endAngle={-180}
              barSize={20}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              {/* The RadialBar now uses the dynamic fill color from the data */}
              <RadialBar
                background={{ fill: '#EFF0F6' }}
                dataKey={dataKey}
                angleAxisId={0}
                cornerRadius={10}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-3xl font-bold fill-on-surface"
              >
                {`${data[0][dataKey].toFixed(1)}%`}
              </text>
              {/* The text below the percentage is now dynamic */}
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-semibold"
                style={{ fill: data[0].fill }} // Use the same color for the text
              >
                {performanceText}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default ChartComponent;