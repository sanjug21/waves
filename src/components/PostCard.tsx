// import React, { useState, useRef, useEffect } from 'react';
// import { Heart, MessageCircle } from 'lucide-react';
// const PostCard = ({ post }: { post: Post }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isOverflowing, setIsOverflowing] = useState(false);
//   const descriptionRef = useRef<HTMLParagraphElement>(null);

//   useEffect(() => {
//     if (descriptionRef.current) {
//       const hasOverflow = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
//       setIsOverflowing(hasOverflow);
//     }
//   }, [post.description]);

//   const toggleExpanded = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 w-full mx-auto font-sans ">
//       <div className="flex items-center mb-4">
//         <img
//           src={post.dp}
//           alt={`${post.name}'s profile picture`}
//           className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-gray-300 dark:border-gray-600"
//           onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/e2e8f0?text='; }}
//         />
//         <div className="flex-grow">
//           <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{post.name}</h3>
//         </div>
//         <time className="text-xs text-gray-400 dark:text-gray-500 self-start">{formatDate(post.createdAt)}</time>
//       </div>

//       <div className="mb-4">
//         <p
//           ref={descriptionRef}
//           className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words ${
//             isExpanded ? 'max-h-none' : 'max-h-24 overflow-hidden'
//           }`}
//         >
//           {post.description}
//         </p>
//         {isOverflowing && !isExpanded && (
//           <button
//             onClick={toggleExpanded}
//             className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mt-1 text-sm"
//           >
//             Show more
//           </button>
//         )}
//       </div>
      
//       {post.postUrl && (
//         <div className="mb-4 rounded-lg overflow-hidden border dark:border-gray-700">
//            <img 
//              src={post.postUrl} 
//              alt="Post content" 
//              className=" w-full max-h-[700px] object-cover"
//              onError={(e) => { e.currentTarget.style.display = 'none'; }}
//             />
//         </div>
//       )}

//       <div className="flex items-center text-gray-500 dark:text-gray-400 space-x-6 border-t border-gray-200 dark:border-gray-700 pt-3">
//         <button className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200">
//           <Heart size={20} />
//           <span className="font-medium text-sm">{post.likes.length} Likes</span>
//         </button>
//         <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-200">
//           <MessageCircle size={20} />
//           <span className="font-medium text-sm">{post.comments.length} Comments</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostCard;
