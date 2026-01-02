import { useQuery } from '@tanstack/react-query'
import { orderApi, statsApi } from "../lib/api"
import { DollarSign, PackageIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getAll,

  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: statsApi.getDashboard,
  });

  const recentOrders = ordersData?.orders.slice(0, 5) || [];

  const statsCards = [
    {
      title: "Total Revenue",
      value: statsLoading ? "..." : `$${statsData?.totalRevenue.toFixed(2) || 0}`,
      icon: <DollarSign className='size-8' />
    },
    {
      title: "Total Orders",
      value: statsLoading ? "..." : statsData?.totalOrders || 0,
      icon: <ShoppingBagIcon className='size-8' />
    },
    {
      title: "Total Customers",
      value: statsLoading ? "..." : statsData?.totalCustomers || 0,
      icon: <UserIcon className='size-8' />
    },
    {
      title: "Total Products",
      value: statsLoading ? "..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className='size-8' />
    }

  ]
  return (
    <div className='space-y-6'>

      {/* Stats Cards */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        {statsCards.map((stat) => (
          <div key={stat.title} className="stat">
            <div className="stat-figure text-primary">{stat.icon}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
      {/* Recent Orders */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>

            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">No recent orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage