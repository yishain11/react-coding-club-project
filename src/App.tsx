import { useMemo, useState } from "react";
import "./CampusClubDashboard.css";

const seedMembers = [
  { id: 1, name: "Alex Rivera", role: "Leader", isActive: true },
  { id: 2, name: "Casey Kim", role: "Member", isActive: true },
  { id: 3, name: "Jordan Lee", role: "Member", isActive: false },
  { id: 4, name: "Sam Cohen", role: "Guest", isActive: true },
  { id: 5, name: "Taylor Brooks", role: "Guest", isActive: false },
];

const seedTasks = [
  { id: 101, title: "Set up GitHub org", done: false, assignedTo: 1 },
  { id: 102, title: "Prepare onboarding doc", done: true, assignedTo: 2 },
  { id: 103, title: "Design club logo", done: false, assignedTo: 2 },
  { id: 104, title: "Schedule kickoff meeting", done: false, assignedTo: 1 },
  { id: 105, title: "Create feedback Google Form", done: false, assignedTo: 4 },
];

const Header = () => <h1 className="header">Campus Club Dashboard</h1>;
const Footer = () => (
  <footer className="footer">© 2025 Campus Coding Club</footer>
);

const Notice = ({ kind = "info", children }) => (
  <div className={`notice ${kind}`}>{children}</div>
);

const FilterBar = ({
  showOnlyActive,
  setShowOnlyActive,
  layout,
  setLayout,
  search,
  setSearch,
}) => (
  <div className="filter-bar">
    <label>
      <input
        type="checkbox"
        checked={showOnlyActive}
        onChange={(e) => setShowOnlyActive(e.target.checked)}
      />
      Show only active members
    </label>
    <div>
      <button
        className={layout === "list" ? "active" : ""}
        onClick={() => setLayout("list")}
      >
        List
      </button>
      <button
        className={layout === "grid" ? "active" : ""}
        onClick={() => setLayout("grid")}
      >
        Grid
      </button>
    </div>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search members by name"
    />
  </div>
);

const MemberCard = ({ member, selected, onSelect }) => (
  <div
    className={`member-card ${selected ? "selected" : ""} ${
      !member.isActive ? "inactive" : ""
    }`}
    onClick={onSelect}
  >
    <div className={`avatar ${member.role.toLowerCase()}`}>
      {member.name
        .split(" ")
        .map((p) => p[0])
        .join("")}
    </div>
    <div className="info">
      <div className="name">
        {member.name}{" "}
        <span className={`role ${member.role.toLowerCase()}`}>
          {member.role}
        </span>
      </div>
      <div className="status">{member.isActive ? "Active" : "Inactive"}</div>
    </div>
    <button
      className={`role-btn ${member.role.toLowerCase()}`}
      disabled={!member.isActive}
    >
      Role
    </button>
  </div>
);

const MembersList = ({ members, selectedId, onSelect, layout }) => {
  if (!members.length) return <div className="empty">No members to show.</div>;
  return (
    <div className={`members-list ${layout}`}>
      {members.map((m) => (
        <MemberCard
          key={m.id}
          member={m}
          selected={m.id === selectedId}
          onSelect={() => onSelect(m.id)}
        />
      ))}
    </div>
  );
};

const TasksPanel = ({ tasks, selectedMember, onToggle }) => (
  <div className="tasks-panel">
    <h3>Tasks</h3>
    {!selectedMember ? (
      <p>Select a member to view tasks.</p>
    ) : tasks.length === 0 ? (
      <p>No tasks yet.</p>
    ) : (
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => onToggle(t.id)}
              />
              <span className={t.done ? "done" : ""}>{t.title}</span>
            </label>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default function CampusClubDashboard() {
  const [members, setMembers] = useState(seedMembers);
  const [tasks, setTasks] = useState(seedTasks);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [layout, setLayout] = useState("list");
  const [search, setSearch] = useState("");

  const selectedMember = useMemo(
    () => members.find((m) => m.id === selectedMemberId) || null,
    [members, selectedMemberId]
  );

  const visibleMembers = useMemo(() => {
    let out = members;
    if (showOnlyActive) out = out.filter((m) => m.isActive);
    if (search.trim())
      out = out.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    return out;
  }, [members, showOnlyActive, search]);

  const selectedTasks = useMemo(
    () =>
      !selectedMember
        ? []
        : tasks.filter((t) => t.assignedTo === selectedMember.id),
    [tasks, selectedMember]
  );

  const toggleTask = (taskId) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );

  return (
    <div className="dashboard">
      <Header />
      <FilterBar
        showOnlyActive={showOnlyActive}
        setShowOnlyActive={setShowOnlyActive}
        layout={layout}
        setLayout={setLayout}
        search={search}
        setSearch={setSearch}
      />
      {selectedMember && !selectedMember.isActive && (
        <Notice kind="warning">The selected member is inactive.</Notice>
      )}
      <div className="main">
        <MembersList
          members={visibleMembers}
          selectedId={selectedMemberId}
          onSelect={setSelectedMemberId}
          layout={layout}
        />
        <TasksPanel
          tasks={selectedTasks}
          selectedMember={selectedMember}
          onToggle={toggleTask}
        />
      </div>
      <Footer />
    </div>
  );
}
