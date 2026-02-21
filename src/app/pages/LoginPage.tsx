import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginSucceeded } from "../features/auth/authSlice";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from ?? "/app";

  function handleLogin() {
    // doing a fake login for now. will be changed soon
    dispatch(
      loginSucceeded({
        token: "abc",
        user: { id: "A", name: "KP", email: "kp@gmail.com" },
      }),
    );
    navigate(from, { replace: true });
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "80px auto",
        padding: 16,
        border: "1px solid #ddd",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Login</h1>
      <p style={{ opacity: 0.8 }}>
        This is a fake login for Step 1. We’ll wire real API + React Query
        later.
      </p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
