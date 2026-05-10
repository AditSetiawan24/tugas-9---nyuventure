import { createClient } from '@/utils/supabase/server';
import SearchBar from './SearchBar';
import TicketList from './TicketList';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function AdminDashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';

  const supabase = await createClient();
  
  let dbQuery = supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`customer_name.ilike.%${query}%,place_name.ilike.%${query}%`);
  }

  const { data: tickets, error } = await dbQuery;

  if (error) {
    console.error('Error fetching tickets:', error);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Tiket</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar pemesanan tiket masuk destinasi</p>
        </div>
        
        <Suspense fallback={<div className="h-12 w-64 bg-gray-100 rounded-xl animate-pulse"></div>}>
          <SearchBar />
        </Suspense>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      }>
        <TicketList initialTickets={tickets || []} />
      </Suspense>
    </div>
  );
}
