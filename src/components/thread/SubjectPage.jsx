import { useParams } from "react-router-dom";
import useThreads from "../../queryHooks/threads/useThreads";
import useGetSubjects from "../../queryHooks/subjects/useGetSubjects";
import CreateThread from "./CreateThread";
import ThreadList from "./ThreadList";

const SubjectPage = () => {
  const { id } = useParams(); // subject ID
  const subjectId = parseInt(id, 10);
  const { data: subjects } = useGetSubjects();
  const subject = subjects?.find((s) => s.id === subjectId);

  const { data, isLoading, error } = useThreads(1, 10, "desc", subjectId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="subject-page">
      <h1>{subject?.name || "Subject"}</h1>{" "}
      <h3 className="mt-4">Threads in {subject?.name}:</h3>
      <ThreadList subjectId={subjectId} />{" "}
      <CreateThread defaultSubjectId={subjectId} />
    </div>
  );
};

export default SubjectPage;
