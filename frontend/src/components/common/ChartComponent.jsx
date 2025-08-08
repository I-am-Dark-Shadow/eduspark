import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const ChartComponent = ({ type, data, dataKey, nameKey }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-slate-500">No data available to display chart.</div>
  }

  // Responsive Change: Smaller font size for the legend on all screens
  const legendStyle = { fontSize: '12px' };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            {/* Responsive Change: Smaller font size and interval to prevent overlap */}
            <XAxis dataKey={nameKey} tick={{ fill: '#64748b', fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
            <Legend wrapperStyle={legendStyle} />
            <Bar dataKey={dataKey} fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            {/* Responsive Change: Dynamic radius and smaller label font size */}
            <Pie 
              data={data} 
              dataKey={dataKey} 
              nameKey={nameKey} 
              cx="50%" 
              cy="50%" 
              outerRadius="80%" // Use percentage to scale with container
              fill="#8884d8" 
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                // Only show label if percentage is significant
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
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
            <Legend wrapperStyle={legendStyle} iconSize={12} />
          </PieChart>
        );
      case 'line':
       return (
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            {/* Responsive Change: Smaller font size and interval to prevent overlap */}
            <XAxis dataKey={nameKey} tick={{ fill: '#64748b', fontSize: 12 }} interval="preserveStartEnd"/>
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }}/>
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}/>
            <Legend wrapperStyle={legendStyle} />
            <Line type="monotone" dataKey={dataKey} stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} dot={false} />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    // Responsive Change: Adjusted height for a better mobile fit
    <ResponsiveContainer width="100%" height={280}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default ChartComponent;