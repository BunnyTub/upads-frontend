const passwordAuthenticationURL = "https://test.apatheticdell.net/api/collections/upads_forecasters/auth-with-password";
const refreshAuthenticationURL = "https://test.apatheticdell.net/api/collections/upads_forecasters/auth-refresh";

async function DestroyLogonToken() {
    Cookies.remove("LogonToken");
}

async function PrePerformLogon() {
    try {
        const logonToken = Cookies.get("LogonToken");

        if (logonToken) {
            const response = await fetch(refreshAuthenticationURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": logonToken
                },
            });
            
            const result = await response.json();

            if (response.ok) {
                Cookies.set("LogonToken", result.token);

                if (path === "/User/Login") {
                    let statusText = document.getElementById("LoginStatusText");
                    let loginInputs = document.getElementById("LoginDetailsEntry");
                    loginInputs.style.visibility = "none";
                    statusText.innerHTML = "<span style='color: #00dd00'>You are already logged in. <a href='/User/Logout'>Click here to logout.</a></span>";
                }
            } else {
                DestroyLogonToken();
                alert(`You seem to have been logged out... You'll be taken to the login page!`);
                window.NavigationBarOverlay(false);
                window.location.replace("/User/Login");
            }
        } else {
            if (path === "/User/Login") {
                let statusText = document.getElementById("LoginStatusText");
                let loginInputs = document.getElementById("LoginDetailsEntry");
                loginInputs.style.visibility = "visible";
                statusText.innerHTML = "<span style='color: #dddd00'>Please enter your credentials.</span>";
            }
        }
    } catch (error) {
        console.error(error.message);
        if (path === "/User/Login") {
            let statusText = document.getElementById("LoginStatusText");
            let loginInputs = document.getElementById("LoginDetailsEntry");
            loginInputs.style.visibility = "visible";
            statusText.innerHTML = `<span style='color: #dd0000'>${error.message}<br>Please enter your credentials.</span>`;
        } else {
            alert("There was a problem logging you in. Please refresh, then try again.");
        }
    }
}

async function PerformLogin() {
    //window.NavigationBarOverlay(false);
    window.LoadingOverlay(true);

    try {
        let usernameInput = document.getElementById("LoginUsernameInput").value;
        let passwordInput = document.getElementById("LoginPasswordInput").value;
    
        const response = await fetch(passwordAuthenticationURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ identity: usernameInput, password: passwordInput })
        });
        
        const result = await response.json();

        if (response.ok) {
            Cookies.set("LogonToken", result.token);
        } else {
            alert(`${result.message}\r\nYou were not logged in.`);
            window.LoadingOverlay(false);
        }
    } catch (error) {
        console.error(error.message);
        alert("There was a problem logging you in. Please refresh, then try again.");
    }
    // header Authorization:TOKEN

    //window.location.reload();
}

document.addEventListener("DOMContentLoaded", (event) => {
    if (path === "/User/Logout") {
        DestroyLogonToken();
    } else {
        PrePerformLogon();
    }
});

