'use client';

import { useState } from 'react';
import { AddBookmarkForm } from '@/components/bookmark/AddBookmarkForm';
import { BookmarkList } from '@/components/bookmark/BookmarkList';

export default function DashboardClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">My Collection</h2>
            <p className="text-gray-600 text-lg">Organize and access your favorite links</p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Bookmark
          </button>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-effect border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 glass-effect border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 font-medium cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        <BookmarkList searchQuery={searchQuery} sortBy={sortBy} />
      </main>

      {/* Floating Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsDialogOpen(false)}
          />
          
          {/* Dialog */}
          <div className="relative w-full max-w-md animate-scale-in">
            <div className="glass-effect border-0 shadow-2xl rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Bookmark</h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddBookmarkForm onSuccess={() => setIsDialogOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
