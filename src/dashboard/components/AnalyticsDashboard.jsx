import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', views: 40 },
  { name: 'Tue', views: 30 },
  { name: 'Wed', views: 20 },
  { name: 'Thu', views: 27 },
  { name: 'Fri', views: 18 },
  { name: 'Sat', views: 23 },
  { name: 'Sun', views: 34 },
];

export function AnalyticsDashboard() {
  return (
    <div className="w-full h-[250px] bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">Weekly Overview</h3>
                <p className="font-body-sm text-[13px] text-on-surface-variant">Profile views across all documents</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="font-headline-lg text-2xl font-black text-stitch-primary">192</span>
                <span className="text-green-500 font-label-sm text-[12px] bg-green-500/10 px-2 py-0.5 rounded-full">+14%</span>
            </div>
        </div>
        <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9F5BFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#9F5BFF" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#333' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#9F5BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
