'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Bookmark } from '@/types';
import { BookmarkCard } from './BookmarkCard';

interface BookmarkListProps {
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'title';
}

export function BookmarkList({ searchQuery, sortBy }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBookmarks = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newBookmark = payload.new as Bookmark;
              if (newBookmark.user_id === user.id) {
                setBookmarks((prev) => {
                  if (prev.some(b => b.id === newBookmark.id)) {
                    return prev;
                  }
                  return [newBookmark, ...prev];
                });
              }
            } else if (payload.eventType === 'DELETE') {
              setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              const updatedBookmark = payload.new as Bookmark;
              if (updatedBookmark.user_id === user.id) {
                setBookmarks((prev) =>
                  prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
                );
              }
            }
          }
        )
        .subscribe();

      return channel;
    };

    const channelPromise = setupRealtimeSubscription();

    return () => {
      channelPromise.then((channel) => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, [supabase]);

  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = bookmarks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [bookmarks, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full" />
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0" />
        </div>
        <p className="mt-6 text-gray-600 font-medium">Loading your bookmarks...</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl mb-6 shadow-xl">
          <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No bookmarks yet</h3>
        <p className="text-gray-600 text-lg mb-6">Start building your collection by adding your first bookmark</p>
        <div className="flex items-center justify-center gap-2 text-primary-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Click the &apos;Add Bookmark&apos; button above</span>
        </div>
      </div>
    );
  }

  if (filteredAndSortedBookmarks.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-3xl mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 inline-block">
        <span className="text-sm font-semibold text-gray-700">
          {filteredAndSortedBookmarks.length} {filteredAndSortedBookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
        </span>
      </div>
      <div className="space-y-3">
        {filteredAndSortedBookmarks.map((bookmark, index) => (
          <div key={bookmark.id} style={{ animationDelay: `${index * 30}ms` }}>
            <BookmarkCard bookmark={bookmark} onDeleted={fetchBookmarks} />
          </div>
        ))}
      </div>
    </div>
  );
}
