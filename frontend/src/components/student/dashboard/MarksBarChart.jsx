import ChartComponent from '../../common/ChartComponent';

const MarksBarChart = ({ results }) => {
    // Take the last 5 submitted results for the chart
    const chartData = results
        .filter(r => r.submitted)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort oldest to newest
        .slice(-5) // Take the last 5
        .map(r => ({
            // THIS IS THE FIX: Use the exam title for the name
            name: r.exam.title.substring(0, 15) + (r.exam.title.length > 15 ? '...' : ''),
            Score: parseFloat(((r.score / r.totalMarks) * 100).toFixed(2))
        }));

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-on-surface text-xl mb-4">Recent Marks Analysis</h3>
            <ChartComponent type="bar" data={chartData} dataKey="Score" nameKey="name" />
        </div>
    );
};

export default MarksBarChart;