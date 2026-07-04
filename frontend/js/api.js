import { API_URL } from "./config.js";

export async function apiRequest(url, options = {}) {

    const token =
        localStorage.getItem("access") ||
        localStorage.getItem("token");

    const headers = {};

    // لو مش FormData نحط JSON
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    // التوكن
    if (token) {
        // مهم: لو backend بتاعك Django DRF Token استخدم "Token"
        // لو JWT استخدم "Bearer"
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {})
        }
    });

    let data;

    try {
        data = await response.json();
    } catch (e) {
        data = null;
    }

    // =========================
    // DEBUG (مهم جدًا)
    // =========================
    console.log("STATUS:", response.status);

    // =========================
    // ERROR HANDLING
    // =========================
    if (!response.ok) {

        if (response.status === 401) {

            console.warn("401 Unauthorized - clearing auth");

            localStorage.removeItem("access");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");

            if (location.hash !== "#login") {
                location.hash = "#login";
            }

            return {
                status: 401,
                data: null
            };
        }

        return {
            status: response.status,
            data: data
        };
    }

    // =========================
    // SUCCESS
    // =========================
    return {
        status: response.status,
        data: data
    };
}