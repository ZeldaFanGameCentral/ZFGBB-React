import type { User } from "../../types/user";

interface UserLeftPaneProps {
  user: User;
  backgrounds?: {
    avatarContainer?: ThemeBackgroundClass;
    profileInfoContainer?: ThemeBackgroundClass;
  };
}

const UserLeftPane: React.FC<UserLeftPaneProps> = ({
  user,
  backgrounds = {
    profileInfoContainer: "bg-muted",
    avatarContainer: "bg-muted",
  },
}) => {
  const avatarSrc = useMemo(() => {
    if (user.bioInfo?.avatar) {
      return user.bioInfo?.avatar?.url && user.bioInfo?.avatar?.url?.trim()
        ? user.bioInfo.avatar.url
        : (`${import.meta.env.REACT_ZFGBB_API_URL}/content/image/${user.bioInfo.avatar.contentResourceId}` as `${string}://${string}/${string}`);
    }

    return `${import.meta.env.REACT_ZFGBB_API_URL}/content/image/3` as `${string}://${string}/${string}`;
  }, [user]);

  return (
    <div
      className={`flex-1 flex-col shrink ${backgrounds.avatarContainer} bg-muted h-full`}
    >
      <div
        className={`p-3 ${backgrounds.profileInfoContainer} border-b border-default shrink-0 min-h-[76px] flex items-start`}
      >
        <div className="space-y-0.5 leading-tight font-medium truncate block max-w-[160px]">
          {user.id > 0 ? (
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
            <div className="text-sm text-muted">
              {user?.bioInfo?.customTitle}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-col justify-center shrink-0">
        <BBImage
          src={avatarSrc}
          alt="User avatar"
          className="w-24 h-24 rounded border border-default object-cover"
        />
        <div>{user?.bioInfo?.personalText}</div>
        <div>
          (+{user?.bioInfo?.karmaGood}/-{user?.bioInfo?.karmaBad})
        </div>
      </div>

      <div className="p-3 space-y-2 text-sm flex-1">
        <div className="flex justify-between">
          <BBMutedText>Posts: {user?.bioInfo?.postCount}</BBMutedText>
        </div>
        <div className="flex justify-between">
          <BBMutedText>Joined: {user?.bioInfo?.dateRegistered}</BBMutedText>
        </div>
        <div className="flex justify-between">
          <BBMutedText>Status:</BBMutedText>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default UserLeftPane;
