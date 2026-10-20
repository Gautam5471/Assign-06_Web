const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Something went wrong");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};

export const authApi = {
    login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    register: (userData) => request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
    getMe: () => request("/auth/me"),
    getStudents: (params = "") => request(`/auth/students${params ? `?${params}` : ""}`),
};

export const feeApi = {
    getAll: () => request("/fees"),
    getById: (id) => request(`/fees/${id}`),
    getByCourse: (course) => request(`/fees/course/${encodeURIComponent(course)}`),
    create: (data) => request("/fees", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/fees/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/fees/${id}`, { method: "DELETE" }),
};

export const paymentApi = {
    recordPayment: (data) => request("/payments", { method: "POST", body: JSON.stringify(data) }),
    getDashboard: () => request("/payments/dashboard"),
    getReceipt: (receiptNo) => request(`/payments/receipts/${receiptNo}`),
    getStudentFees: (studentId) => request(`/payments/student/${studentId}`),
    getMyFees: () => request("/payments/my-fees"),
};
