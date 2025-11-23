/* import useNewThreadCount from "../../../queryHooks/threads/useNewThreadCount";
import "../forum-styling.css";

function NewThreadsBadge() {
  const { data: newThreads, isLoading, error } = useNewThreadCount();

  console.log("data", newThreads);

  if (isLoading) return <span>Laddar...</span>;
  if (error) return <span>Fel vid hämtning</span>;

  return (
    <div>
      {newThreads > 0 && (
        <span style={NewBadgeStyle}>Nya trådar: {newThreads}</span>
      )}
    </div>
  );
}
export default NewThreadsBadge;

const NewBadgeStyle = {
  backgroundColor: "red",
  color: "white",
  padding: "2px 6px",
  borderRadius: "6px",
  fontSize: "10px",
  marginLeft: "6px",
};
 */
