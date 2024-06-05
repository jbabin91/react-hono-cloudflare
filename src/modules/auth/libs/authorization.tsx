import { type User } from 'lucia';
import { useCallback } from 'react';

import { type Roles, roles, type SelectComment } from '@/db/schema';

import { useUser } from './auth';

export const Policies = {
  'comment:delete': (user: User, comment: SelectComment) => {
    if (user.role === roles.admin) {
      return true;
    }

    if (user.role === roles.user && comment.authorId === user.id) {
      return true;
    }

    return false;
  },
};

export function useAuthorization() {
  const user = useUser();

  const checkAccess = useCallback(
    ({ allowedRoles }: { allowedRoles: Roles[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles?.includes(user.data.role);
      }
      return true;
    },
    [user.data],
  );

  return { checkAccess, role: user?.data?.role };
}

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | { allowedRoles: Roles[]; policyCheck?: never }
  | { allowedRoles?: never; policyCheck: boolean }
);

export function Authorization({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (policyCheck !== undefined) {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
}
