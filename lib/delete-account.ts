import { prisma } from '@/lib/db';

export type DeleteAccountBlocker =
  | { ok: true }
  | { ok: false; error: 'workspace_owner_has_members'; workspaces: { id: string; name: string }[] };

/** Refuse delete when the user still owns a team workspace with other members. */
export async function assertCanDeleteAccount(userId: string): Promise<DeleteAccountBlocker> {
  const ownedTeams = await prisma.workspace.findMany({
    where: { ownerId: userId, isPersonal: false },
    select: {
      id: true,
      name: true,
      members: { select: { userId: true, email: true }, take: 50 },
    },
  });

  const blocked = ownedTeams.filter((ws) =>
    ws.members.some((m) => m.userId !== userId && m.userId != null)
  );

  if (blocked.length) {
    return {
      ok: false,
      error: 'workspace_owner_has_members',
      workspaces: blocked.map((ws) => ({ id: ws.id, name: ws.name })),
    };
  }

  return { ok: true };
}

/** Irreversible erase of the user and cascaded owned resources. */
export async function deleteUserAccount(userId: string, email: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Drop memberships in other workspaces (userId would otherwise SetNull).
    await tx.workspaceMember.deleteMany({ where: { userId } });
    await tx.verificationToken.deleteMany({ where: { identifier: email.toLowerCase() } });
    await tx.user.delete({ where: { id: userId } });
  });
}
