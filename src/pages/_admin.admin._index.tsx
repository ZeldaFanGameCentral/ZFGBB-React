interface AdminCardProps {
  title: string;
  description: string;
  to: string;
  available?: boolean;
}

function AdminCard({
  title,
  description,
  to,
  available = true,
}: AdminCardProps) {
  return (
    <section className="bg-accented border-2 border-default flex flex-col">
      <h6 className="p-1 font-bold border-b-2 border-default bg-accented">
        {title}
      </h6>
      <div className="p-4 flex flex-col gap-3 grow">
        <p className="text-sm text-dimmed grow">{description}</p>
        {available ? (
          <BBLink to={to} className="text-sm text-highlighted">
            Manage →
          </BBLink>
        ) : (
          <span className="text-sm text-dimmed">Coming soon</span>
        )}
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <BBWidget widgetTitle="Admin Dashboard">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminCard
            title="Migration"
            description="Import data from an existing SMF 2.0.x forum installation."
            to="/system/migrate"
          />
          <AdminCard
            title="User Management"
            description="View, edit, and moderate user accounts."
            to="/admin/users"
            available={false}
          />
          <AdminCard
            title="Board Management"
            description="Create and configure forum categories and boards."
            to="/admin/boards"
            available={false}
          />
        </div>
      </BBWidget>
    </div>
  );
}
