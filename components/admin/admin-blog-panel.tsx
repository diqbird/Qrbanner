'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { AdminBlogEditor } from '@/components/admin/admin-blog-editor';
import { useAdminBlogPanel } from '@/hooks/use-admin-blog-panel';
import { AdminBlogCreateForm } from './admin-blog-create-form';
import { AdminBlogPostList } from './admin-blog-post-list';

export function AdminBlogPanel() {
  const panel = useAdminBlogPanel();
  const { t, editingId, setEditingId, fetchPosts } = panel;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-base">
          <FileText className="h-5 w-5 text-primary" /> {t('admin.blog.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {editingId ? (
          <AdminBlogEditor
            postId={editingId}
            onClose={() => setEditingId(null)}
            onSaved={fetchPosts}
          />
        ) : (
          <>
            <AdminBlogCreateForm panel={panel} />
            <AdminBlogPostList panel={panel} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
