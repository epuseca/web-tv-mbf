import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend
);

const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
    },
    scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, beginAtZero: true },
    },
};

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } },
    },
};

const DashboardPage = () => {
    // ─── Fake data for statistics ─────────────
    const stats = [
        { label: 'Tổng Slide', value: '128', change: '+12%', positive: true, icon: '🖼️', color: 'purple' },
        { label: 'Lượt xem hôm nay', value: '3,456', change: '+8.5%', positive: true, icon: '👁️', color: 'cyan' },
        { label: 'TV Đang hoạt động', value: '24', change: '+2', positive: true, icon: '📺', color: 'green' },
        { label: 'Uptime', value: '99.9%', change: '-0.1%', positive: false, icon: '⚡', color: 'amber' },
    ];

    // ─── Line chart: Lượt xem theo tháng ─────
    const lineData = {
        labels: months,
        datasets: [
            {
                label: 'Lượt xem',
                data: [1200, 1900, 3000, 5000, 4200, 3800, 5100, 7200, 6300, 8900, 9500, 11000],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#6366f1',
            },
            {
                label: 'Unique viewers',
                data: [800, 1200, 2100, 3200, 2800, 2500, 3400, 4800, 4100, 5900, 6200, 7200],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#06b6d4',
            },
        ],
    };

    // ─── Bar chart: Slides được thêm theo tháng
    const barData = {
        labels: months,
        datasets: [
            {
                label: 'Slides mới',
                data: [5, 8, 12, 7, 15, 10, 18, 22, 14, 20, 25, 30],
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: '#6366f1',
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: 'Slides xóa',
                data: [2, 3, 1, 4, 2, 5, 3, 6, 2, 4, 3, 5],
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: '#ef4444',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    // ─── Pie chart: Phân loại nội dung ────────
    const pieData = {
        labels: ['Thông báo', 'Sự kiện', 'Quảng cáo', 'Nội bộ', 'Khác'],
        datasets: [
            {
                data: [35, 25, 20, 12, 8],
                backgroundColor: [
                    '#6366f1',
                    '#06b6d4',
                    '#f59e0b',
                    '#10b981',
                    '#94a3b8',
                ],
                borderWidth: 0,
                hoverOffset: 8,
            },
        ],
    };

    return (
        <div>
            {/* Statistic Cards */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div className={`stat-card ${stat.color}`} key={index}>
                        <div className="stat-card-header">
                            <span className="stat-card-label">{stat.label}</span>
                            <div className="stat-card-icon">{stat.icon}</div>
                        </div>
                        <div className="stat-card-value">{stat.value}</div>
                        <div className={`stat-card-change ${stat.positive ? 'positive' : 'negative'}`}>
                            {stat.positive ? '↑' : '↓'} {stat.change} so với tháng trước
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card full-width">
                    <h3>📈 Lượt xem theo tháng</h3>
                    <div style={{ height: 300 }}>
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>📊 Slides theo tháng</h3>
                    <div style={{ height: 300 }}>
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>🍩 Phân loại nội dung</h3>
                    <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
