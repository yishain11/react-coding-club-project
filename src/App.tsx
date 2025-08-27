import React, { useMemo, useState, type JSX } from "react";
import "./CampusClubDashboard.css";

type Role = "Leader" | "Member" | "Guest";

interface Member {
  id: number;
  name: string;
  role: Role;
  isActive: boolean;
}

interface Task {
  id: number;
  title: string;
  done: boolean;
  assignedTo: number; // member id
}

const seedMembers: Member[] = [
  { id: 1, name: "Alex Rivera", role: "Leader", isActive: true },
  { id: 2, name: "Casey Kim", role: "Member", isActive: true },
  { id: 3, name: "Jordan Lee", role: "Member", isActive: false },
  { id: 4, name: "Sam Cohen", role: "Guest", isActive: true },
  { id: 5, name: "Taylor Brooks", role: "Guest", isActive: false },
];

const seedTasks: Task[] = [
  { id: 101, title: "Set up GitHub org", done: false, assignedTo: 1 },
  { id: 102, title: "Prepare onboarding doc", done: true, assignedTo: 2 },
  { id: 103, title: "Design club logo", done: false, assignedTo: 2 },
  { id: 104, title: "Schedule kickoff meeting", done: false, assignedTo: 1 },
  { id: 105, title: "Create feedback Google Form", done: false, assignedTo: 4 },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

// Narrow role to a lowercase class (safe assertion because Role is a fixed union)
function roleToClass(role: Role): "leader" | "member" | "guest" {
  return role.toLowerCase() as "leader" | "member" | "guest";
}

function Header(): JSX.Element {
  return <h1 className="header">Campus Club Dashboard</h1>;
}

function Footer(): JSX.Element {
  return <footer className="footer">© 2025 Campus Coding Club</footer>;
}

type NoticeProps = {
  kind?: "info" | "warning";
  children: React.ReactNode;
};
function Notice({ kind = "info", children }: NoticeProps): JSX.Element {
  return <div className={`notice ${kind}`}>{children}</div>;
}

type FilterBarProps = {
  showOnlyActive: boolean;
  setShowOnlyActive: (v: boolean) => void;
  layout: "list" | "grid";
  setLayout: (v: "list" | "grid") => void;
  search: string;
  setSearch: (v: string) => void;
};
function FilterBar({
  showOnlyActive,
  setShowOnlyActive,
  layout,
  setLayout,
  search,
  setSearch,
}: FilterBarProps): JSX.Element {
  return (
    <div className="filter-bar">
      <label>
        <input
          type="checkbox"
          checked={showOnlyActive}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setShowOnlyActive(e.target.checked)
          }
        />{" "}
        Show only active members
      </label>

      <div>
        <button
          className={layout === "list" ? "active" : ""}
          onClick={() => setLayout("list")}
          type="button"
        >
          List
        </button>
        <button
          className={layout === "grid" ? "active" : ""}
          onClick={() => setLayout("grid")}
          type="button"
        >
          Grid
        </button>
      </div>

      <input
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        placeholder="Search members by name"
      />
    </div>
  );
}

type MemberCardProps = {
  member: Member;
  selected: boolean;
  onSelect: () => void;
};
function MemberCard({
  member,
  selected,
  onSelect,
}: MemberCardProps): JSX.Element {
  return (
    <div
      className={`member-card ${selected ? "selected" : ""} ${
        !member.isActive ? "inactive" : ""
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className={`avatar ${roleToClass(member.role)}`}>
        {getInitials(member.name)}
      </div>

      <div className="info">
        <div className="name">
          {member.name}{" "}
          <span className={`role ${roleToClass(member.role)}`}>
            {member.role}
          </span>
        </div>
        <div className="status">{member.isActive ? "Active" : "Inactive"}</div>
      </div>

      <button
        className={`role-btn ${roleToClass(member.role)}`}
        disabled={!member.isActive}
        type="button"
      >
        Role
      </button>
    </div>
  );
}

type MembersListProps = {
  members: Member[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  layout: "list" | "grid";
};
function MembersList({
  members,
  selectedId,
  onSelect,
  layout,
}: MembersListProps): JSX.Element {
  if (!members.length) {
    return <div className="empty">No members to show.</div>;
  }
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
}

type TasksPanelProps = {
  tasks: Task[];
  selectedMember: Member | null;
  onToggle: (id: number) => void;
};
function TasksPanel({
  tasks,
  selectedMember,
  onToggle,
}: TasksPanelProps): JSX.Element {
  return (
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
}

export default function CampusClubDashboard(): JSX.Element {
  // noUnusedLocals-safe: we don't need setMembers
  const [members] = useState<Member[]>(seedMembers);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(false);
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState<string>("");

  const selectedMember = useMemo<Member | null>(
    () => members.find((m) => m.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  const visibleMembers = useMemo<Member[]>(() => {
    let out = members;
    if (showOnlyActive) out = out.filter((m) => m.isActive);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((m) => m.name.toLowerCase().includes(q));
    }
    return out;
  }, [members, showOnlyActive, search]);

  const selectedTasks = useMemo<Task[]>(
    () =>
      selectedMember
        ? tasks.filter((t) => t.assignedTo === selectedMember.id)
        : [],
    [tasks, selectedMember]
  );

  const toggleTask = (taskId: number) =>
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
          onSelect={(id) => setSelectedMemberId(id)}
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
