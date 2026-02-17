'use client';

import { useState } from 'react';
import { Bookmark } from '@/types';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDeleted: () => void;
}

export function BookmarkCard({ bookmark, onDeleted }: BookmarkCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id);

      if (error) throw error;
      toast.success('Bookmark deleted');
      onDeleted();
    } catch (error) {
      toast.error('Failed to delete bookmark');
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  const getGradient = (url: string) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-green-500 to-emerald-500',
      'from-indigo-500 to-blue-500',
      'from-pink-500 to-rose-500',
    ];
    const index = url.length % gradients.length;
    return gradients[index];
  };

  const faviconUrl = getFaviconUrl(bookmark.url);

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 animate-scale-in border-0 glass-effect">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-5">
        <div className="flex items-center gap-4">
          {/* Website Logo/Favicon */}
          <div className="flex-shrink-0">
            {!imageError && faviconUrl ? (
              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-gray-100">
                <img
                  src={faviconUrl}
                  alt={getDomain(bookmark.url)}
                  className="w-8 h-8 object-contain"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(bookmark.url)} shadow-md flex items-center justify-center`}>
                <span className="text-white text-lg font-bold">
                  {getDomain(bookmark.url)[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group/link"
            >
              <h3 className="text-base font-bold text-gray-900 mb-1 group-hover/link:text-primary-600 transition-colors truncate">
                {bookmark.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="truncate font-medium">{getDomain(bookmark.url)}</span>
              </div>
            </a>
          </div>

          {/* Date and Delete */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 hover:scale-110"
              title="Delete bookmark"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
