import { renderNavbar } from "../components/navbar.js";
import { renderSidebar } from "../components/sidebar.js";
import { initRouter } from "./router.js";
import { initDesktopNotifications } from "./desktopNotifications.js";



const app =
document.getElementById("app");



const token =
localStorage.getItem("access");





if(token){



app.innerHTML = `


<div class="layout">


<header id="navbar"></header>


<aside id="sidebar"></aside>


<main id="content"></main>


</div>


`;



renderNavbar();

renderSidebar();



}
else{



app.innerHTML = `


<main id="content"></main>


`;



}





initRouter();





if(token){


    initDesktopNotifications();


}