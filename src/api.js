// Central API base URL — reads from env at build time
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE;
