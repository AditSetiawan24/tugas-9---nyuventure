'use client';

import { useOptimistic, startTransition } from 'react';
import { deleteTicketAction, updateTicketStatusAction } from '@/app/actions/admin';
import { Trash2, RefreshCw, MapPin, User, Mail, Phone, Calendar } from 'lucide-react';

type Ticket = {
  id: string;
  place_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  quantity: number;
  status: string;
  created_at: string;
};

export default function TicketList({ initialTickets }: { initialTickets: Ticket[] }) {
  const [optimisticTickets, addOptimisticAction] = useOptimistic(
    initialTickets,
    (state: Ticket[], action: { type: 'delete' | 'update'; id: string }) => {
      if (action.type === 'delete') {
        return state.filter((t) => t.id !== action.id);
      } else if (action.type === 'update') {
        return state.map((t) => 
          t.id === action.id 
            ? { ...t, status: t.status === 'success' ? 'canceled' : 'success' } 
            : t
        );
      }
      return state;
    }
  );

  const handleDelete = async (id: string) => {
    startTransition(() => {
      addOptimisticAction({ type: 'delete', id });
    });
    await deleteTicketAction(id);
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    startTransition(() => {
      addOptimisticAction({ type: 'update', id });
    });
    await updateTicketStatusAction(id, currentStatus);
  };

  if (optimisticTickets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
        <p className="text-gray-500">Tidak ada tiket ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
      <div className="divide-y divide-gray-100">
        {optimisticTickets.map((ticket) => (
          <div key={ticket.id} className="p-6 flex flex-col md:flex-row gap-6 items-start justify-between group hover:bg-gray-50/50 transition">
            
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between md:justify-start gap-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand" />
                  {ticket.place_name || 'Destinasi Wisata'}
                </h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  ticket.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                  ticket.status === 'canceled' ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {ticket.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{ticket.customer_name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{ticket.customer_email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{ticket.customer_phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              <div className="flex gap-4 items-center pt-2">
                <span className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-lg">
                  {ticket.quantity} Tiket
                </span>
                <span className="text-brand font-bold">
                  Rp {ticket.amount?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
              <button 
                onClick={() => handleUpdateStatus(ticket.id, ticket.status)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-medium transition"
              >
                <RefreshCw className="w-4 h-4" />
                Ubah Status
              </button>
              <button 
                onClick={() => handleDelete(ticket.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
