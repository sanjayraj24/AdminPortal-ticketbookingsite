const API_BASE_URL = "http://localhost:3000";
const ADMIN_PATH = "/admin";

export const authenticateAdmin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}${ADMIN_PATH}`);
  if (!response.ok) {
    throw new Error("Unable to connect to authentication API.");
  }

  const admin = await response.json();

  if (!admin || admin.username !== username || admin.password !== password) {
    throw new Error("Invalid admin username or password.");
  }

  return {
    username: admin.username,
    role: "admin",
    email: admin.email || "admin@example.com",
  };
};
