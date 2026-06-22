// "use client";
// import { Switch } from "antd";
// import { Bell } from "lucide-react";
// import { useState } from "react";

// function Notifications() {
//   const [cancellation, setCancellation] = useState<boolean>(false);
//   const [notification, setNotification] = useState<boolean>(false);
//   return (
//     <div className="w-full m-3 p-5 bg-white border border-white rounded-2xl space-y-4">
//       <div className="absolute top-4 right-8">
//         <div className="relative">
//           <Bell />
//           <h1 className="absolute -top-2 -right-2 text-red-500 font-semibold">
//             2
//           </h1>
//         </div>
//       </div>
//       <div className="flex items-center justify-between">
//         <h1>Cancellation</h1>
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-400 font-normal">
//             {cancellation ? "OFF" : "ON"}
//           </span>
//           <Switch
//             checked={cancellation}
//             onChange={() => setCancellation(!cancellation)}
//             className="bg-teal-500"
//           />
//         </div>
//       </div>
//       {/* border line */}
//       <div className="border-t border-gray-200" />
//       <div className="flex items-center justify-between">
//         <h1>Notification</h1>
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-400 font-normal">
//             {notification ? "OFF" : "ON"}
//           </span>
//           <Switch
//             checked={notification}
//             onChange={() => setNotification(!notification)}
//             className="bg-teal-500"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Notifications;
