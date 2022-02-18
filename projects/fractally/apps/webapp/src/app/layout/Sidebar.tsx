import { BsPlus, BsLightningFill } from "react-icons/bs";

import { FaFire, FaPoo, FaCompass } from "react-icons/fa";
import { BiHomeHeart } from "react-icons/bi";
import { IoWalletSharp } from "react-icons/io5";

const SideBarIcon = ({ icon }) => <div className="sidebar-icon">{icon}</div>;

const Divider = () => <hr className="sidebar-hr" />;

export const Sidebar = () => {
    return (
        <div className="top-0 left-0 h-screen w-16 flex flex-col justify-between bg-gray-900  shadow-lg text-white">
            <div className="flex flex-col">
                <SideBarIcon icon={<BiHomeHeart size="30" />}></SideBarIcon>
                <Divider />
                <SideBarIcon icon={<FaPoo size="20" />}></SideBarIcon>
                <SideBarIcon icon={<BsLightningFill size="20" />}></SideBarIcon>
                <SideBarIcon icon={<FaFire size="20" />}></SideBarIcon>
                <Divider />

                <SideBarIcon icon={<FaCompass size="24" />}></SideBarIcon>
                <SideBarIcon icon={<BsPlus size="20" />}></SideBarIcon>
            </div>
            <div className="mb-20 <-avoiding-dev-tools">
                <SideBarIcon icon={<IoWalletSharp size="24" />}></SideBarIcon>
            </div>
        </div>
    );
};
