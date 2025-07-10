export default function AdminDashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard. Here you can manage users, products, and orders.</p>
            <ul>
                <li><a href="/admin/users">Manage Users</a></li>
                <li><a href="/admin/products">Manage Products</a></li>
                <li><a href="/admin/orders">Manage Orders</a></li>
            </ul>
        </div>
    );
}