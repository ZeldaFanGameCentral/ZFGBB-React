// FIXME: Move the ForumThread component into this file.
const ForumThreadPage: React.FC = () => {
  const { threadId, pageNo } = useParams();
  return (
    <>
      <ForumThread threadId={threadId!} pageNo={pageNo!} />
    </>
  );
};

export default ForumThreadPage;
