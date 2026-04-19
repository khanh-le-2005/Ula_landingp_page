import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Users, Mail, Phone, Calendar, ExternalLink, ShieldAlert, Database } from 'lucide-react';
import { fetchLeads, type LeadRecord } from '../adminApi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminCard, adminAccentText, adminSecondaryButton } from '../adminTheme';

const formatValue = (value: unknown) => {
  if (value == null || value === '') {
    return '—';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

export default function Leads() {
  const { isAuthenticated } = useAdminAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeads = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Không thể tải danh sách leads';
      setError(message);
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className={adminCard}>
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <Database className="w-3 h-3" />
              Lead Intelligence
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Registration <span className={adminAccentText}>Pipeline</span></h2>
            <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed text-sm">
              Real-time synchronization with ULA marketing API. Monitor conversions and export data for CRM integration.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadLeads()}
            className={adminSecondaryButton}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Force Sync
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
            <div className="text-sm font-bold text-rose-400">
                Unauthorized Access: Active session token required to decrypt lead metadata.
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4 text-rose-400 font-bold text-sm">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        ) : null}

        <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-950/40 backdrop-blur-3xl shadow-2xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase font-black tracking-[0.25em] text-slate-500">
                  <th className="px-6 py-5">Timestamp</th>
                  <th className="px-6 py-5">Customer Identity</th>
                  <th className="px-6 py-5">Interest Vector</th>
                  <th className="px-6 py-5">Source Attributes</th>
                  <th className="px-6 py-5 text-center">Protocol Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600">Retrieving Cloud Data...</span>
                        </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                        <div className="flex flex-col items-center gap-4 text-slate-600 font-bold italic">
                            <Users className="h-10 w-10 opacity-20" />
                            <span>Null Registry: No active leads detected.</span>
                        </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const formData = lead.formData || {};
                    const contactName = formatValue(formData.fullname ?? formData.name);
                    const contactPhone = formatValue(formData.phone ?? formData.sdt);
                    const interest = formatValue(formData.course_name ?? formData.courseInterest);
                    const source = [
                      lead.utm_source,
                      lead.utm_medium,
                      lead.utm_campaign,
                    ]
                      .filter(Boolean)
                      .join(' / ') || 'Organic';

                    return (
                      <tr key={lead._id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1.5 text-xs font-black text-slate-300">
                                <Calendar className="w-3 h-3 text-indigo-500" />
                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                             </div>
                             <div className="text-[10px] text-slate-600 font-mono">
                                {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                            <div className="space-y-1.5">
                                <div className="font-black text-white text-base tracking-tight">{contactName}</div>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        <Phone className="w-3 h-3 text-indigo-400/60" />
                                        {contactPhone}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        <Mail className="w-3 h-3 text-violet-400/60" />
                                        {formatValue(formData.email)}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/10 text-[11px] font-black text-indigo-300 uppercase tracking-widest">
                              {interest}
                           </div>
                        </td>
                        <td className="px-6 py-6 max-w-[200px]">
                           <div className="flex items-start gap-2">
                              <ExternalLink className="w-3 h-3 text-slate-600 mt-1 shrink-0" />
                              <div className="text-xs font-medium text-slate-500 leading-relaxed truncate group-hover:block group-hover:whitespace-normal transition-all" title={source}>
                                 {source}
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex justify-center">
                              <span className="relative flex items-center gap-2 overflow-hidden rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                {lead.status || 'NEW'}
                              </span>
                           </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-white/[0.01] border-t border-white/5 px-6 py-4 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-700">Displaying {leads.length} records</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-700">Encrypted Transport [TLS 1.3]</div>
          </div>
        </div>
      </section>
    </div>
  );
}
