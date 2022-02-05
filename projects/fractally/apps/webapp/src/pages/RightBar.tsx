import { FaPoo } from "react-icons/fa";
import { AiFillLike, AiFillFire } from "react-icons/ai";

const SideBarIcon = ({ icon, label }) => (
    <button className="flex hover:bg-gray-600 ml-4 p-4 space-x-4 text-center m-auto">
        <div className="text-green-500 flex flex-col justify-center ">
            {icon}
        </div>
        <div className="text-white flex flex-col justify-center text-lg">
            {label}
        </div>
    </button>
);

export const RightBar = () => (
    <div className="w-80 h-screen m-0  bg-red-500 dark:bg-gray-800 overflow-hidden text-gray-100">
        <div>
            <SideBarIcon
                label={"Trending"}
                icon={<AiFillFire size="20" />}
            ></SideBarIcon>
            <SideBarIcon
                label={"Votable"}
                icon={<AiFillLike size="20" />}
            ></SideBarIcon>
            <SideBarIcon
                label={"My Posts"}
                icon={<FaPoo size="20" />}
            ></SideBarIcon>
        </div>
    </div>
);
