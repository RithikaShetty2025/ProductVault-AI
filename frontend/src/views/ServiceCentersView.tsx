import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight, 
  X, 
  Check, 
  ExternalLink,
  Laptop,
  Sparkles
} from 'lucide-react';
import { Product, ServiceCenter, AppRoute } from '../types';

interface ServiceCentersViewProps {
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
  onTriggerToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ServiceCentersView: React.FC<ServiceCentersViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onTriggerToast
}) => {
  // No backend table exists for service centers yet — starts empty rather
  // than showing fabricated locations.
  const [centers] = useState<ServiceCenter[]>([]);
  const [brandFilter, setBrandFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal
  const [bookingModalCenter, setBookingModalCenter] = useState<ServiceCenter | null>(null);
  const [bookingProductId, setBookingProductId] = useState<string>(products[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('2026-10-05');
  const [bookingSlot, setBookingSlot] = useState('10:30 AM');
  const [bookingNotes, setBookingNotes] = useState('');

  const filteredCenters = useMemo(() => {
    return centers.filter(c => {
      if (brandFilter !== 'All' && !c.brand.toLowerCase().includes(brandFilter.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesAddr = c.address.toLowerCase().includes(q);
        const matchesBrand = c.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesAddr && !matchesBrand) return false;
      }
      return true;
    });
  }, [centers, brandFilter, searchQuery]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalCenter) return;
    const target = products.find(p => p.id === bookingProductId);

    setBookingModalCenter(null);
    onTriggerToast(
      'success', 
      'Appointment Confirmed', 
      `Reserved slot at ${bookingModalCenter.name} on ${bookingDate} at ${bookingSlot} for ${target?.name || 'device'}. Reference #SRV-${Math.floor(1000 + Math.random() * 9000)}.`
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Authorized Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Authorized Service Centers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Certified flagship hubs, authorized repair partners, and certified in-home technicians for your durable products
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/claims')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            Warranty Claims Engine
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium pb-1">
            {['All', 'Apple', 'Samsung', 'Sony', 'LG Electronics'].map((b) => (
              <button
                key={b}
                onClick={() => setBrandFilter(b)}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  brandFilter === b
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hubs, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              {/* Top Row: Type & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {center.type}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{center.rating} / 5.0</span>
                </div>
              </div>

              {/* Title & Brand */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">{center.brand} Certified</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{center.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{center.address} • <strong className="text-slate-700">{center.distance}</strong></span>
                </p>
              </div>

              {/* Timing & Hours */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Diagnostics Speed</span>
                  <span className="font-semibold text-slate-800">{center.turnaroundTime}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Hours</span>
                  <span className="font-semibold text-slate-800">{center.openStatus}</span>
                </div>
              </div>

              {/* Supported Services */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Certified Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {center.supportedServices.map((srv, i) => (
                    <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{center.phone}</span>
              </span>

              <button
                onClick={() => setBookingModalCenter(center)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors"
              >
                Book Intake Slot
              </button>
            </div>

          </div>
        ))}
      </div>

      {filteredCenters.length === 0 && (
        <div className="text-center py-16 text-sm text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
          Authorized service center listings are not available yet.
        </div>
      )}

      {/* Booking Appointment Modal */}
      {bookingModalCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Certified Intake Reservation
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Book Repair Diagnostics</h3>
              </div>
              <button onClick={() => setBookingModalCenter(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Product</label>
                <select
                  value={bookingProductId}
                  onChange={(e) => setBookingProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {products.filter(p => p.type === 'durable').map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Window</label>
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="09:00 AM">09:00 AM (Morning Intake)</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="01:30 PM">01:30 PM (Afternoon Express)</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Symptoms</label>
                <input
                  type="text"
                  placeholder="e.g. Display artifact or battery draining quickly"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-[11px]">
                <strong>Warranty Verification:</strong> Bring your ProductVault digital proof packet. Your serial and tax invoices are pre-attested.
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setBookingModalCenter(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
