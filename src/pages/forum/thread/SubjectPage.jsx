import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useForumOverview } from "../../../queryHooks/threads/useForumOverview";
import ThreadList from "./ThreadList";
import CreateThread from "./CreateThread";

const SubjectPage = () => {
  const { subjectId } = useParams();
  const parsedSubjectId = parseInt(subjectId, 10);
  const [showCreate, setShowCreate] = useState(false);

  // ✅ Använd det nya hooket
  const { data, isLoading, error } = useForumOverview({ page: 1, limit: 10 });

  if (isLoading) return <p>Loading threads...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;
  /*   console.log("data i sub-page", data);
   */ // ✅ Hämta ämnet från datat
  const subject = data?.subjects?.find((s) => s.subject_id === parsedSubjectId);
  if (!subject) return <p>Subject not found</p>;

  return (
    <div style={{ color: "white" }}>
      <div style={{ textAlign: "center" }}>
        <h1>{subject.title}</h1>
        <p>{subject.description}</p>
        <Button
          variant="light"
          style={{ backgroundColor: "black", color: "white" }}
          onClick={() => setShowCreate(true)}
        >
          Create thread
        </Button>
      </div>
      {showCreate && (
        <CreateThread
          defaultSubjectId={parsedSubjectId}
          onClose={() => setShowCreate(false)}
        />
      )}
      {/* ✅ Skicka filtrerade trådar till ThreadList */}
      <ThreadList subjectId={parsedSubjectId} />{" "}
    </div>
  );
};

export default SubjectPage;
