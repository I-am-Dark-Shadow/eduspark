import { useState, useEffect, useMemo } from 'react';
import ChartComponent from '../../common/ChartComponent';
import { format, getMonth, getYear } from 'date-fns';

const PerformanceGauge = ({ results }) => {
    const [selectedMonth, setSelectedMonth] = useState('all');

    // useMemo will efficiently calculate the list of available months only when the results change.
    const availableMonths = useMemo(() => {
        const monthSet = new Set();
        results.forEach(r => {
            const monthYear = format(new Date(r.createdAt), 'MMMM yyyy');
            monthSet.add(monthYear);
        });
        return Array.from(monthSet);
    }, [results]);

    useEffect(() => {
        // Set the default selection to the most recent month if available
        if (availableMonths.length > 0) {
            setSelectedMonth(availableMonths[0]);
        }
    }, [availableMonths]);

    if (results.length === 0) {
        return (
            <div className="bg-surface p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-on-surface text-xl">Performance</h3>
                <p className="text-center text-on-surface-secondary py-16">Take an exam to see your performance.</p>
            </div>
        );
    }

    // Filter results based on the selected month from the dropdown
    const filteredResults = selectedMonth === 'all'
        ? results
        : results.filter(r => format(new Date(r.createdAt), 'MMMM yyyy') === selectedMonth);

    const totalScore = filteredResults.reduce((acc, r) => acc + (r.score / r.totalMarks) * 100, 0);
    const averageScore = filteredResults.length > 0 ? totalScore / filteredResults.length : 0;

    // Determine color and feedback text based on the average score
    let performanceColor = '#FF6B00'; // Default Orange
    let performanceText = 'Average';

    if (averageScore < 30) {
        performanceColor = '#ef4444'; // Red (danger)
        performanceText = 'Very Bad';
    } else if (averageScore < 60) {
        performanceColor = '#f59e0b'; // Amber
        performanceText = 'Average';
    } else if (averageScore < 80) {
        performanceColor = '#eab308'; // Yellow
        performanceText = 'Good';
    } else {
        performanceColor = '#00C49F'; // Green (secondary)
        performanceText = 'Very Good';
    }

    const chartData = [{
        name: 'Average',
        value: averageScore,
        fill: performanceColor // Pass the dynamic color to the chart
    }];

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-on-surface text-xl">Performance</h3>
                 <select 
                    value={selectedMonth} 
                    onChange={e => setSelectedMonth(e.target.value)} 
                    className="text-sm border-border-color rounded-md bg-background focus:ring-2 focus:ring-primary"
                 >
                    <option value="all">All Time</option>
                    {availableMonths.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                 </select>
            </div>
            
            {/* Pass the new performanceText prop to the ChartComponent */}
            <ChartComponent 
                type="radial" 
                data={chartData} 
                dataKey="value" 
                performanceText={performanceText} 
            />
        </div>
    );
};

export default PerformanceGauge;