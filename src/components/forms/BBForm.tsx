export default function BBForm({ children }: { children: React.ReactNode }) {
  return (
    <form className="form-horizontal" role="form">
      {children}
    </form>
  );
}
