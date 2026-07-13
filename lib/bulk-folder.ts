import { prisma } from '@/lib/db';
import { normalizeFolderName, FOLDER_COLORS } from '@/lib/organize-utils';

/** Find-or-create folder by display name within a workspace (bulk import). */
export async function resolveBulkFolderId(
  userId: string,
  workspaceId: string,
  folderName: string | undefined,
  cache: Map<string, string>
): Promise<string | null> {
  if (!folderName) return null;
  const name = normalizeFolderName(folderName);
  if (!name) return null;
  const cached = cache.get(name.toLowerCase());
  if (cached) return cached;

  const existing = await prisma.qRFolder.findFirst({
    where: {
      userId,
      name,
      OR: [{ workspaceId }, { workspaceId: null }],
    },
    select: { id: true },
  });
  if (existing) {
    cache.set(name.toLowerCase(), existing.id);
    return existing.id;
  }

  const created = await prisma.qRFolder.create({
    data: { userId, workspaceId, name, color: FOLDER_COLORS[0] },
    select: { id: true },
  });
  cache.set(name.toLowerCase(), created.id);
  return created.id;
}
