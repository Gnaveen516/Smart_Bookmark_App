import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { AddBookmarkForm } from '@/components/bookmark/AddBookmarkForm';
import { BookmarkList } from '@/components/bookmark/BookmarkList';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <DashboardClient />
    </div>
  );
}
