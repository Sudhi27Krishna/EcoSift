import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
    return (
        <div className="flex flex-col">
            <Navbar />
            <Outlet />
        </div>
    );
}
export default Layout;