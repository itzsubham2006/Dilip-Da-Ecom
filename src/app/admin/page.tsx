'use client';

import { TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock, MoreVertical, DollarSign } from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '₹1,24,500', trend: '+14%', isUp: true, icon: DollarSign },
  { label: 'Active Orders', value: '42', trend: '+5%', isUp: true, icon: ShoppingBag },
  { label: 'Total Customers', value: '1,284', trend: '+12%', isUp: true, icon: Users },
  { label: 'Conversion Rate', value: '3.2%', trend: '-1.1%', isUp: false, icon: TrendingUp },
];

const recentOrders = [
  { id: 'ORD-1092', customer: 'Rahul Sharma', amount: '₹850', status: 'Preparing', time: '10 mins ago' },
  { id: 'ORD-1091', customer: 'Priya Patel', amount: '₹1,200', status: 'Delivered', time: '45 mins ago' },
  { id: 'ORD-1090', customer: 'Amit Kumar', amount: '₹450', status: 'Delivered', time: '1 hour ago' },
  { id: 'ORD-1089', customer: 'Sneha Gupta', amount: '₹2,100', status: 'Cancelled', time: '2 hours ago' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-ztext">Welcome back, Admin 👋</h2>
          <p className="text-ztext-light text-sm mt-1">Here is what is happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="button-z button-z-ghost border border-zborder">Download Report</button>
          <button className="button-z button-z-primary">Create Order</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zcard/40 backdrop-blur-md rounded-2xl border border-zborder p-5 shadow-z hover:bg-zcard/60 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-zgray flex items-center justify-center border border-zborder group-hover:scale-110 transition-transform">
                <stat.icon size={18} className="text-ztext-light" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                stat.isUp ? 'text-green-500 bg-green-500/10' : 'text-zred bg-zred/10'
              }`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-ztext-light text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-ztext mt-1 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-zcard/40 backdrop-blur-md rounded-2xl border border-zborder shadow-z overflow-hidden">
          <div className="p-6 border-b border-zborder flex items-center justify-between">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <button className="text-sm font-medium text-zred hover:text-white transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zborder/50 text-ztext-muted text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Time</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zborder/50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-medium text-sm">{order.id}</td>
                    <td className="p-4 text-sm text-ztext-light">{order.customer}</td>
                    <td className="p-4 text-sm font-bold">{order.amount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'Cancelled' ? 'bg-zred/10 text-zred' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-ztext-muted flex items-center gap-1.5">
                      <Clock size={12} /> {order.time}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-ztext-muted hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Popular Items */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-zred to-orange-600 rounded-2xl p-6 shadow-lg shadow-zred/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
            <h3 className="font-bold text-lg text-white mb-2 relative z-10">Launch New Menu</h3>
            <p className="text-white/80 text-sm mb-4 relative z-10">Add exciting new items to your catalog and boost your sales.</p>
            <button className="bg-white text-zred px-4 py-2 rounded-xl text-sm font-bold hover:bg-zgray transition-colors relative z-10 shadow-sm">
              Add New Item
            </button>
          </div>

          <div className="bg-zcard/40 backdrop-blur-md rounded-2xl border border-zborder shadow-z p-6">
            <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-ztext-light">Server Load</span>
                  <span className="font-bold text-green-500">24%</span>
                </div>
                <div className="h-1.5 w-full bg-zgray rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[24%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-ztext-light">Storage Capacity</span>
                  <span className="font-bold text-blue-500">72%</span>
                </div>
                <div className="h-1.5 w-full bg-zgray rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[72%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
