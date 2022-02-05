import React from "react";
import { Sidebar } from "./Sidebar";
import { ChannelBar } from "./ChannelBar";
import { RightBar } from "./RightBar";
import { MainContent } from "./MainContent";
import { Header } from "./Header";

export default () => (
    <div className="flex justify-between">
        <Sidebar />
        <div className="w-full ">
            <Header />
            <div className="flex">
                <ChannelBar />
                <MainContent />
                <RightBar />
            </div>
        </div>
    </div>
);

// export default () => (
//     <div>
//         <h1 className="text-3xl font-bold underline">Hello world!</h1>
//         <div>
//             <Link href="/video">
//                 <Button>Video</Button>
//             </Link>
//             {" | "}
//             <Link href="/get-token">
//                 <Button>Get Token</Button>
//             </Link>
//             {" | "}
//             <Link href="/recipes">
//                 <Button>Recipes</Button>
//             </Link>
//         </div>
//         Welcome!
//     </div>
// );
