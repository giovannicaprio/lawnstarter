import React, { useState, useEffect } from 'react';
import '../App.css';
import { Bar } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || '';
const BACKEND_STATS = `${API_URL}/api/star-wars/statistics/`;

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(BACKEND_STATS)
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); });
  }, []);
  if (loading) return <div className="results-card" style={{ margin: '48px auto' }}>Loading...</div>;
  if (!stats) return <div className="results-card" style={{ margin: '48px auto' }}>No statistics available.</div>;
  // Bar chart for top queries
  const topQueries = stats.top_queries || [];
  const barData: ChartData<'bar'> = {
    labels: topQueries.map((q: any) => q.query),
    datasets: [{
      label: 'Top Queries (%)',
      data: topQueries.map((q: any) => q.percent),
      backgroundColor: '#1ec87a',
    }]
  };
  // Bar chart for search volume by hour
  let hourData: ChartData<'bar'> = { labels: [], datasets: [] };
  if (stats.most_popular_hour) {
    const hours = Array.isArray(stats.most_popular_hour) ? stats.most_popular_hour : [stats.most_popular_hour];
    hourData = {
      labels: hours.map((h: any) => h.hour),
      datasets: [{
        label: 'Searches by Hour',
        data: hours.map((h: any) => h.count),
        backgroundColor: '#1a73e8',
      }]
    };
  }
  const hourLabels = Array.isArray(hourData.labels) ? hourData.labels : [];
  return (
    <main className="main-content">
      <section className="results-card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="results-title">Search Statistics</div>
        <div style={{ marginBottom: 32 }}>
          <strong>Average Response Time:</strong> {stats.average_response_time} s
        </div>
        <div style={{ marginBottom: 32 }}>
          <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
        </div>
        {hourLabels.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <Bar data={hourData} options={{ plugins: { legend: { display: false } } }} />
          </div>
        )}
      </section>
    </main>
  );
};

export default StatsPage; 