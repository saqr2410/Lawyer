import { API_URL, ACCESS_TOKEN, REFRESH_TOKEN } from "./config.js";



export async function login(username, password){


    const response = await fetch(

        `${API_URL}/accounts/login/`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username: username,

                password: password

            })

        }

    );



    const data = await response.json();



    if(!response.ok){


        throw new Error(
            data.detail || "بيانات الدخول غير صحيحة"
        );


    }



    localStorage.setItem(

        ACCESS_TOKEN,

        data.access

    );



    localStorage.setItem(

        REFRESH_TOKEN,

        data.refresh

    );



    return data;

}







export function logout(){


    localStorage.removeItem(

        ACCESS_TOKEN

    );


    localStorage.removeItem(

        REFRESH_TOKEN

    );



    location.hash = "login";


}