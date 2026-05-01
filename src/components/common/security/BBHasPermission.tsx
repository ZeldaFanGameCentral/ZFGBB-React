import { UserContext } from "../../../providers/user/userProvider";
import type { BBPermission } from "../../../types/api";

export interface BBHasPermissionProps {
  perms: BBPermission[];
  children: React.ReactNode;
}

export default function BBHasPermission({
  perms,
  children,
}: BBHasPermissionProps) {
  const { permissions } = useContext(UserContext);
  const hasPerm = useMemo(() => {
    return permissions
      ?.map((p) => p.permissionCode as BBPermission)
      .some((p) => perms.includes(p));
  }, [perms, permissions]);

  return <>{hasPerm && children}</>;
}
