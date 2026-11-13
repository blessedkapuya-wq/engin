import { Printer, Edit3, CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { StaffReport } from '../types/salon';

interface ReportDocumentPreviewProps {
  report: StaffReport;
  onEdit: () => void;
  onApproveByOwner?: () => void;
  isOwner?: boolean;
}

export default function ReportDocumentPreview({
  report,
  onEdit,
  onApproveByOwner,
  isOwner = false
}: ReportDocumentPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Action Toolbar (hidden during print) */}
      <div className="no-print mb-8 p-4 bg-white border border-stone-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interactive Form
          </button>
          <div className="h-6 w-[1px] bg-stone-200" />
          <div className="text-xs text-stone-600">
            Official 3-Page Preview for <span className="font-semibold text-stone-900">{report.staffName || 'Staff Member'}</span>
            {report.isReviewed && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Reviewed & Signed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOwner && !report.isReviewed && onApproveByOwner && (
            <button
              onClick={onApproveByOwner}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-400 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Sign & Approve as Owner
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Print / Save Official PDF
          </button>
        </div>
      </div>

      {/* DOCUMENT CONTAINER */}
      <div className="space-y-12 print:space-y-0 text-stone-900 leading-normal text-xs">

        {/* ========================================================= */}
        {/* PAGE 1 */}
        {/* ========================================================= */}
        <section className="print-page bg-white p-8 sm:p-12 shadow-lg border border-stone-200 rounded-lg max-w-[850px] mx-auto min-h-[1100px] flex flex-col justify-between">
          <div>
            {/* Header with Exact Bareglow Logo */}
            <div className="flex flex-col items-center justify-center mb-6">
              <img
                src="/bareglow_logo_clean.png"
                alt="Bareglow Logo - Organic Natural Healthy"
                className="h-16 sm:h-20 object-contain mb-3"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-base sm:text-lg font-bold tracking-wider text-emerald-800 uppercase">
                WEEKLY STAFF REPORT
              </h1>
              <p className="text-[10px] sm:text-xs font-medium tracking-widest text-emerald-900/70 uppercase mt-0.5">
                STAFF PERFORMANCE • ATTENDANCE • CLIENT CARE • MARKETING
              </p>
            </div>

            {/* Metadata Fields Box */}
            <div className="border border-stone-300 rounded-none mb-6 text-xs divide-y divide-stone-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-300">
                <div className="p-2 flex items-center">
                  <span className="font-semibold text-stone-800 w-28 shrink-0">Staff name:</span>
                  <span className="text-stone-900 font-medium">{report.staffName || '________________________________'}</span>
                </div>
                <div className="p-2 flex items-center">
                  <span className="font-semibold text-stone-800 w-24 shrink-0">Position:</span>
                  <span className="text-stone-900 font-medium">{report.position || '______________________'}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-300">
                <div className="p-2 flex items-center">
                  <span className="font-semibold text-stone-800 w-44 shrink-0">Week commencing (Monday):</span>
                  <span className="text-stone-900 font-medium">{report.weekCommencing || '______________'}</span>
                </div>
                <div className="p-2 flex items-center">
                  <span className="font-semibold text-stone-800 w-32 shrink-0">Submission date:</span>
                  <span className="text-stone-900 font-medium">{report.submissionDate || '______________'}</span>
                </div>
              </div>
            </div>

            {/* 1. ATTENDANCE RECORD */}
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 tracking-wide uppercase">
                1. ATTENDANCE RECORD — MONDAY TO SUNDAY
              </h2>
              <div className="border border-stone-300 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-300 text-stone-700 font-semibold">
                      <th className="p-1.5 border-r border-stone-300 w-20">Day</th>
                      <th className="p-1.5 border-r border-stone-300 w-24">Date</th>
                      <th className="p-1.5 border-r border-stone-300">
                        Status<br />
                        <span className="font-normal text-[10px] text-stone-500">(Present / Off / Leave / Absent)</span>
                      </th>
                      <th className="p-1.5 border-r border-stone-300 w-20">Time in</th>
                      <th className="p-1.5 border-r border-stone-300 w-20">Time out</th>
                      <th className="p-1.5 border-r border-stone-300 w-16 text-right">Hours</th>
                      <th className="p-1.5 w-16 text-center">Initials</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300">
                    {report.attendance.map((row) => (
                      <tr key={row.day} className="hover:bg-stone-50/50">
                        <td className="p-1.5 border-r border-stone-300 font-medium text-stone-800">{row.day}</td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-700">{row.date}</td>
                        <td className="p-1.5 border-r border-stone-300">
                          <span className={`font-medium ${
                            row.status === 'Present' ? 'text-emerald-800' :
                            row.status === 'Off' ? 'text-stone-500' :
                            row.status === 'Leave' ? 'text-amber-800' : 'text-red-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-700 font-mono text-[10px]">{row.timeIn || '—'}</td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-700 font-mono text-[10px]">{row.timeOut || '—'}</td>
                        <td className="p-1.5 border-r border-stone-300 font-mono tabular-nums text-right">{row.hours || '0'}</td>
                        <td className="p-1.5 text-center font-semibold text-stone-600">{row.initials || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Attendance notes */}
              <div className="mt-2 border border-stone-300 p-2 min-h-[50px] bg-stone-50/30">
                <span className="font-semibold text-stone-800 block text-[11px] mb-1">
                  Attendance notes / explanation for lateness, absence, leave or shift changes:
                </span>
                <p className="text-[11px] text-stone-700 whitespace-pre-wrap italic">
                  {report.attendanceNotes || 'None recorded.'}
                </p>
              </div>
            </div>

            {/* 2. DAILY DUTIES AND WORK COMPLETED */}
            <div className="mb-4">
              <h2 className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 tracking-wide uppercase">
                2. DAILY DUTIES AND WORK COMPLETED
              </h2>
              <div className="border border-stone-300 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-300 text-stone-700 font-semibold">
                      <th className="p-1.5 border-r border-stone-300 w-24">Day</th>
                      <th className="p-1.5 border-r border-stone-300">Main duties / tasks completed</th>
                      <th className="p-1.5 w-1/3">Any pending task or follow-up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300">
                    {report.dailyDuties.map((row) => (
                      <tr key={row.day} className="hover:bg-stone-50/50">
                        <td className="p-1.5 border-r border-stone-300 font-medium text-stone-800 align-top">{row.day}</td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-700 align-top whitespace-pre-line">{row.tasksCompleted || '—'}</td>
                        <td className="p-1.5 text-stone-600 align-top whitespace-pre-line">{row.pendingFollowUp || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature on Page 1 */}
            <div className="pt-4 flex flex-wrap items-center justify-between text-[11px] border-t border-stone-200 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-800">Staff signature:</span>
                <span className="font-serif italic text-sm text-stone-900 border-b border-stone-400 px-3 min-w-[200px]">
                  {report.staffSignature || '________________________'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-800">Date:</span>
                <span className="font-mono text-stone-900 border-b border-stone-400 px-2 min-w-[100px]">
                  {report.staffSignatureDate || '____________'}
                </span>
              </div>
            </div>
          </div>

          {/* Page 1 Footer */}
          <div className="text-right text-[10px] text-stone-400 pt-4 border-t border-stone-100">
            Page 1
          </div>
        </section>

        {/* ========================================================= */}
        {/* PAGE 2 */}
        {/* ========================================================= */}
        <section className="print-page bg-white p-8 sm:p-12 shadow-lg border border-stone-200 rounded-lg max-w-[850px] mx-auto min-h-[1100px] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-col items-center justify-center mb-6">
              <img
                src="/bareglow_logo_clean.png"
                alt="Bareglow Logo"
                className="h-12 sm:h-14 object-contain mb-2"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-base sm:text-lg font-bold tracking-wider text-emerald-800 uppercase">
                WEEKLY STAFF REPORT — CONTINUED
              </h1>
              <p className="text-[10px] sm:text-xs text-stone-500 italic mt-0.5">
                Complete every section honestly. Use additional pages if necessary.
              </p>
            </div>

            {/* 3. CLIENTS AND SERVICES */}
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 tracking-wide uppercase">
                3. CLIENTS AND SERVICES
              </h2>
              <div className="border border-stone-300 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-300 text-stone-700 font-semibold">
                      <th className="p-1.5 border-r border-stone-300 w-24">Day</th>
                      <th className="p-1.5 border-r border-stone-300 w-32 text-center">No. of clients attended</th>
                      <th className="p-1.5 border-r border-stone-300">Services performed / key details</th>
                      <th className="p-1.5 w-1/4">Follow-up needed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300">
                    {report.clientServices.map((row) => (
                      <tr key={row.day} className="hover:bg-stone-50/50">
                        <td className="p-1.5 border-r border-stone-300 font-medium text-stone-800 align-top">{row.day}</td>
                        <td className="p-1.5 border-r border-stone-300 font-mono tabular-nums text-center align-top">{row.clientsAttended}</td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-700 align-top whitespace-pre-line">{row.servicesPerformed || '—'}</td>
                        <td className="p-1.5 text-stone-600 align-top whitespace-pre-line">{row.followUpNeeded || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Sales Totals Row (exact 4-column strip from the PDF form) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t-2 border-stone-400 bg-stone-50/70 text-[11px] divide-x divide-stone-300">
                  <div className="p-2">
                    <span className="block text-[10px] text-stone-600 font-semibold">Service sales total (KSh)</span>
                    <span className="font-mono tabular-nums font-bold text-stone-900 text-xs">
                      {report.serviceSalesTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2">
                    <span className="block text-[10px] text-stone-600 font-semibold">Product sales total (KSh)</span>
                    <span className="font-mono tabular-nums font-bold text-stone-900 text-xs">
                      {report.productSalesTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2">
                    <span className="block text-[10px] text-stone-600 font-semibold">Other sales (KSh)</span>
                    <span className="font-mono tabular-nums font-bold text-stone-900 text-xs">
                      {report.otherSalesTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 bg-emerald-50/60">
                    <span className="block text-[10px] text-emerald-800 font-semibold">Weekly total (KSh)</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-900 text-sm">
                      {report.weeklyTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Sold Box */}
              <div className="mt-2 border border-stone-300 p-2 min-h-[45px] bg-stone-50/30">
                <span className="font-semibold text-stone-800 block text-[11px] mb-1">
                  Products sold (name, quantity and amount):
                </span>
                <p className="text-[11px] text-stone-700 whitespace-pre-wrap">
                  {report.productsSold || 'None recorded for this week.'}
                </p>
              </div>
            </div>

            {/* 4. MARKETING ACTIVITIES AND TIME SPENT */}
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 tracking-wide uppercase">
                4. MARKETING ACTIVITIES AND TIME SPENT
              </h2>
              <div className="border border-stone-300 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-300 text-stone-700 font-semibold">
                      <th className="p-1.5 border-r border-stone-300 w-24">Day</th>
                      <th className="p-1.5 border-r border-stone-300">Marketing activity completed</th>
                      <th className="p-1.5 border-r border-stone-300 w-28">Platform</th>
                      <th className="p-1.5 border-r border-stone-300 w-20">Time spent</th>
                      <th className="p-1.5 w-1/4">Result / response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300">
                    {report.marketingActivities.map((row) => (
                      <tr key={row.day} className="hover:bg-stone-50/50">
                        <td className="p-1.5 border-r border-stone-300 font-medium text-stone-800 align-top">{row.day}</td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-700 align-top">{row.activity || '—'}</td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-600 align-top">{row.platform || '—'}</td>
                        <td className="p-1.5 border-r border-stone-300 text-stone-600 font-mono text-[10px] align-top">{row.timeSpent || '—'}</td>
                        <td className="p-1.5 text-stone-600 align-top">{row.result || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. CUSTOMER EXPERIENCE, CHALLENGES AND IMPROVEMENT */}
            <div className="mb-4">
              <h2 className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 tracking-wide uppercase">
                5. CUSTOMER EXPERIENCE, CHALLENGES AND IMPROVEMENT
              </h2>
              <div className="space-y-2">
                <div className="border border-stone-300 p-2 min-h-[45px]">
                  <span className="font-semibold text-stone-800 block text-[11px] mb-1">
                    Positive client feedback / compliments received:
                  </span>
                  <p className="text-[11px] text-stone-700 whitespace-pre-wrap">{report.positiveFeedback || '—'}</p>
                </div>
                <div className="border border-stone-300 p-2 min-h-[45px]">
                  <span className="font-semibold text-stone-800 block text-[11px] mb-1">
                    Client complaints or issues and how they were handled:
                  </span>
                  <p className="text-[11px] text-stone-700 whitespace-pre-wrap">{report.complaintsHandled || '—'}</p>
                </div>
                <div className="border border-stone-300 p-2 min-h-[45px]">
                  <span className="font-semibold text-stone-800 block text-[11px] mb-1">
                    Challenges experienced this week:
                  </span>
                  <p className="text-[11px] text-stone-700 whitespace-pre-wrap">{report.challenges || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="text-right text-[10px] text-stone-400 pt-4 border-t border-stone-100">
            Page 2
          </div>
        </section>

        {/* ========================================================= */}
        {/* PAGE 3 */}
        {/* ========================================================= */}
        <section className="print-page bg-white p-8 sm:p-12 shadow-lg border border-stone-200 rounded-lg max-w-[850px] mx-auto min-h-[1100px] flex flex-col justify-between">
          <div>
            {/* Continuation item from Page 2 */}
            <div className="border border-stone-300 p-2 min-h-[50px] mb-6">
              <span className="font-semibold text-stone-800 block text-[11px] mb-1">
                What support, supplies or training do you need?
              </span>
              <p className="text-[11px] text-stone-700 whitespace-pre-wrap">{report.supportNeeded || 'None at this time.'}</p>
            </div>

            {/* 6. TARGETS AND NEXT-WEEK PLAN */}
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 tracking-wide uppercase">
                6. TARGETS AND NEXT-WEEK PLAN
              </h2>
              <div className="border border-stone-300 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-300 text-stone-700 font-semibold">
                      <th className="p-1.5 border-r border-stone-300">Targets set for this week</th>
                      <th className="p-1.5 border-r border-stone-300 w-44 text-center">Achieved? (Yes / No / Partly)</th>
                      <th className="p-1.5 w-1/3">Reason / evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300">
                    {report.targets.map((row, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="p-1.5 border-r border-stone-300 text-stone-800 align-top">{row.target || '—'}</td>
                        <td className="p-1.5 border-r border-stone-300 text-center align-top">
                          <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[10px] ${
                            row.achieved === 'Yes' ? 'bg-emerald-100 text-emerald-800' :
                            row.achieved === 'Partly' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {row.achieved}
                          </span>
                        </td>
                        <td className="p-1.5 text-stone-600 align-top whitespace-pre-line">{row.reason || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Priorities & targets for next week */}
              <div className="mt-2 border border-stone-300 p-2 min-h-[50px] bg-stone-50/30">
                <span className="font-semibold text-stone-800 block text-[11px] mb-1">
                  My priorities and targets for next week:
                </span>
                <p className="text-[11px] text-stone-700 whitespace-pre-wrap">{report.nextWeekPriorities || '—'}</p>
              </div>
            </div>

            {/* 7. OWNER / SUPERVISOR REVIEW */}
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 tracking-wide uppercase">
                7. OWNER / SUPERVISOR REVIEW
              </h2>
              <div className="border border-stone-300 divide-y divide-stone-300 text-[11px]">
                <div className="p-2">
                  <span className="font-semibold text-stone-800 block mb-1">Reviewer comments:</span>
                  <p className="text-stone-700 whitespace-pre-wrap min-h-[30px] italic">
                    {report.reviewerComments || 'Pending owner review.'}
                  </p>
                </div>

                <div className="p-2 flex flex-wrap items-center gap-4 bg-stone-50/60">
                  <span className="font-semibold text-stone-800">Performance rating:</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="preview_rating"
                        readOnly
                        checked={report.performanceRating === 'Excellent'}
                        className="text-emerald-700 focus:ring-0"
                      />
                      <span className={report.performanceRating === 'Excellent' ? 'font-bold text-emerald-900' : 'text-stone-600'}>
                        Excellent
                      </span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="preview_rating"
                        readOnly
                        checked={report.performanceRating === 'Good'}
                        className="text-emerald-700 focus:ring-0"
                      />
                      <span className={report.performanceRating === 'Good' ? 'font-bold text-emerald-900' : 'text-stone-600'}>
                        Good
                      </span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="preview_rating"
                        readOnly
                        checked={report.performanceRating === 'Needs improvement'}
                        className="text-emerald-700 focus:ring-0"
                      />
                      <span className={report.performanceRating === 'Needs improvement' ? 'font-bold text-amber-900' : 'text-stone-600'}>
                        Needs improvement
                      </span>
                    </label>
                  </div>
                </div>

                <div className="p-2">
                  <span className="font-semibold text-stone-800 block mb-1">Action points / follow-up:</span>
                  <p className="text-stone-700 whitespace-pre-wrap min-h-[30px]">
                    {report.actionPoints || 'No action points logged yet.'}
                  </p>
                </div>

                <div className="p-2 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-300">
                  <div className="flex items-center gap-2 py-1">
                    <span className="font-semibold text-stone-800">Reviewer name & signature:</span>
                    <span className="font-serif italic text-sm text-stone-900">
                      {report.reviewerSignature || report.reviewerName || '_______________________'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:pl-3 py-1">
                    <span className="font-semibold text-stone-800">Date:</span>
                    <span className="font-mono text-stone-900">
                      {report.reviewDate || '_______________________'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Declaration & Final Sign-off */}
            <div className="mt-4 pt-3 border-t border-stone-300">
              <p className="italic text-stone-600 text-[11px] mb-3">
                I confirm that the information in this report is accurate and complete.
              </p>
              <div className="flex flex-wrap items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">Staff signature:</span>
                  <span className="font-serif italic text-sm text-stone-900 border-b border-stone-400 px-3 min-w-[200px]">
                    {report.staffSignature || '________________________'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">Date:</span>
                  <span className="font-mono text-stone-900 border-b border-stone-400 px-2 min-w-[100px]">
                    {report.staffSignatureDate || '____________'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Footer Brand Line */}
            <div className="mt-8 text-center text-xs font-semibold tracking-wider text-emerald-900/80 uppercase">
              BAREGLOW • Organic • Natural • Healthy
            </div>
          </div>

          {/* Page 3 Footer */}
          <div className="text-right text-[10px] text-stone-400 pt-4 border-t border-stone-100">
            Page 3
          </div>
        </section>

      </div>
    </div>
  );
}
