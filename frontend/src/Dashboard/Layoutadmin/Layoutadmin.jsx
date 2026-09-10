import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Preloader from '../../Preloader/Preloader'
import DashBoardHeader from '../Admin/Header/DashBoardHeader';
import Sidebar from '../Admin/SideBar/SideBar';


const Layoutadmin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    }, []);

    return (
        <>
            {
                isLoading ? <Preloader /> : (
                    <>
                        <div className="admin-layout">
                            {/* Header on top */}
                            <DashBoardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                            {/* Body: Sidebar on left and Main Content on right */}
                            <div className="admin-body">
                                <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
                                {sidebarOpen && (
                                    <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                                )}
                                <div className="main-content">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default Layoutadmin