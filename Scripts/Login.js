window.BaseUserInfo = null;
const hostingURL = "https://zuni.apatheticdell.net";
const passwordAuthenticationURL = `${hostingURL}/api/collections/upads_forecasters/auth-with-password`;
const refreshAuthenticationURL = `${hostingURL}/api/collections/upads_forecasters/auth-refresh`;
const forecastersRecordsURL = `${hostingURL}/api/collections/upads_forecasters/records`;
const officesRecordsURL = `${hostingURL}/api/collections/upads_offices/records`;

function DestroyLogonToken() {
    const logonToken = Cookies.get("LogonToken");

    if (logonToken) {
        Cookies.remove("LogonToken");
        window.location.reload();
    }
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
                window.BaseUserInfo = result;

                if (path === "/User/Login") {
                    let statusText = document.getElementById("LoginStatusText");
                    let loginInputs = document.getElementById("LoginDetailsEntry");
                    loginInputs.style.visibility = "none";
                    statusText.innerHTML = "<span style='color: #00dd00'>You are already logged in.</span><a href='/User/Home'>Click here to go home.</a><a href='/User/Logout'>Click here to logout.</a>";
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
                statusText.innerHTML = "<span style=\"color: #5663d3ff\">The dashboard is awaiting! <a style=\"zoom: 60%;\" href=\"#\" onclick=\"alert('If you forgot your username or password, please contact the ActiWeather administrators for help with resetting your information. If the system is failing to log you in, please contact the ActiWeather developers.');\">Having trouble logging in?</a></span>";
            } else {
                if (path === "/User/Logout") return;
                if (path === "/User/Restricted") return;

                if (path.startsWith("/User/")) {
                    window.LoadingOverlay(true);
                    alert("You seem to be lost... You'll be taken to the login page!");
                    window.NavigationBarOverlay(false);
                    window.location.replace("/User/Login");
                }
            }
        }
    } catch (error) {
        console.error(error.message);
        if (path === "/User/Login") {
            let statusText = document.getElementById("LoginStatusText");
            let loginInputs = document.getElementById("LoginDetailsEntry");
            loginInputs.style.visibility = "visible";
            statusText.innerHTML = `<span style='color: rgb(255, 100, 0)'>${error.message}<br>Please enter your credentials again.</span>`;
        } else {
            alert("There was a problem with your session. It may have expired since the last time you've used it. Please refresh, then try again.");
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
            window.BaseUserInfo = result;
            window.location.assign("/User/Home");
        } else {
            if (response.status === 403) {
                window.location.replace("/User/Restricted");
                return;
            }

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

document.addEventListener("DOMContentLoaded", async () => {
    if (path === "/User/Logout") {
        DestroyLogonToken();
    } else {
        await PrePerformLogon();
        
        if (window.BaseUserInfo == null) return;

        document.querySelectorAll(".UserDisplayName").forEach((displayNameElement) => {
            displayNameElement.innerText = window.BaseUserInfo.record.name;
        });

        let offices = "";
        // const fixedOfficeHTML = "<p class=\"HorizontallyLeftText\"></p>";

        window.BaseUserInfo.record.office.forEach(async (officeId) => {
            try {
                const response = await fetch(`${officesRecordsURL}/${officeId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                const result = await response.json();

                if (response.ok) {
                    offices = offices.concat(" ", `${result.name}`);
                } else {
                    alert("There was a problem getting offices.");
                    return;
                }
            } catch (error) {
                alert("There was a problem getting offices.");
                return;
            }
           
            document.querySelectorAll(".UserOfficeList").forEach((officeListElement) => {
                officeListElement.innerText = offices;
            });
        });
    }
});

