'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  folder: string;
  createdAt: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (e) {
      console.error('Failed to load media vault.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('File uploaded successfully.');
        loadMedia();
      } else {
        alert('Failed to upload file.');
      }
    } catch (e) {
      alert('Error communicating with media API.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      alert('Media URL copied to clipboard: ' + url);
    }
  };

  // Folders compilation
  const folders = ['All', ...Array.from(new Set(media.map((m) => m.folder)))];

  const filteredMedia = media.filter((m) => {
    const matchesFolder = activeFolder === 'All' || m.folder === activeFolder;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title & Upload triggers */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              Media Library
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              Store, organize, and copy image links for products and content
            </p>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
            >
              <Icon name="ArrowUpTrayIcon" size={14} />
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>

        {/* 2-Column Library layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Folders list */}
          <div className="lg:col-span-3 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Library Directories
            </h3>
            <div className="flex flex-col gap-1.5">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeFolder === folder
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold'
                      : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="FolderIcon" size={16} />
                    <span className="truncate max-w-[120px]">{folder}</span>
                  </div>
                  <span className="text-[10px] opacity-65">
                    {folder === 'All'
                      ? media.length
                      : media.filter((m) => m.folder === folder).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Grid of assets */}
          <div className="lg:col-span-9 space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                <Icon name="MagnifyingGlassIcon" size={16} />
              </span>
              <input
                type="text"
                placeholder="Search assets by file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-20 text-neutral-400 text-xs italic">
                Loading Media Vault...
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs italic">
                No media files matched your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleCopyUrl(item.url)}
                    className="group bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow transition-shadow overflow-hidden flex flex-col justify-between cursor-pointer relative"
                  >
                    {/* Visual */}
                    <div className="aspect-[3/4] bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden flex items-center justify-center">
                      {item.mimeType.startsWith('video') ? (
                        <video src={item.url} muted className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Copy hover block overlay */}
                      <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 p-2 text-center">
                        <Icon name="LinkIcon" size={20} />
                        <span className="text-[9px] uppercase tracking-wider font-bold">
                          Copy Link Path
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800/80">
                      <p
                        className="text-[10px] font-semibold text-neutral-900 dark:text-white truncate"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p className="text-[8px] text-neutral-400 uppercase mt-0.5 font-medium tracking-wider">
                        {item.size} KB · {item.mimeType.split('/')?.[1] || 'File'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
