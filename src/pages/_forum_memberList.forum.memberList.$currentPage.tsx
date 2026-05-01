import type { BBTableColumn } from "@/components/common/layout/BBTable";
import type { User } from "../types/user";
import type { Route } from "./+types/_forum_memberList.forum.memberList.$currentPage";
import { getQueryClient } from "@/providers/query/queryProvider";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<User[]>(`/user/memberList?pageNo=${params.currentPage}`),
  );
}

const MemberListContainer: React.FC = () => {
  const navigate = useNavigate();
  const { currentPage } = useParams();
  const { data: memberList, isLoading } = useBBQuery<User[]>(
    `/user/memberList?pageNo=${currentPage}`,
  );

  const loadNewPage = (pageNo: number) => {
    navigate(`/forum/member-list/${pageNo}`);
  };

  const columns: BBTableColumn<User>[] = [
    {
      key: "avatar",
      label: "",
      className: "shrink-0 w-8",
      render: () => <div className="w-8 h-8 bg-muted rounded-full"></div>,
    },
    {
      key: "status",
      label: "",
      className: "shrink-0 w-8",
      render: () => <div className="w-2 h-2 bg-green-500 rounded-full"></div>,
    },
    {
      key: "username",
      label: "Username",
      className: "grow",
      render: (_, user: User) => (
        <div className="flex flex-col">
          <span className="font-medium">{user.displayName}</span>
          <div className="md:hidden text-sm text-muted mt-1">
            <div>Email: email@example.com</div>
            <div>Joined: Jan 2024</div>
            <div>Last seen: Yesterday</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      className: "min-w-32",
      hideOnMobile: true,
      render: () => <span className="text-muted">email@example.com</span>,
    },
    {
      key: "joined",
      label: "Joined",
      className: "min-w-24",
      hideOnMobile: true,
      hideOnTablet: true,
      render: () => <span className="text-muted">Jan 2024</span>,
    },
    {
      key: "lastSeen",
      label: "Last Seen",
      className: "min-w-24",
      hideOnMobile: true,
      hideOnTablet: true,
      render: () => <span className="text-muted">Yesterday</span>,
    },
  ];

  return (
    <BBWidget widgetTitle="Member List">
      <BBTable
        columns={columns}
        data={memberList || []}
        emptyMessage="Sure looks like a ghost town hahahahaha! 👻"
        rowOuterFlexOptions={{ gap: "gap-4" }}
      />

      {memberList && !isLoading && (
        <div className="bg-accented p-4 scrollbar-thin">
          <BBPaginator
            numPages={Math.ceil(memberList.length / 10)}
            currentPage={Number(currentPage)}
            onPageChange={loadNewPage}
          />
        </div>
      )}
    </BBWidget>
  );
};

export default MemberListContainer;
