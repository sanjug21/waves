import React from "react";

// export default function Loader() {
//     return (
//         <div className="flex items-center justify-center min-h-screen ">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
//         </div>
//     );
// }

export default function Loader() {
    return(
        <div className="flex items-center justify-center min-h-screen bg-blue-200">
            <div className="loader "></div>
        </div>    
    );
    
}