import React, { useEffect, useRef } from 'react'

export default function Messages() {

    const drawerRef = useRef(null);

    const toggleDrawer = (type) => {
        if (type === "off" && drawerRef.current) {
            drawerRef.current.checked = false;
        } else if (type === "on" && drawerRef.current) {
            drawerRef.current.checked = true;

        }
    };

    useEffect(() => {
        setTimeout(() => {
            toggleDrawer("on")
        }, 1000);
    }, [])


    return (
        <div className=''>
            <div className="drawer">
                <input ref={drawerRef} id="message-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    {/* <label htmlFor="message-drawer" className="drawer-button btn btn-primary">Open drawer</label> */}
                </div>
                <div className="drawer-side  z-10 fixed">
                    <label htmlFor="message-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200  text-base-content min-h-full w-96 p-4">
                        {/* Sidebar content here */}
                        <li><a>Sidebar Item 1</a></li>
                        <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
