import type { User } from "../../types/user";
import { getPublicApiBaseUrl } from "@/shared/http/api";

interface UserLeftPaneProps {
  user?: User;
  backgrounds?: {
    avatarContainer?: ThemeBackgroundClass;
    profileInfoContainer?: ThemeBackgroundClass;
  };
}

const AvatarSkeleton: React.FC = () => {
  return <BBSkeleton className="h-24 w-24 rounded border border-default " />;
};

const UserLeftPane: React.FC<UserLeftPaneProps> = ({
  user,
  backgrounds = {
    profileInfoContainer: "bg-muted",
    avatarContainer: "bg-muted",
  },
}) => {
  const avatarSrc = useMemo(() => {
    if (user?.bioInfo?.avatar) {
      return user.bioInfo?.avatar?.url && user.bioInfo?.avatar?.url?.trim()
        ? user.bioInfo.avatar.url
        : (`${getPublicApiBaseUrl()}/content/image/${user.bioInfo.avatar.contentResourceId}` as `${string}://${string}/${string}`);
    }

    return `${getPublicApiBaseUrl()}/content/image/3` as `${string}://${string}/${string}`;
  }, [user]);

  return (
    <BBFlex
      align="stretch"
      direction="col"
      className={`${backgrounds.avatarContainer ?? ""} h-full w-full truncate`}
    >
      <BBFlex
        align="stretch"
        className={`p-3 ${backgrounds.profileInfoContainer ?? ""} border-b border-default shrink-0 min-h-[76px]`}
      >
        <BBFlex
          direction="col"
          className="space-y-0.5 leading-tight font-medium truncate max-w-40"
        >
          {user && Number(user.id) > 0 ? (
            <BBLink
              to={`/user/profile/${user.id}`}
              className="font-medium truncate w-full"
              prefetch="intent"
            >
              {user?.displayName}
            </BBLink>
          ) : (
            <span className="font-medium">{user?.displayName}</span>
          )}
          {user?.bioInfo?.customTitle && (
            <BBMutedText className="truncate w-full">
              {user?.bioInfo?.customTitle}
            </BBMutedText>
          )}
        </BBFlex>
      </BBFlex>

      <BBFlex
        direction="col"
        align="center"
        justify="center"
        className="p-4  text-center"
      >
        {user && (
          <BBImage
            src={avatarSrc}
            alt="User avatar"
            className="w-24 h-24 rounded border border-default object-cover"
            fallback={<AvatarSkeleton />}
          />
        )}

        {!user && <AvatarSkeleton />}

        <BBMutedText className="truncate w-64 overflow-hidden">
          {user?.bioInfo?.personalText}
        </BBMutedText>
        <div>
          (+{user?.bioInfo?.karmaGood}/-{user?.bioInfo?.karmaBad})
        </div>
      </BBFlex>

      <BBFlex direction="col" align="stretch" className="p-3 space-y-2 text-sm">
        <BBMutedText>Posts: {user?.bioInfo?.postCount}</BBMutedText>
        <BBMutedText>
          Joined: <BBDate dateStr={user?.bioInfo?.dateRegistered} />
        </BBMutedText>
        <BBMutedText>Status:</BBMutedText>
      </BBFlex>
    </BBFlex>
  );
};

export default UserLeftPane;
