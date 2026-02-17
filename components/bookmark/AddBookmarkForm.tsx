'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddBookmarkFormProps {
  onSuccess?: () => void;
}

export function AddBookmarkForm({ onSuccess }: AddBookmarkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const supabase = createClient();

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { title?: string; url?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!validateUrl(url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      const { error } = await supabase
        .from('bookmarks')
        .insert([{ title: title.trim(), url: url.trim(), user_id: user.id }]);

      if (error) throw error;

      toast.success('Bookmark added successfully');
      setTitle('');
      setUrl('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add bookmark');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Title"
        placeholder="My Favorite Website"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        error={errors.title}
      />
      <Input
        label="URL"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setErrors((prev) => ({ ...prev, url: undefined }));
        }}
        error={errors.url}
      />
      <Button type="submit" loading={loading} className="w-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        Add Bookmark
      </Button>
    </form>
  );
}
