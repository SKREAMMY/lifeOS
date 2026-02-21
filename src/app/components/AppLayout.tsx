import { logout } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
      }}
    >
      <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700 }}>LifeOS</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{user?.email}</div>
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          <Link to="/app">Dashboard</Link>
          <Link to="/app/tasks">Tasks</Link>
          <Link to="/app/habits">Habits</Link>
          <Link to="/app/expenses">Expenses</Link>
          <Link to="/app/notes">Notes</Link>
          <Link to="/app/settings">Settings</Link>
        </nav>

        <button style={{ marginTop: 16 }} onClick={() => dispatch(logout())}>
          Logout
        </button>
      </aside>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
