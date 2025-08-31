import React from "react";



export default function Loader() {
    return(
        <div className="flex items-center justify-center min-h-screen bg-blue-200">
            <div className="loader "></div>
        </div>    
    );
    
}

// export  function Loader2() {
//     return (
//         <div className="flex items-center justify-center min-h-[800px])] ">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white loader2"></div>
//         </div>
//     );
// }

export function Spinner() {
    return (
        <div className="flex justify-center pt-3">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white spinner"></div>
        </div>
    );
}