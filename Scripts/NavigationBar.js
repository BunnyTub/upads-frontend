document.addEventListener("DOMContentLoaded", (event) => {
    let overlay = document.getElementById("TopNavigationBar");
    
    window.NavigationBarOverlay = function NavigationBarOverlay(visible) {
        if (visible) {
            overlay.style.transform = "translateY(0px)";
        } else {
            overlay.style.transform = "translateY(-350px)";
        }
    }
    
    window.NavigationBarOverlay(true);

    let pause = ms => new Promise(resolve => setTimeout(resolve, ms));

    let links = document.querySelectorAll("a");
    links.forEach((link) => {
        let href = link.href;
        link.addEventListener("click", async function(event) {
            event.preventDefault();
            window.NavigationBarOverlay(false);
            await pause(650);
            window.location.assign(href);
        })
    });

    window.addEventListener("beforeunload", () => {
        window.NavigationBarOverlay(false);
    });

    window.addEventListener("pageshow", () => {
        let perfEntries = performance.getEntriesByType("navigation");
        
        if (perfEntries[0].type === "back_forward") {
            window.NavigationBarOverlay(false);
            window.LoadingOverlay(true);
            alert("You must use the links and buttons on the page if you want to go somewhere you previously were. Using the browser's back/forward functionality is not supported. You will now be logged out.");
            window.location.replace("/User/Logout");
        }
    });
});