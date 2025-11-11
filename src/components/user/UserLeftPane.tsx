import type { User } from "../../types/user";

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
        : (`${import.meta.env.REACT_ZFGBB_API_URL}/content/image/${user.bioInfo.avatar.contentResourceId}` as `${string}://${string}/${string}`);
    }

    return `${import.meta.env.REACT_ZFGBB_API_URL}/content/image/3` as `${string}://${string}/${string}`;
  }, [user]);

  return (
    <div
      className={`flex flex-1 flex-col shrink ${backgrounds.avatarContainer} h-full`}
    >
      <div
        className={`p-3 ${backgrounds.profileInfoContainer} border-b border-default shrink-0 min-h-[76px] flex items-start`}
      >
        <BBFlex direction="col" className="space-y-0.5 leading-tight font-medium truncate block max-w-[160px]">
          {user && user.id > 0 ? (
            <BBLink
              to={`/user/profile/${user.id}`}
              className="font-medium"
              prefetch="intent"
            >
              {user?.displayName}
            </BBLink>
          ) : (
            <span className="font-medium">{user?.displayName}</span>
          )}
          {user?.bioInfo?.customTitle && (
            <BBMutedText>{user?.bioInfo?.customTitle}</BBMutedText>
          )}
        </BBFlex>
        <div className="ms-3 inline-block lg:hidden">
          {user && (
          <BBImage
            src={avatarSrc}
            alt="User avatar"
            className="w-24 h-24 border border-default object-cover rounded-full size-12"
            fallback={<AvatarSkeleton />}
          />
          )}
        </div>
      </div>

      <BBFlex direction="col" justify="center" align="center" className="hidden lg:flex p-4">
        {user && (
          <BBImage
            src={avatarSrc}
            alt="User avatar"
            className="w-24 h-24 rounded border border-default object-cover"
            fallback={<AvatarSkeleton />}
          />
        )}

        {!user && <AvatarSkeleton />}

        <BBMutedText>{user?.bioInfo?.personalText}</BBMutedText>
        <div>
          (+{user?.bioInfo?.karmaGood}/-{user?.bioInfo?.karmaBad})
        </div>
      </BBFlex>

      <div className="p-3 space-y-2 text-sm flex-1">
        <BBFlex justify="between">
          <BBMutedText>Posts: {user?.bioInfo?.postCount}</BBMutedText>
        </BBFlex>
        <BBFlex justify="between">
          <BBMutedText>Joined: {user?.bioInfo?.dateRegistered}</BBMutedText>
        </BBFlex>
        <BBFlex justify="between">
          <BBMutedText>Status:</BBMutedText>
          <span></span>
        </BBFlex>
      </div>
    </div>
  );
};

export default UserLeftPane;
