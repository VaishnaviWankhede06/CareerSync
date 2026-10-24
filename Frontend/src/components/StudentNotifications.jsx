
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Bell, CheckCheck,  BriefcaseBusiness, } from "lucide-react";
// import { toast } from "sonner";
// import { socket } from "@/lib/socket";
// import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
// import Navbar from "./shared/Navbar";



// const StudentNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let active = true;

//     const loadNotifications = async () => {
//       try {
//         const res = await axios.get(NOTIFICATION_API_END_POINT, {
//           withCredentials: true,
//         });

//         if (active && res.data.success) {
//           setNotifications(res.data.notifications || []);
//           setUnreadCount(res.data.unreadCount || 0);
//         }
//       } catch (error) {
//         console.error("Failed to load notifications:", error);
//       } finally {
//         if (active) setLoading(false);
//       }
//     };

//     const handleNewNotification = (notification) => {
//       if (!active) return;

//       setNotifications((previous) => {
//         const alreadyExists = previous.some(
//           (item) => item._id === notification._id
//         );

//         if (alreadyExists) return previous;

//         if (!notification.isRead) {
//           setUnreadCount((count) => count + 1);
//         }

//         return [notification, ...previous];
//       });

//       toast.info(notification.title || "New notification");
//     };

//     socket.on("notification:new", handleNewNotification);
//     socket.connect();
//     loadNotifications();

//     return () => {
//       active = false;
//       socket.off("notification:new", handleNewNotification);
//       socket.disconnect();
//     };
//   }, []);

//   const markAsRead = async (id) => {
//     try {
//       const res = await axios.patch(
//         `${NOTIFICATION_API_END_POINT}/${id}/read`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         setNotifications((previous) =>
//           previous.map((item) =>
//             item._id === id ? { ...item, isRead: true } : item
//           )
//         );

//         setUnreadCount((count) => {
//           const selected = notifications.find((item) => item._id === id);
//           return selected && !selected.isRead
//             ? Math.max(0, count - 1)
//             : count;
//         });
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Could not mark notification as read"
//       );
//     }
//   };

//   return (
//     <>
//     <Navbar/>
//     <section className="max-w-4xl mx-auto my-6 rounded-2xl border bg-white p-6">
      
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="flex items-center gap-2 text-xl font-bold">
//           <Bell className="h-5 w-5 text-purple-700" />
//           Notifications
//         </h2>

//         <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
//           {unreadCount} unread
//         </span>
//       </div>

//       {loading ? (
//         <p className="text-sm text-gray-500">Loading notifications...</p>
//       ) : notifications.length === 0 ? (
//         <p className="py-4 text-sm text-gray-500">
//           No notifications yet. Application updates will appear here.
//         </p>
//       ) : (
//         <div className="space-y-3">
//           {notifications.map((notification) => (
//             <article
//               key={notification._id}
//               className={`rounded-lg border p-4 ${
//                 notification.isRead
//                   ? "border-gray-200 bg-white"
//                   : "border-purple-200 bg-purple-50"
//               }`}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <h3 className="font-semibold">{notification.title}</h3>
//                   <p className="mt-1 text-sm text-gray-700">
//                     {notification.message}
//                   </p>
//                   <p className="mt-2 text-xs text-gray-500">
//                     {notification.createdAt
//                       ? new Date(notification.createdAt).toLocaleString()
//                       : ""}
//                   </p>

                  
// {/* Job details */}
// {notification.application?.job && (
//   <div className="mt-3 rounded-lg border border-purple-100 bg-white p-3">
//     <div className="flex items-center gap-2">
//       <BriefcaseBusiness className="h-4 w-4 text-purple-700" />

//       <span className="font-medium text-gray-900">
//         {notification.application.job.title}
//       </span>
//     </div>

//     {notification.application.job.company && (
//       <p className="mt-1 text-sm text-gray-600">
//         Company:{" "}
//         {notification.application.job.company.name}
//       </p>
//     )}

//     <p className="mt-1 text-xs capitalize text-gray-500">
//       Status: {notification.type}
//     </p>
//   </div>
// )}

//                 </div>

//                 {!notification.isRead && (
//                   <button
//                     type="button"
//                     onClick={() => markAsRead(notification._id)}
//                     className="flex shrink-0 items-center gap-1 text-sm text-purple-700 hover:underline"
//                   >
//                     <CheckCheck className="h-4 w-4" />
//                     Mark read
//                   </button>
//                 )}
//               </div>
//             </article>
//           ))}
//         </div>
//       )}
//     </section>
//     </>
//   );
// };

// export default StudentNotifications;



// import { useCallback, useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Bell,
//   CheckCheck,
//   BriefcaseBusiness,
//   Clock3,
//   Inbox,
//   LoaderCircle,
//   RefreshCw,
//   Building2,
//   CircleCheck,
//   CircleDot,
//   BellRing,
// } from "lucide-react";
// import { toast } from "sonner";
// import { socket } from "@/lib/socket";
// import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
// import Navbar from "./shared/Navbar";

// const StudentNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [markingAll, setMarkingAll] = useState(false);
//   const [markingIds, setMarkingIds] = useState([]);

//   const loadNotifications = useCallback(async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(NOTIFICATION_API_END_POINT, {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         setNotifications(res.data.notifications || []);
//         setUnreadCount(res.data.unreadCount || 0);
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to load notifications. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     let active = true;

//     const handleNewNotification = (notification) => {
//       if (!active || !notification?._id) return;

//       setNotifications((previous) => {
//         const exists = previous.some(
//           (item) => item._id === notification._id
//         );

//         if (exists) return previous;

//         if (!notification.isRead) {
//           setUnreadCount((count) => count + 1);
//         }

//         return [notification, ...previous];
//       });

//       toast.info(notification.title || "New notification", {
//         description: notification.message,
//       });
//     };

//     socket.on("notification:new", handleNewNotification);
//     socket.connect();

//     const fetchInitialNotifications = async () => {
//       try {
//         const res = await axios.get(NOTIFICATION_API_END_POINT, {
//           withCredentials: true,
//         });

//         if (active && res.data.success) {
//           const fetched = res.data.notifications || [];

//           setNotifications((previous) => {
//             // Keep notifications received through the socket
//             // while the initial API request was in progress.
//             const fetchedIds = new Set(
//               fetched.map((item) => item._id)
//             );

//             const socketNotifications = previous.filter(
//               (item) => !fetchedIds.has(item._id)
//             );

//             return [...socketNotifications, ...fetched];
//           });

//           setUnreadCount(res.data.unreadCount || 0);
//         }
//       } catch (error) {
//         if (active) {
//           toast.error("Could not load notifications.");
//         }
//       } finally {
//         if (active) setLoading(false);
//       }
//     };

//     fetchInitialNotifications();

//     return () => {
//       active = false;
//       socket.off("notification:new", handleNewNotification);
//       socket.disconnect();
//     };
//   }, []);

//   const markAsRead = async (id) => {
//     const selected = notifications.find(
//       (item) => item._id === id
//     );

//     if (!selected || selected.isRead || markingIds.includes(id)) {
//       return;
//     }

//     setMarkingIds((previous) => [...previous, id]);

//     try {
//       const res = await axios.patch(
//         `${NOTIFICATION_API_END_POINT}/${id}/read`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         setNotifications((previous) =>
//           previous.map((item) =>
//             item._id === id
//               ? { ...item, isRead: true }
//               : item
//           )
//         );

//         setUnreadCount((count) => Math.max(0, count - 1));
//       }
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Could not mark notification as read."
//       );
//     } finally {
//       setMarkingIds((previous) =>
//         previous.filter((itemId) => itemId !== id)
//       );
//     }
//   };

//   const markAllAsRead = async () => {
//     const unreadNotifications = notifications.filter(
//       (item) => !item.isRead
//     );

//     if (!unreadNotifications.length || markingAll) return;

//     setMarkingAll(true);

//     try {
//       // Uses the existing single-notification API endpoint.
//       // This works without requiring a new backend route.
//       const results = await Promise.allSettled(
//         unreadNotifications.map((item) =>
//           axios.patch(
//             `${NOTIFICATION_API_END_POINT}/${item._id}/read`,
//             {},
//             { withCredentials: true }
//           )
//         )
//       );

//       const successfulIds = new Set(
//         results.flatMap((result, index) =>
//           result.status === "fulfilled" &&
//           result.value.data.success
//             ? [unreadNotifications[index]._id]
//             : []
//         )
//       );

//       if (successfulIds.size > 0) {
//         setNotifications((previous) =>
//           previous.map((item) =>
//             successfulIds.has(item._id)
//               ? { ...item, isRead: true }
//               : item
//           )
//         );

//         setUnreadCount((count) =>
//           Math.max(0, count - successfulIds.size)
//         );
//       }

//       if (successfulIds.size === unreadNotifications.length) {
//         toast.success("All notifications marked as read.");
//       } else {
//         toast.error(
//           `${successfulIds.size} of ${unreadNotifications.length} notifications marked as read.`
//         );
//       }
//     } catch {
//       toast.error("Could not update notifications.");
//     } finally {
//       setMarkingAll(false);
//     }
//   };

//   const filteredNotifications = notifications.filter((item) =>
//     filter === "unread" ? !item.isRead : true
//   );

//   const formatDate = (date) => {
//     if (!date) return "";

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) return "";

//     return new Intl.DateTimeFormat("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//     }).format(parsedDate);
//   };

//   const getStatusStyle = (type = "") => {
//     const status = type.toLowerCase();

//     if (
//       status.includes("accept") ||
//       status.includes("select") ||
//       status.includes("shortlist")
//     ) {
//       return "bg-emerald-50 text-emerald-700 ring-emerald-200";
//     }

//     if (
//       status.includes("reject") ||
//       status.includes("decline")
//     ) {
//       return "bg-red-50 text-red-700 ring-red-200";
//     }

//     if (
//       status.includes("interview") ||
//       status.includes("review")
//     ) {
//       return "bg-amber-50 text-amber-700 ring-amber-200";
//     }

//     return "bg-violet-50 text-violet-700 ring-violet-200";
//   };

//   return (
//     <>
//       <Navbar />

//       <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-5xl">

//           {/* Page heading */}
//           <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-start gap-4">
//               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm">
//                 <BellRing className="h-7 w-7" />
//               </div>

//               <div>
//                 <p className="mb-1 text-sm font-medium text-violet-700">
//                   YOUR ACTIVITY
//                 </p>

//                 <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//                   Notifications
//                 </h1>

//                 <p className="mt-1 text-sm text-slate-500 sm:text-base">
//                   Stay updated on your applications and career journey.
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={loadNotifications}
//               disabled={loading}
//               className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <RefreshCw
//                 className={`h-4 w-4 ${
//                   loading ? "animate-spin" : ""
//                 }`}
//               />
//               Refresh
//             </button>
//           </div>

//           {/* Summary cards */}
//           <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-500">
//                     Total notifications
//                   </p>

//                   <p className="mt-2 text-3xl font-bold text-slate-900">
//                     {notifications.length}
//                   </p>
//                 </div>

//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                   <Inbox className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-500">
//                     Unread notifications
//                   </p>

//                   <p className="mt-2 text-3xl font-bold text-violet-700">
//                     {unreadCount}
//                   </p>
//                 </div>

//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
//                   <Bell className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Notifications container */}
//           <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//             {/* Toolbar */}
//             <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900">
//                   Your updates
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-500">
//                   {unreadCount > 0
//                     ? `You have ${unreadCount} unread ${
//                         unreadCount === 1
//                           ? "notification"
//                           : "notifications"
//                       }.`
//                     : "You're all caught up!"}
//                 </p>
//               </div>

//               {unreadCount > 0 && (
//                 <button
//                   type="button"
//                   onClick={markAllAsRead}
//                   disabled={markingAll}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {markingAll ? (
//                     <LoaderCircle className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <CheckCheck className="h-4 w-4" />
//                   )}

//                   {markingAll ? "Updating..." : "Mark all as read"}
//                 </button>
//               )}
//             </div>

//             {/* Filters */}
//             <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 sm:px-6">
//               <button
//                 type="button"
//                 onClick={() => setFilter("all")}
//                 className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
//                   filter === "all"
//                     ? "bg-violet-600 text-white shadow-sm"
//                     : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//                 }`}
//               >
//                 All
//                 <span className="ml-2">
//                   {notifications.length}
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setFilter("unread")}
//                 className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
//                   filter === "unread"
//                     ? "bg-violet-600 text-white shadow-sm"
//                     : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//                 }`}
//               >
//                 Unread
//                 {unreadCount > 0 && (
//                   <span className="ml-2">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Notification list */}
//             <div className="divide-y divide-slate-100">

//               {loading ? (
//                 <div className="space-y-4 p-5 sm:p-6">
//                   {[1, 2, 3].map((item) => (
//                     <div
//                       key={item}
//                       className="flex animate-pulse gap-4 rounded-xl border border-slate-100 p-4"
//                     >
//                       <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />

//                       <div className="flex-1 space-y-3 py-1">
//                         <div className="h-4 w-1/3 rounded bg-slate-200" />
//                         <div className="h-3 w-full rounded bg-slate-100" />
//                         <div className="h-3 w-1/2 rounded bg-slate-100" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : filteredNotifications.length === 0 ? (
//                 <div className="px-6 py-16 text-center">
//                   <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
//                     {filter === "unread" ? (
//                       <CircleCheck className="h-8 w-8" />
//                     ) : (
//                       <Inbox className="h-8 w-8" />
//                     )}
//                   </div>

//                   <h3 className="mt-5 text-lg font-bold text-slate-900">
//                     {filter === "unread"
//                       ? "You're all caught up!"
//                       : "No notifications yet"}
//                   </h3>

//                   <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
//                     {filter === "unread"
//                       ? "There are no unread notifications. Check back when you have new application updates."
//                       : "When you receive application updates and other important alerts, they'll appear here."}
//                   </p>

//                   {filter === "unread" && (
//                     <button
//                       type="button"
//                       onClick={() => setFilter("all")}
//                       className="mt-5 text-sm font-semibold text-violet-700 hover:text-violet-800"
//                     >
//                       View all notifications
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 filteredNotifications.map((notification) => {
//                   const job = notification.application?.job;
//                   const isMarking = markingIds.includes(
//                     notification._id
//                   );

//                   return (
//                     <article
//                       key={notification._id}
//                       className={`group relative p-5 transition-colors sm:px-6 ${
//                         !notification.isRead
//                           ? "bg-violet-50/50 hover:bg-violet-50"
//                           : "bg-white hover:bg-slate-50"
//                       }`}
//                     >
//                       {!notification.isRead && (
//                         <span className="absolute bottom-5 left-0 top-5 w-1 rounded-r-full bg-violet-600" />
//                       )}

//                       <div className="flex items-start gap-3 sm:gap-4">
//                         {/* Icon */}
//                         <div
//                           className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
//                             !notification.isRead
//                               ? "bg-violet-100 text-violet-700"
//                               : "bg-slate-100 text-slate-500"
//                           }`}
//                         >
//                           {job ? (
//                             <BriefcaseBusiness className="h-5 w-5" />
//                           ) : (
//                             <Bell className="h-5 w-5" />
//                           )}
//                         </div>

//                         {/* Content */}
//                         <div className="min-w-0 flex-1">
//                           <div className="flex flex-wrap items-center gap-2">
//                             <h3 className="break-words font-semibold text-slate-900">
//                               {notification.title || "Notification"}
//                             </h3>

//                             {!notification.isRead && (
//                               <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700">
//                                 NEW
//                               </span>
//                             )}
//                           </div>

//                           <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
//                             {notification.message}
//                           </p>

//                           <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
//                             <Clock3 className="h-3.5 w-3.5" />
//                             <time>
//                               {formatDate(notification.createdAt)}
//                             </time>
//                           </div>

//                           {/* Job details */}
//                           {job && (
//                             <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
//                               <div className="flex items-start gap-3">
//                                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
//                                   <Building2 className="h-5 w-5" />
//                                 </div>

//                                 <div className="min-w-0 flex-1">
//                                   <p className="break-words font-semibold text-slate-900">
//                                     {job.title || "Job application"}
//                                   </p>

//                                   {job.company?.name && (
//                                     <p className="mt-1 break-words text-sm text-slate-500">
//                                       {job.company.name}
//                                     </p>
//                                   )}

//                                   {notification.type && (
//                                     <div className="mt-3">
//                                       <span
//                                         className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(
//                                           notification.type
//                                         )}`}
//                                       >
//                                         <CircleDot className="h-3 w-3" />
//                                         {notification.type.replace(
//                                           /[_-]/g,
//                                           " "
//                                         )}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Mobile-friendly read action */}
//                           {!notification.isRead && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 markAsRead(notification._id)
//                               }
//                               disabled={isMarking}
//                               className="mt-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-violet-700 transition hover:text-violet-900 disabled:opacity-60 sm:hidden"
//                             >
//                               {isMarking ? (
//                                 <LoaderCircle className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <CheckCheck className="h-4 w-4" />
//                               )}

//                               Mark as read
//                             </button>
//                           )}
//                         </div>

//                         {/* Desktop read action */}
//                         {!notification.isRead && (
//                           <button
//                             type="button"
//                             onClick={() =>
//                               markAsRead(notification._id)
//                             }
//                             disabled={isMarking}
//                             title="Mark as read"
//                             aria-label={`Mark ${notification.title || "notification"} as read`}
//                             className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 disabled:opacity-60 sm:inline-flex"
//                           >
//                             {isMarking ? (
//                               <LoaderCircle className="h-4 w-4 animate-spin" />
//                             ) : (
//                               <CheckCheck className="h-4 w-4" />
//                             )}

//                             Read
//                           </button>
//                         )}
//                       </div>
//                     </article>
//                   );
//                 })
//               )}
//             </div>

//             {/* Footer */}
//             {!loading && notifications.length > 0 && (
//               <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
//                 <p className="text-center text-xs text-slate-500">
//                   Showing {filteredNotifications.length} of{" "}
//                   {notifications.length} notifications
//                 </p>
//               </div>
//             )}
//           </section>

//           <p className="mt-5 text-center text-xs text-slate-400">
//             <CircleCheck className="mr-1 inline h-3.5 w-3.5" />
//             Your application updates are displayed here in real time.
//           </p>
//         </div>
//       </main>
//     </>
//   );
// };

// export default StudentNotifications;



// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import {
//   Bell,
//   CheckCheck,
//   BriefcaseBusiness,
//   Clock,
//   X,
// } from "lucide-react";
// import { toast } from "sonner";
// import { socket } from "@/lib/socket";
// import { NOTIFICATION_API_END_POINT } from "@/utils/constant";

// const NotificationDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   const dropdownRef = useRef(null);

//   const fetchNotifications = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(NOTIFICATION_API_END_POINT, {
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         setNotifications(res.data.notifications || []);
//         setUnreadCount(res.data.unreadCount || 0);
//       }
//     } catch (error) {
//       toast.error("Failed to load notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();

//     const handleNewNotification = (notification) => {
//       setNotifications((prev) => {
//         if (prev.some((item) => item._id === notification._id)) {
//           return prev;
//         }

//         return [notification, ...prev];
//       });

//       if (!notification.isRead) {
//         setUnreadCount((count) => count + 1);
//       }

//       toast.info(notification.title || "New notification");
//     };

//     socket.on("notification:new", handleNewNotification);
//     socket.connect();

//     return () => {
//       socket.off("notification:new", handleNewNotification);
//       socket.disconnect();
//     };
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     const handleEscape = (event) => {
//       if (event.key === "Escape") {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const markAsRead = async (notification) => {
//     if (notification.isRead) return;

//     try {
//       const res = await axios.patch(
//         `${NOTIFICATION_API_END_POINT}/${notification._id}/read`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         setNotifications((prev) =>
//           prev.map((item) =>
//             item._id === notification._id
//               ? { ...item, isRead: true }
//               : item
//           )
//         );

//         setUnreadCount((count) => Math.max(0, count - 1));
//       }
//     } catch (error) {
//       toast.error("Could not mark as read");
//     }
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Bell button */}
//       <button
//         type="button"
//         onClick={() => setIsOpen((prev) => !prev)}
//         aria-label="Toggle notifications"
//         aria-expanded={isOpen}
//         className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${
//           isOpen
//             ? "bg-violet-100 text-violet-700"
//             : "text-gray-600 hover:bg-gray-100"
//         }`}
//       >
//         <Bell className="h-6 w-6" />

//         {unreadCount > 0 && (
//           <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white">
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown panel */}
//       {isOpen && (
//         <div className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-[390px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
//           {/* Header */}
//           <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4">
//             <div>
//               <h3 className="text-base font-bold text-gray-900">
//                 Notifications
//               </h3>
//               <p className="mt-0.5 text-xs text-gray-500">
//                 {unreadCount > 0
//                   ? `${unreadCount} unread notifications`
//                   : "You're all caught up!"}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => setIsOpen(false)}
//               aria-label="Close notifications"
//               className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Notification list */}
//           <div className="max-h-[420px] overflow-y-auto">
//             {loading ? (
//               <div className="p-8 text-center text-sm text-gray-500">
//                 Loading notifications...
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="px-5 py-12 text-center">
//                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
//                   <Bell className="h-6 w-6 text-violet-500" />
//                 </div>

//                 <h4 className="mt-4 font-semibold text-gray-800">
//                   No notifications yet
//                 </h4>

//                 <p className="mt-1 text-sm text-gray-500">
//                   Your application updates will appear here.
//                 </p>
//               </div>
//             ) : (
//               notifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className={`border-b border-gray-100 p-4 transition hover:bg-gray-50 ${
//                     !notification.isRead ? "bg-violet-50/60" : "bg-white"
//                   }`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
//                         !notification.isRead
//                           ? "bg-violet-100 text-violet-700"
//                           : "bg-gray-100 text-gray-500"
//                       }`}
//                     >
//                       {notification.application?.job ? (
//                         <BriefcaseBusiness className="h-5 w-5" />
//                       ) : (
//                         <Bell className="h-5 w-5" />
//                       )}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <div className="flex items-start justify-between gap-2">
//                         <h4 className="break-words text-sm font-semibold text-gray-900">
//                           {notification.title || "Notification"}
//                         </h4>

//                         {!notification.isRead && (
//                           <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-600" />
//                         )}
//                       </div>

//                       <p className="mt-1 break-words text-xs leading-5 text-gray-600">
//                         {notification.message}
//                       </p>

//                       {notification.application?.job && (
//                         <div className="mt-2 rounded-lg border border-gray-100 bg-white p-2">
//                           <p className="text-xs font-semibold text-gray-800">
//                             {notification.application.job.title}
//                           </p>

//                           {notification.application.job.company?.name && (
//                             <p className="mt-1 text-xs text-gray-500">
//                               {notification.application.job.company.name}
//                             </p>
//                           )}
//                         </div>
//                       )}

//                       <div className="mt-3 flex items-center justify-between gap-2">
//                         <span className="flex items-center gap-1 text-[11px] text-gray-400">
//                           <Clock className="h-3 w-3" />
//                           {notification.createdAt
//                             ? new Date(
//                                 notification.createdAt
//                               ).toLocaleString()
//                             : ""}
//                         </span>

//                         {!notification.isRead && (
//                           <button
//                             type="button"
//                             onClick={() => markAsRead(notification)}
//                             className="flex shrink-0 items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
//                           >
//                             <CheckCheck className="h-3.5 w-3.5" />
//                             Mark read
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Footer */}
//           <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
//             <button
//               type="button"
//               onClick={() => {
//                 setIsOpen(false);
//                 window.location.href = "/student/notifications";
//               }}
//               className="w-full rounded-lg py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
//             >
//               View all notifications
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;




import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  ChevronDown,
  Clock3,
  Inbox,
  LoaderCircle,
  CircleDot,
  Building2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
import Navbar from "./shared/Navbar";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [markingIds, setMarkingIds] = useState([]);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const res = await axios.get(NOTIFICATION_API_END_POINT, {
          withCredentials: true,
        });

        if (active && res.data.success) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (error) {
        if (active) toast.error("Failed to load notifications");
      } finally {
        if (active) setLoading(false);
      }
    };

    const handleNewNotification = (notification) => {
      if (!active || !notification?._id) return;

      setNotifications((prev) => {
        if (prev.some((item) => item._id === notification._id)) {
          return prev;
        }

        return [notification, ...prev];
      });

      if (!notification.isRead) {
        setUnreadCount((count) => count + 1);
      }

      toast.info(notification.title || "New notification", {
        description: notification.message,
      });
    };

    socket.on("notification:new", handleNewNotification);
    socket.connect();
    loadNotifications();

    return () => {
      active = false;
      socket.off("notification:new", handleNewNotification);
      socket.disconnect();
    };
  }, []);

  const toggleNotification = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const markAsRead = async (notification) => {
    if (notification.isRead || markingIds.includes(notification._id)) {
      return;
    }

    setMarkingIds((prev) => [...prev, notification._id]);

    try {
      const res = await axios.patch(
        `${NOTIFICATION_API_END_POINT}/${notification._id}/read`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );

        setUnreadCount((count) => Math.max(0, count - 1));
        toast.success("Notification marked as read");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not mark as read"
      );
    } finally {
      setMarkingIds((prev) =>
        prev.filter((id) => id !== notification._id)
      );
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((item) => !item.isRead);

    if (!unread.length) return;

    const results = await Promise.allSettled(
      unread.map((item) =>
        axios.patch(
          `${NOTIFICATION_API_END_POINT}/${item._id}/read`,
          {},
          { withCredentials: true }
        )
      )
    );

    const successfulIds = new Set(
      results.flatMap((result, index) =>
        result.status === "fulfilled" && result.value.data.success
          ? [unread[index]._id]
          : []
      )
    );

    if (successfulIds.size) {
      setNotifications((prev) =>
        prev.map((item) =>
          successfulIds.has(item._id)
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((count) =>
        Math.max(0, count - successfulIds.size)
      );
    }

    if (successfulIds.size === unread.length) {
      toast.success("All notifications marked as read");
    } else {
      toast.error("Some notifications could not be updated");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsed);
  };

  const getStatusStyle = (type = "") => {
    const status = type.toLowerCase();

    if (/accept|select|shortlist/.test(status)) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (/reject|decline/.test(status)) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (/interview|review/.test(status)) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-violet-50 text-violet-700 border-violet-200";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">

          {/* Heading */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Bell className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Notifications
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  All your application updates in one place.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await axios.get(
                    NOTIFICATION_API_END_POINT,
                    { withCredentials: true }
                  );

                  if (res.data.success) {
                    setNotifications(res.data.notifications || []);
                    setUnreadCount(res.data.unreadCount || 0);
                  }
                } catch {
                  toast.error("Failed to refresh notifications");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <p className="text-sm text-slate-500">Total notifications</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {notifications.length}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4 sm:p-5">
              <p className="text-sm text-violet-700">Unread notifications</p>
              <p className="mt-2 text-3xl font-bold text-violet-800">
                {unreadCount}
              </p>
            </div>
          </div>

          {/* Accordion */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent activity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Click any notification to view details.
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Inbox className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">
                  No notifications yet
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Your job application updates will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const isExpanded = expandedId === notification._id;
                  const job = notification.application?.job;
                  const isMarking = markingIds.includes(notification._id);

                  return (
                    <article
                      key={notification._id}
                      className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                        isExpanded
                          ? "border-violet-300 bg-white shadow-md shadow-violet-100/60"
                          : notification.isRead
                          ? "border-slate-200 bg-white hover:border-violet-200"
                          : "border-violet-200 bg-violet-50/50 hover:border-violet-300"
                      }`}
                    >
                      {/* Accordion header */}
                      <button
                        type="button"
                        onClick={() => toggleNotification(notification._id)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center gap-3 p-4 text-left sm:gap-4 sm:p-5"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            notification.isRead
                              ? "bg-slate-100 text-slate-500"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {job ? (
                            <BriefcaseBusiness className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-sm font-semibold text-slate-900 sm:text-base">
                              {notification.title || "Notification"}
                            </h3>

                            {!notification.isRead && (
                              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                                New
                              </span>
                            )}
                          </div>

                          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                            {notification.message}
                          </p>

                          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>

                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-violet-700" : ""
                          }`}
                        />
                      </button>

                      {/* Expandable content */}
                      {isExpanded && (
                        <div className="animate-in fade-in slide-in-from-top-1 border-t border-slate-100 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                          <div className="pl-0 sm:pl-14">
                            <p className="whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                              {notification.message}
                            </p>

                            {job && (
                              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm">
                                    <Building2 className="h-5 w-5" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <h4 className="break-words font-semibold text-slate-900">
                                      {job.title || "Job application"}
                                    </h4>

                                    {job.company?.name && (
                                      <p className="mt-1 text-sm text-slate-500">
                                        {job.company.name}
                                      </p>
                                    )}

                                    {notification.type && (
                                      <span
                                        className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                          notification.type
                                        )}`}
                                      >
                                        <CircleDot className="h-3.5 w-3.5" />
                                        {notification.type.replace(/[_-]/g, " ")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <span className="text-xs text-slate-400">
                                Received: {formatDate(notification.createdAt)}
                              </span>

                              {!notification.isRead ? (
                                <button
                                  type="button"
                                  disabled={isMarking}
                                  onClick={() => markAsRead(notification)}
                                  className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                                >
                                  {isMarking ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCheck className="h-4 w-4" />
                                  )}
                                  Mark as read
                                </button>
                              ) : (
                                <span className="text-sm font-medium text-emerald-700">
                                  ✓ Read
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default StudentNotifications;
