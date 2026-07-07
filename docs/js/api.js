import { API_URL } from "./config.js";


export async function apiRequest(url, options = {}) {

    const token =
        localStorage.getItem("access") ||
        localStorage.getItem("token");


    const headers = {
        ...(options.headers || {})
    };


    // JSON فقط لو مش FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }


    // JWT
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }


    console.log("====== API REQUEST ======");
    console.log("URL:", `${API_URL}${url}`);
    console.log("TOKEN:", token ? "FOUND" : "NOT FOUND");
    console.log("HEADERS:", headers);


    let response;

    try {

        response = await fetch(
            `${API_URL}${url}`,
            {
                ...options,
                headers
            }
        );

    } catch (error) {

        console.error("NETWORK ERROR:", error);

        return {
            status: 0,
            data: null,
            error: "Network Error"
        };
    }



    let data = null;


    try {

        data = await response.json();

    } catch (e) {

        data = null;

    }



    console.log("STATUS:", response.status);
    console.log("RESPONSE:", data);



    // Unauthorized
    if (response.status === 401) {

        console.warn(
            "401 Unauthorized"
        );


        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("token");


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