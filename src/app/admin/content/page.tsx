'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

export default function ContentEditor() {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [config, setConfig] = useState<any>({
    hero: { title: '', subtitle: '', description: '' },
    promoBanner: { text: '', isActive: true },
    testimonials: [],
    faqs: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newBlog, setNewBlog] = useState({
    title: '',
    titleKa: '',
    titleRu: '',
    content: '',
    contentKa: '',
    contentRu: '',
    slug: '',
    image: '/assets/images/no_image.png',
  });

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setBlogs(data.blogPosts);
      }
    } catch (e) {
      console.error('Failed to load storefront content configurations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleConfigChange = (section: string, key: string, value: any) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      if (res.ok) {
        alert(t('admin_content_save_succ'));
      } else {
        alert(t('admin_content_save_fail'));
      }
    } catch (e) {
      alert(t('admin_content_save_net'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !newBlog.slug) {
      alert(t('admin_content_blog_req'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newBlogPost: newBlog }),
      });
      if (res.ok) {
        alert(t('admin_content_blog_succ'));
        setNewBlog({
          title: '',
          titleKa: '',
          titleRu: '',
          content: '',
          contentKa: '',
          contentRu: '',
          slug: '',
          image: '/assets/images/no_image.png',
        });
        loadContent();
      } else {
        alert(t('admin_content_blog_fail'));
      }
    } catch (e) {
      alert(t('admin_content_blog_err'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
            {t('admin_content_load')}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header Title */}
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white">
              {t('admin_content_title')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
              {t('admin_content_sub')}
            </p>
          </div>
        </div>

        {/* 2-Column Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: General landing config text inputs */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSaveConfig} className="space-y-8">
              {/* Promo Banner Settings */}
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-150 dark:border-neutral-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    {t('admin_content_top_header')}
                  </h3>
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.promoBanner?.isActive}
                      onChange={(e) =>
                        handleConfigChange('promoBanner', 'isActive', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-250 dark:bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-300 relative" />
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      {t('admin_content_active')}
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('admin_content_banner_text')}
                  </label>
                  <input
                    type="text"
                    value={config.promoBanner?.text}
                    onChange={(e) => handleConfigChange('promoBanner', 'text', e.target.value)}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Homepage Hero overlays */}
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">
                  {t('admin_content_hero')}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('admin_content_hero_title')}
                    </label>
                    <input
                      type="text"
                      value={config.hero?.title}
                      onChange={(e) => handleConfigChange('hero', 'title', e.target.value)}
                      className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('admin_content_hero_sub')}
                    </label>
                    <input
                      type="text"
                      value={config.hero?.subtitle}
                      onChange={(e) => handleConfigChange('hero', 'subtitle', e.target.value)}
                      className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      {t('admin_content_hero_desc')}
                    </label>
                    <textarea
                      value={config.hero?.description}
                      onChange={(e) => handleConfigChange('hero', 'description', e.target.value)}
                      rows={3}
                      className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider hover:opacity-90 shadow-md disabled:opacity-50"
                >
                  {t('admin_content_save_config')}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Blogs entry creator */}
          <div className="lg:col-span-5 space-y-8">
            {/* Create Blog Post form */}
            <form
              onSubmit={handleSaveBlog}
              className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">
                {t('admin_content_pub_blog')}
              </h3>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('admin_content_blog_title_en')}
                </label>
                <input
                  type="text"
                  required
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({
                      ...newBlog,
                      title: e.target.value,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, ''),
                    })
                  }
                  placeholder="e.g. Art of Tailoring"
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    {t('admin_content_blog_title_ka')}
                  </label>
                  <input
                    type="text"
                    value={newBlog.titleKa}
                    onChange={(e) => setNewBlog({ ...newBlog, titleKa: e.target.value })}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Title (Russian)
                  </label>
                  <input
                    type="text"
                    value={newBlog.titleRu}
                    onChange={(e) => setNewBlog({ ...newBlog, titleRu: e.target.value })}
                    className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('admin_content_blog_slug')}
                </label>
                <input
                  type="text"
                  required
                  value={newBlog.slug}
                  onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('admin_content_blog_img')}
                </label>
                <input
                  type="text"
                  value={newBlog.image}
                  onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  {t('admin_content_blog_body')}
                </label>
                <textarea
                  required
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  rows={6}
                  placeholder="Start writing article details..."
                  className="w-full text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 rounded-lg focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
                >
                  {t('admin_content_pub_art')}
                </button>
              </div>
            </form>

            {/* List of active published blogs */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-150 dark:border-neutral-800 pb-2">
                {t('admin_content_act_art')}
              </h3>

              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                {blogs.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic py-4 text-center">
                    {t('admin_content_no_art')}
                  </p>
                ) : (
                  blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex justify-between items-center p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800"
                    >
                      <div>
                        <p className="text-xs font-semibold text-neutral-950 dark:text-white leading-tight">
                          {blog.title}
                        </p>
                        <p className="text-[9px] text-neutral-400 mt-0.5">/{blog.slug}</p>
                      </div>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase">
                        {blog.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
