import { useState } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  ShoppingBag,
  Scissors,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  DollarSign,
  ChevronDown,
  Lock,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { StaffReport, AttendanceStatus, TargetAchievement, StaffMember } from '../types/salon';
import { SAMPLE_REPORT, createEmptyReport } from '../data/initialData';
import { CatalogProduct, CatalogService } from '../data/bareglowCatalog';
import ProductPickerModal from './ProductPickerModal';
import ServicePickerModal from './ServicePickerModal';

interface StaffReportFormProps {
  report: StaffReport;
  staffList?: StaffMember[];
  onUpdateReport: (updated: StaffReport) => void;
  onSaveToOwnerQueue: (report: StaffReport) => void;
  onSwitchToPreview: () => void;
  isOwner?: boolean;
}

export default function StaffReportForm({
  report,
  staffList = [],
  onUpdateReport,
  onSaveToOwnerQueue,
  onSwitchToPreview,
  isOwner = false
}: StaffReportFormProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'duties' | 'clients' | 'marketing' | 'feedback' | 'targets' | 'review'>('attendance');
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  const [selectedDayIndexForService, setSelectedDayIndexForService] = useState<number>(0);
  const [submittedToast, setSubmittedToast] = useState(false);

  // Staff PIN verification modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Helper to update root report fields
  const updateField = <K extends keyof StaffReport>(field: K, value: StaffReport[K]) => {
    onUpdateReport({ ...report, [field]: value });
  };

  // Helper for attendance row changes
  const updateAttendance = (index: number, field: string, val: any) => {
    const updated = [...report.attendance];
    updated[index] = { ...updated[index], [field]: val };
    
    // Auto-compute total hours
    onUpdateReport({ ...report, attendance: updated });
  };

  // Helper for daily duties
  const updateDuty = (index: number, field: string, val: string) => {
    const updated = [...report.dailyDuties];
    updated[index] = { ...updated[index], [field]: val };
    onUpdateReport({ ...report, dailyDuties: updated });
  };

  // Helper for client services
  const updateClientService = (index: number, field: string, val: any) => {
    const updated = [...report.clientServices];
    updated[index] = { ...updated[index], [field]: val };
    onUpdateReport({ ...report, clientServices: updated });
  };

  // Helper for marketing
  const updateMarketing = (index: number, field: string, val: string) => {
    const updated = [...report.marketingActivities];
    updated[index] = { ...updated[index], [field]: val };
    onUpdateReport({ ...report, marketingActivities: updated });
  };

  // Helper for targets
  const updateTarget = (index: number, field: string, val: any) => {
    const updated = [...report.targets];
    updated[index] = { ...updated[index], [field]: val };
    onUpdateReport({ ...report, targets: updated });
  };

  // Auto calculate total sales
  const handleSalesChange = (field: 'serviceSalesTotal' | 'productSalesTotal' | 'otherSalesTotal', value: number) => {
    const service = field === 'serviceSalesTotal' ? value : report.serviceSalesTotal;
    const product = field === 'productSalesTotal' ? value : report.productSalesTotal;
    const other = field === 'otherSalesTotal' ? value : report.otherSalesTotal;
    const weeklyTotal = (Number(service) || 0) + (Number(product) || 0) + (Number(other) || 0);

    onUpdateReport({
      ...report,
      [field]: value,
      weeklyTotal
    });
  };

  // Add chosen product from Bareglow catalog
  const handleProductSelect = (product: CatalogProduct, qty: number) => {
    const lineTotal = product.priceKSh * qty;
    const lineText = `• ${qty}x ${product.name} (${product.size}) - KSh ${lineTotal.toLocaleString()}`;
    const newProductsSold = report.productsSold ? `${report.productsSold}\n${lineText}` : lineText;
    const newProductSalesTotal = (report.productSalesTotal || 0) + lineTotal;
    const weeklyTotal = (report.serviceSalesTotal || 0) + newProductSalesTotal + (report.otherSalesTotal || 0);

    onUpdateReport({
      ...report,
      productsSold: newProductsSold,
      productSalesTotal: newProductSalesTotal,
      weeklyTotal
    });
    setIsProductPickerOpen(false);
  };

  // Add chosen service from Bareglow catalog
  const handleServiceSelect = (service: CatalogService) => {
    const updated = [...report.clientServices];
    const targetRow = updated[selectedDayIndexForService];
    const prefix = targetRow.servicesPerformed ? `${targetRow.servicesPerformed}, ` : '';
    targetRow.servicesPerformed = `${prefix}${service.name} (KSh ${service.priceKSh.toLocaleString()})`;
    targetRow.clientsAttended = Number(targetRow.clientsAttended || 0) + 1;

    // Increment service sales total
    const newServiceSalesTotal = (report.serviceSalesTotal || 0) + service.priceKSh;
    const weeklyTotal = newServiceSalesTotal + (report.productSalesTotal || 0) + (report.otherSalesTotal || 0);

    onUpdateReport({
      ...report,
      clientServices: updated,
      serviceSalesTotal: newServiceSalesTotal,
      weeklyTotal
    });
    setIsServicePickerOpen(false);
  };

  const handleSaveAndSubmit = () => {
    if (!report.staffName) {
      alert('Please enter or select your staff name before submitting your report.');
      return;
    }
    // If not owner, require staff member's 4-digit PIN
    if (!isOwner && staffList && staffList.length > 0) {
      setShowPinModal(true);
      setInputPin('');
      setPinError(null);
      return;
    }
    // Direct submission for owner or fallback
    onSaveToOwnerQueue(report);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  const handleVerifyPinAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchingStaff = staffList.find(
      (s) => s.name.trim().toLowerCase() === report.staffName.trim().toLowerCase()
    );

    // Validate against assigned staff PIN or Owner Master PIN '1234'
    const validPin = matchingStaff?.accessPin || '1234';
    if (inputPin === validPin || inputPin === '1234') {
      const updated: StaffReport = {
        ...report,
        staffSignature: report.staffName || 'Staff Member',
        staffSignatureDate: new Date().toISOString().split('T')[0]
      };
      onUpdateReport(updated);
      onSaveToOwnerQueue(updated);
      setShowPinModal(false);
      setInputPin('');
      setPinError(null);
      setSubmittedToast(true);
      setTimeout(() => setSubmittedToast(false), 4500);
    } else {
      setPinError(`Incorrect 4-digit PIN for ${report.staffName}. Please check the PIN assigned to you by Owner Tinez Kapuya.`);
    }
  };

  const handleLoadSample = () => {
    onUpdateReport(SAMPLE_REPORT);
  };

  const handleResetForm = () => {
    onUpdateReport(createEmptyReport());
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner & Control Actions */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/bareglow_logo_trimmed.png"
            alt="Bareglow Logo"
            className="h-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-base font-bold text-stone-900">Bareglow Weekly Staff Report Entry</h2>
            <p className="text-xs text-stone-500">
              Interactive form matching the official 3-page staff report protocol
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoadSample}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Load Sample (Faith Mwangi)
          </button>

          <button
            onClick={handleResetForm}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>

          <button
            onClick={onSwitchToPreview}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-800" />
            View Official 3-Page Preview
          </button>

          <button
            onClick={handleSaveAndSubmit}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Submit to Owner
          </button>
        </div>
      </div>

      {/* Submission Success Toast */}
      {submittedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              Report for <strong className="font-semibold">{report.staffName || 'Staff'}</strong> has been submitted to the Owner Private Section!
            </span>
          </div>
          <button
            onClick={onSwitchToPreview}
            className="text-xs font-semibold underline text-emerald-800 hover:text-emerald-950"
          >
            View Document Preview &rarr;
          </button>
        </div>
      )}

      {/* Staff & Metadata Form Strip */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-stone-100 pb-2">
          Report Header & Staff Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-stone-700 font-medium">Staff Member *</label>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                PIN Verified
              </span>
            </div>
            {staffList.filter((s) => s.status === 'active').length > 0 ? (
              <select
                value={report.staffName}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const member = staffList.find((s) => s.name === selectedName);
                  onUpdateReport({
                    ...report,
                    staffName: selectedName,
                    position: member ? member.position : report.position,
                    staffSignature: selectedName
                  });
                }}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white text-stone-900 font-semibold"
              >
                <option value="">-- Choose Your Staff Profile --</option>
                {staffList
                  .filter((s) => s.status === 'active')
                  .map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.position})
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                value={report.staffName}
                onChange={(e) => updateField('staffName', e.target.value)}
                placeholder="e.g. Faith Mwangi"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-stone-50 text-stone-900"
              />
            )}
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Position *</label>
            <input
              type="text"
              value={report.position}
              onChange={(e) => updateField('position', e.target.value)}
              placeholder="e.g. Senior Aesthetician & Hair Specialist"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-stone-50 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Week Commencing (Monday) *</label>
            <input
              type="date"
              value={report.weekCommencing}
              onChange={(e) => updateField('weekCommencing', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-stone-50 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Submission Date *</label>
            <input
              type="date"
              value={report.submissionDate}
              onChange={(e) => updateField('submissionDate', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-stone-50 text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin border-b border-stone-200">
        {[
          { id: 'attendance', label: '1. Attendance Record' },
          { id: 'duties', label: '2. Daily Duties & Work' },
          { id: 'clients', label: '3. Clients & Services (KSh)' },
          { id: 'marketing', label: '4. Marketing & Social' },
          { id: 'feedback', label: '5. Client Feedback' },
          { id: 'targets', label: '6. Targets & Next Week' },
          { id: 'review', label: '7. Owner / Supervisor' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-emerald-900 border-t-2 border-l border-r border-stone-200 border-t-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Attendance Record */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-emerald-900">1. ATTENDANCE RECORD — MONDAY TO SUNDAY</h3>
              <p className="text-xs text-stone-500">Record daily shifts, check-in times, and calculated hours.</p>
            </div>
            <div className="text-xs font-medium text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
              Total Hours:{' '}
              <span className="font-mono tabular-nums font-bold text-emerald-800">
                {report.attendance.reduce((sum, r) => sum + (Number(r.hours) || 0), 0)} hrs
              </span>
            </div>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-2.5">Day</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Time in</th>
                  <th className="p-2.5">Time out</th>
                  <th className="p-2.5 text-right">Hours</th>
                  <th className="p-2.5 text-center">Initials</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {report.attendance.map((row, idx) => (
                  <tr key={row.day} className="hover:bg-stone-50/50">
                    <td className="p-2 font-medium text-stone-800">{row.day}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.date}
                        onChange={(e) => updateAttendance(idx, 'date', e.target.value)}
                        className="w-24 px-2 py-1 border border-stone-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={row.status}
                        onChange={(e) => updateAttendance(idx, 'status', e.target.value as AttendanceStatus)}
                        className="px-2 py-1 border border-stone-200 rounded text-xs bg-white"
                      >
                        <option value="Present">Present</option>
                        <option value="Off">Off</option>
                        <option value="Leave">Leave</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="08:30 AM"
                        value={row.timeIn}
                        onChange={(e) => updateAttendance(idx, 'timeIn', e.target.value)}
                        className="w-24 px-2 py-1 border border-stone-200 rounded text-xs font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="06:30 PM"
                        value={row.timeOut}
                        onChange={(e) => updateAttendance(idx, 'timeOut', e.target.value)}
                        className="w-24 px-2 py-1 border border-stone-200 rounded text-xs font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        step="0.5"
                        value={row.hours}
                        onChange={(e) => updateAttendance(idx, 'hours', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-stone-200 rounded text-xs text-right font-mono"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="text"
                        value={row.initials}
                        onChange={(e) => updateAttendance(idx, 'initials', e.target.value)}
                        maxLength={3}
                        className="w-12 px-2 py-1 border border-stone-200 rounded text-xs text-center uppercase"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Attendance notes / explanation for lateness, absence, leave or shift changes:
            </label>
            <textarea
              rows={3}
              value={report.attendanceNotes}
              onChange={(e) => updateField('attendanceNotes', e.target.value)}
              placeholder="e.g. Worked extra hours Saturday for bridal packages. Shift swap approved by supervisor..."
              className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 bg-stone-50 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Daily Duties & Work Completed */}
      {activeTab === 'duties' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-900">2. DAILY DUTIES AND WORK COMPLETED</h3>
            <p className="text-xs text-stone-500">Record station sanitation, client prep, treatments, and pending follow-ups.</p>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-2.5 w-28">Day</th>
                  <th className="p-2.5">Main duties / tasks completed</th>
                  <th className="p-2.5 w-1/3">Any pending task or follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {report.dailyDuties.map((row, idx) => (
                  <tr key={row.day} className="hover:bg-stone-50/50">
                    <td className="p-2.5 font-medium text-stone-800 align-top">{row.day}</td>
                    <td className="p-2">
                      <textarea
                        rows={2}
                        value={row.tasksCompleted}
                        onChange={(e) => updateDuty(idx, 'tasksCompleted', e.target.value)}
                        placeholder={`Tasks completed on ${row.day}...`}
                        className="w-full p-2 border border-stone-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <textarea
                        rows={2}
                        value={row.pendingFollowUp}
                        onChange={(e) => updateDuty(idx, 'pendingFollowUp', e.target.value)}
                        placeholder="Pending task or follow up..."
                        className="w-full p-2 border border-stone-200 rounded text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Staff Signature</label>
              <input
                type="text"
                value={report.staffSignature}
                onChange={(e) => updateField('staffSignature', e.target.value)}
                placeholder="Digital name signature"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-serif italic"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                value={report.staffSignatureDate}
                onChange={(e) => updateField('staffSignatureDate', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Clients & Services */}
      {activeTab === 'clients' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-emerald-900">3. CLIENTS AND SERVICES</h3>
              <p className="text-xs text-stone-500">
                Log attended clients, services performed, and track weekly sales in KSh.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedDayIndexForService(0);
                  setIsServicePickerOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
              >
                <Scissors className="w-3.5 h-3.5" />
                Select Service from Catalog
              </button>

              <button
                type="button"
                onClick={() => setIsProductPickerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Pick Bareglow Product (80 Available)
              </button>
            </div>
          </div>

          {/* Daily Client Table */}
          <div className="border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-2.5 w-24">Day</th>
                  <th className="p-2.5 w-28 text-center">Clients Attended</th>
                  <th className="p-2.5">Services Performed / Key Details</th>
                  <th className="p-2.5 w-1/4">Follow-up Needed</th>
                  <th className="p-2.5 w-20 text-center">Catalog</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {report.clientServices.map((row, idx) => (
                  <tr key={row.day} className="hover:bg-stone-50/50">
                    <td className="p-2.5 font-medium text-stone-800 align-top">{row.day}</td>
                    <td className="p-2 text-center align-top">
                      <input
                        type="number"
                        min="0"
                        value={row.clientsAttended}
                        onChange={(e) => updateClientService(idx, 'clientsAttended', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-stone-200 rounded text-center font-mono text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <textarea
                        rows={2}
                        value={row.servicesPerformed}
                        onChange={(e) => updateClientService(idx, 'servicesPerformed', e.target.value)}
                        placeholder="e.g. 2x Knotless Braids, 1x Hydro Facial..."
                        className="w-full p-2 border border-stone-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <textarea
                        rows={2}
                        value={row.followUpNeeded}
                        onChange={(e) => updateClientService(idx, 'followUpNeeded', e.target.value)}
                        placeholder="Client follow-up..."
                        className="w-full p-2 border border-stone-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2 text-center align-top">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDayIndexForService(idx);
                          setIsServicePickerOpen(true);
                        }}
                        className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded border border-emerald-200"
                        title="Add service for this day"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sales Summary Grid (Exact Form strip in KSh) */}
          <div className="bg-stone-50 border border-stone-300 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">
              Weekly Revenue Summary (KSh)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Service Sales Total (KSh)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400">KSh</span>
                  <input
                    type="number"
                    value={report.serviceSalesTotal}
                    onChange={(e) => handleSalesChange('serviceSalesTotal', parseFloat(e.target.value) || 0)}
                    className="w-full pl-12 pr-3 py-2 border border-stone-300 rounded-lg font-mono font-semibold text-stone-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Product Sales Total (KSh)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400">KSh</span>
                  <input
                    type="number"
                    value={report.productSalesTotal}
                    onChange={(e) => handleSalesChange('productSalesTotal', parseFloat(e.target.value) || 0)}
                    className="w-full pl-12 pr-3 py-2 border border-stone-300 rounded-lg font-mono font-semibold text-stone-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Other Sales (KSh)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400">KSh</span>
                  <input
                    type="number"
                    value={report.otherSalesTotal}
                    onChange={(e) => handleSalesChange('otherSalesTotal', parseFloat(e.target.value) || 0)}
                    className="w-full pl-12 pr-3 py-2 border border-stone-300 rounded-lg font-mono font-semibold text-stone-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-800 font-bold mb-1">Weekly Total (KSh)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-emerald-800 font-bold">KSh</span>
                  <input
                    type="text"
                    readOnly
                    value={report.weeklyTotal.toLocaleString()}
                    className="w-full pl-12 pr-3 py-2 border border-emerald-400 bg-emerald-50 rounded-lg font-mono font-bold text-emerald-950 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Sold Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                Products sold (name, quantity and amount):
              </label>
              <button
                type="button"
                onClick={() => setIsProductPickerOpen(true)}
                className="text-xs text-emerald-800 hover:underline font-medium inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Insert from 80 Bareglow products
              </button>
            </div>
            <textarea
              rows={4}
              value={report.productsSold}
              onChange={(e) => updateField('productsSold', e.target.value)}
              placeholder="• 3x Salicylic cleanser (120ml) - KSh 3,600&#10;• 2x Vitamin C + hyaluronic acid serum - KSh 3,000..."
              className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 bg-stone-50"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Marketing Activities */}
      {activeTab === 'marketing' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-900">4. MARKETING ACTIVITIES AND TIME SPENT</h3>
            <p className="text-xs text-stone-500">Record social media stories, TikTok videos, reels, WhatsApp broadcast and client inquiries.</p>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-2.5 w-24">Day</th>
                  <th className="p-2.5">Marketing activity completed</th>
                  <th className="p-2.5 w-36">Platform</th>
                  <th className="p-2.5 w-24">Time spent</th>
                  <th className="p-2.5 w-1/3">Result / response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {report.marketingActivities.map((row, idx) => (
                  <tr key={row.day} className="hover:bg-stone-50/50">
                    <td className="p-2.5 font-medium text-stone-800 align-top">{row.day}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.activity}
                        onChange={(e) => updateMarketing(idx, 'activity', e.target.value)}
                        placeholder="Reel, story, broadcast..."
                        className="w-full px-2 py-1 border border-stone-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.platform}
                        onChange={(e) => updateMarketing(idx, 'platform', e.target.value)}
                        placeholder="Instagram / WhatsApp"
                        className="w-full px-2 py-1 border border-stone-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.timeSpent}
                        onChange={(e) => updateMarketing(idx, 'timeSpent', e.target.value)}
                        placeholder="30 mins"
                        className="w-full px-2 py-1 border border-stone-200 rounded text-xs font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.result}
                        onChange={(e) => updateMarketing(idx, 'result', e.target.value)}
                        placeholder="3 bookings, 450 views..."
                        className="w-full px-2 py-1 border border-stone-200 rounded text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Client Feedback & Challenges */}
      {activeTab === 'feedback' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-900">5. CUSTOMER EXPERIENCE, CHALLENGES AND IMPROVEMENT</h3>
            <p className="text-xs text-stone-500">Capture genuine customer impressions, complaints resolution, and salon needs.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Positive client feedback / compliments received:
              </label>
              <textarea
                rows={3}
                value={report.positiveFeedback}
                onChange={(e) => updateField('positiveFeedback', e.target.value)}
                placeholder="What did customers love about their hair, skin, or spa treatment?"
                className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-900 bg-stone-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Client complaints or issues and how they were handled:
              </label>
              <textarea
                rows={3}
                value={report.complaintsHandled}
                onChange={(e) => updateField('complaintsHandled', e.target.value)}
                placeholder="Any client dissatisfaction, wait time, or product concern and the recovery resolution taken..."
                className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-900 bg-stone-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Challenges experienced this week:
              </label>
              <textarea
                rows={3}
                value={report.challenges}
                onChange={(e) => updateField('challenges', e.target.value)}
                placeholder="Operational, environmental, equipment or scheduling bottlenecks..."
                className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-900 bg-stone-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                What support, supplies or training do you need?
              </label>
              <textarea
                rows={3}
                value={report.supportNeeded}
                onChange={(e) => updateField('supportNeeded', e.target.value)}
                placeholder="Products to restock, masterclass training, or supervisor support needed..."
                className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-900 bg-stone-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Targets & Next Week Plan */}
      {activeTab === 'targets' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-emerald-900">6. TARGETS AND NEXT-WEEK PLAN</h3>
            <p className="text-xs text-stone-500">Measure weekly target outcomes and establish priorities for next week.</p>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-2.5">Targets set for this week</th>
                  <th className="p-2.5 w-40 text-center">Achieved? (Yes / No / Partly)</th>
                  <th className="p-2.5 w-1/3">Reason / evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {report.targets.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.target}
                        onChange={(e) => updateTarget(idx, 'target', e.target.value)}
                        placeholder={`Target #${idx + 1}...`}
                        className="w-full px-2 py-1.5 border border-stone-200 rounded text-xs"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <select
                        value={row.achieved}
                        onChange={(e) => updateTarget(idx, 'achieved', e.target.value as TargetAchievement)}
                        className="px-2 py-1 border border-stone-200 rounded text-xs bg-white font-medium"
                      >
                        <option value="Yes">Yes</option>
                        <option value="Partly">Partly</option>
                        <option value="No">No</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.reason}
                        onChange={(e) => updateTarget(idx, 'reason', e.target.value)}
                        placeholder="Evidence or reason for result..."
                        className="w-full px-2 py-1.5 border border-stone-200 rounded text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              My priorities and targets for next week:
            </label>
            <textarea
              rows={4}
              value={report.nextWeekPriorities}
              onChange={(e) => updateField('nextWeekPriorities', e.target.value)}
              placeholder="1. Priority one...&#10;2. Priority two..."
              className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-stone-900 bg-stone-50"
            />
          </div>
        </div>
      )}

      {/* Tab 7: Owner / Supervisor Review */}
      {activeTab === 'review' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-emerald-900">7. OWNER / SUPERVISOR REVIEW</h3>
              <p className="text-xs text-stone-500">
                Evaluation and sign-off reserved for the salon owner or managing supervisor.
              </p>
            </div>
            {report.isReviewed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Signed by {report.reviewerName || 'Owner'}
              </span>
            ) : (
              <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Awaiting Owner Sign-Off
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Reviewer comments:</label>
              <textarea
                rows={3}
                value={report.reviewerComments}
                onChange={(e) => updateField('reviewerComments', e.target.value)}
                placeholder="Owner praise, evaluation, or coaching feedback..."
                disabled={!isOwner}
                className={`w-full p-2.5 border rounded-lg text-stone-900 ${
                  isOwner ? 'border-stone-300 bg-white' : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-2">Performance rating:</label>
              <div className="flex items-center gap-6">
                {(['Excellent', 'Good', 'Needs improvement'] as const).map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="perf_rating"
                      disabled={!isOwner}
                      checked={report.performanceRating === rating}
                      onChange={() => updateField('performanceRating', rating)}
                      className="text-emerald-800 focus:ring-emerald-700"
                    />
                    <span className="text-xs font-medium text-stone-800">{rating}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Action points / follow-up:</label>
              <textarea
                rows={2}
                value={report.actionPoints}
                onChange={(e) => updateField('actionPoints', e.target.value)}
                placeholder="Specific action items, replenishment or assignments..."
                disabled={!isOwner}
                className={`w-full p-2.5 border rounded-lg text-stone-900 ${
                  isOwner ? 'border-stone-300 bg-white' : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-200">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Reviewer Name & Signature</label>
                <input
                  type="text"
                  value={report.reviewerName}
                  onChange={(e) => {
                    updateField('reviewerName', e.target.value);
                    updateField('reviewerSignature', e.target.value);
                  }}
                  disabled={!isOwner}
                  placeholder="e.g. Tinez Kapuya (Owner)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-serif italic text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Review Date</label>
                <input
                  type="date"
                  value={report.reviewDate}
                  onChange={(e) => updateField('reviewDate', e.target.value)}
                  disabled={!isOwner}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {isOwner && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateField('isReviewed', true);
                    updateField('reviewDate', new Date().toISOString().split('T')[0]);
                    updateField('reviewerSignature', report.reviewerName || 'Owner Signature');
                    handleSaveAndSubmit();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve and Sign Report as Owner
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staff PIN Verification Modal for Submission */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Staff PIN Verification</h3>
                  <p className="text-[11px] text-stone-500">Sign & submit report to Owner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyPinAndSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 uppercase font-semibold">Submitting As:</span>
                  <span className="font-bold text-emerald-950">{report.staffName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 uppercase font-semibold">Position:</span>
                  <span className="font-medium text-stone-700">{report.position}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 uppercase font-semibold">Weekly Total:</span>
                  <span className="font-mono font-bold text-emerald-900">KSh {report.weeklyTotal.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Enter Your 4-Digit Staff Access PIN *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••"
                  value={inputPin}
                  onChange={(e) => {
                    setInputPin(e.target.value);
                    if (pinError) setPinError(null);
                  }}
                  className="w-full px-3 py-2.5 text-center text-lg tracking-widest font-mono font-bold border border-stone-300 rounded-xl bg-white text-stone-900 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
                />
                <p className="text-[10px] text-stone-500 mt-1 text-center">
                  Staff only enter their PIN when submitting reports. (Assigned by Tinez Kapuya)
                </p>
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{pinError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Verify PIN & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catalog Modals */}
      <ProductPickerModal
        isOpen={isProductPickerOpen}
        onClose={() => setIsProductPickerOpen(false)}
        onSelectProduct={handleProductSelect}
      />

      <ServicePickerModal
        isOpen={isServicePickerOpen}
        onClose={() => setIsServicePickerOpen(false)}
        onSelectService={handleServiceSelect}
      />
    </div>
  );
}
