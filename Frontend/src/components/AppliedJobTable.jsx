// import React from 'react'
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
// import { Badge } from './ui/badge'
// import { useSelector } from 'react-redux'
// import Navbar from './shared/Navbar'

// const AppliedJobTable = () => {
//     const {allAppliedJobs} = useSelector(store=>store.job);
//     return (
//         <div>
//             <Navbar/>
//             <span className='mb-5'></span>
//             <Table>
//                 <TableCaption>A list of your applied jobs</TableCaption>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Job Role</TableHead>
//                         <TableHead>Company</TableHead>
//                         <TableHead className="text-right">Status</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {
//                         allAppliedJobs.length <= 0 ? <span>You haven't applied any job yet.</span> : allAppliedJobs.map((appliedJob) => (
//                             <TableRow key={appliedJob._id}>
//                                 <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
//                                 <TableCell>{appliedJob.job?.title}</TableCell>
//                                 <TableCell>{appliedJob.job?.company?.name}</TableCell>
//                                 <TableCell className="text-right"><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></TableCell>
//                             </TableRow>
//                         ))
//                     }
//                 </TableBody>
//             </Table>
//         </div>
//     )
// }

// export default AppliedJobTable



import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatus = (status) => (status || "pending").toLowerCase();

  const getStatusConfig = (status) => {
    switch (getStatus(status)) {
      case "accepted":
      case "selected":
        return {
          label: status.toUpperCase(),
          className:
            "border border-green-200 bg-green-50 text-green-700 hover:bg-green-50",
          icon: CheckCircle2,
        };

      case "rejected":
        return {
          label: status.toUpperCase(),
          className:
            "border border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
          icon: XCircle,
        };

      case "pending":
        return {
          label: "PENDING",
          className:
            "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
          icon: Clock3,
        };

      default:
        return {
          label: status.toUpperCase(),
          className:
            "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
          icon: Clock3,
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredJobs = useMemo(() => {
    return allAppliedJobs.filter((application) => {
      const title = application.job?.title || "";
      const company = application.job?.company?.name || "";
      const status = getStatus(application.status);

      const matchesSearch = `${title} ${company}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allAppliedJobs, searchTerm, statusFilter]);

  const totalApplications = allAppliedJobs.length;

  const pendingApplications = allAppliedJobs.filter(
    (job) => getStatus(job.status) === "pending"
  ).length;

  const acceptedApplications = allAppliedJobs.filter((job) =>
    ["accepted", "selected"].includes(getStatus(job.status))
  ).length;

  const rejectedApplications = allAppliedJobs.filter(
    (job) => getStatus(job.status) === "rejected"
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: totalApplications,
      icon: BriefcaseBusiness,
      iconClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending",
      value: pendingApplications,
      icon: Clock3,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      label: "Accepted",
      value: acceptedApplications,
      icon: CheckCircle2,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      label: "Rejected",
      value: rejectedApplications,
      icon: XCircle,
      iconClass: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <BriefcaseBusiness size={17} />
            Career Dashboard
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Job Applications
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Track your applications and stay updated on your job search.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Applications Section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <FileText size={20} className="text-indigo-600" />
                  Application History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  You have {totalApplications} application
                  {totalApplications !== 1 ? "s" : ""} in total.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search job or company..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { label: "All Applications", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Accepted", value: "accepted" },
                { label: "Rejected", value: "rejected" },
              ].map((filter) => {
                const isActive = statusFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableCaption className="pb-4">
                Your applied jobs and their current application status.
              </TableCaption>

              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="whitespace-nowrap px-5 py-4 font-semibold text-slate-600">
                    Applied On
                  </TableHead>
                  <TableHead className="min-w-[200px] px-5 py-4 font-semibold text-slate-600">
                    Job Role
                  </TableHead>
                  <TableHead className="min-w-[180px] px-5 py-4 font-semibold text-slate-600">
                    Company
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-5 py-4 text-right font-semibold text-slate-600">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((appliedJob) => {
                    const statusConfig = getStatusConfig(appliedJob.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow
                        key={appliedJob._id}
                        className="transition-colors hover:bg-indigo-50/40"
                      >
                        <TableCell className="whitespace-nowrap px-5 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays
                              size={16}
                              className="shrink-0 text-slate-400"
                            />
                            {formatDate(appliedJob.createdAt)}
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-5">
                          <div className="font-semibold text-slate-900">
                            {appliedJob.job?.title || "Job no longer available"}
                          </div>
                          <p className="mt-1 text-xs text-slate-400">
                            Application ID:{" "}
                            {appliedJob._id?.slice(-8) || "N/A"}
                          </p>
                        </TableCell>

                        <TableCell className="px-5 py-5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <Building2 size={18} />
                            </div>
                            <span className="font-medium text-slate-700">
                              {appliedJob.job?.company?.name || "N/A"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-5 text-right">
                          <Badge
                            className={`gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
                          >
                            <StatusIcon size={13} />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64">
                      <div className="flex flex-col items-center justify-center px-4 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                          <BriefcaseBusiness size={30} />
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900">
                          {allAppliedJobs.length === 0
                            ? "No applications yet"
                            : "No matching applications"}
                        </h3>

                        <p className="mt-2 max-w-sm text-sm text-slate-500">
                          {allAppliedJobs.length === 0
                            ? "You haven't applied to any jobs yet. Explore job opportunities and start your career journey."
                            : "Try another search term or select a different status filter."}
                        </p>

                        {(searchTerm || statusFilter !== "all") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchTerm("");
                              setStatusFilter("all");
                            }}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                          >
                            Clear filters
                            <ArrowUpRight size={16} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredJobs.length} of {totalApplications} applications
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Application statuses reflect the latest available data
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AppliedJobTable;
