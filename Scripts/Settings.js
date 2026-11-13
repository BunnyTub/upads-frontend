function GetDisplayName() {
    let displayName = window.BaseUserInfo.record.name;

    if (displayName == null || displayName == "") {
        displayName = "---";
    }

    return displayName;
}

async function ChangeDisplayName() {
    //window.NavigationBarOverlay(false);
    try {
        let newDisplayName = prompt("Enter a new display name.");

        if (newDisplayName == null || newDisplayName == "") {
            alert("Your display name will remain unchanged.");
            return;
        }
    
        window.LoadingOverlay(true);

        const response = await fetch(`${forecastersRecordsURL}/${window.BaseUserInfo.record.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newDisplayName })
        });
        
        const result = await response.json();

        if (response.ok) {
            alert("Your display name has been changed.");
            window.location.reload();
        } else {
            alert(`${result.message}\r\nThere was a problem setting your display name.`);
        }
    } catch (error) {
        console.error(error.message);
        alert("There was a problem setting your display name.");
    }
    // header Authorization:TOKEN

    window.LoadingOverlay(false);
}

async function RestrictMyAccount() {
    //window.NavigationBarOverlay(false);
    try {
        let newDisplayName = prompt("You will LOSE ACCESS to your account.\nPlease confirm by typing \"GOODBYE\".");

        if (newDisplayName == null || newDisplayName == "" || newDisplayName !== "GOODBYE") {
            alert("Your account was not restricted.");
            return;
        }
    
        window.LoadingOverlay(true);

        const response = await fetch(`${forecastersRecordsURL}/${window.BaseUserInfo.record.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ restricted: true })
        });
        
        const result = await response.json();

        if (response.ok) {
            window.location.replace("/User/Logout");
        } else {
            alert(`${result.message}\r\nThere was a problem restricting your account.`);
        }
    } catch (error) {
        console.error(error.message);
        alert("There was a problem restricting your account.");
    }

    window.LoadingOverlay(false);
}

// document.addEventListener('DOMContentLoaded', () => {
//     window.LoadingOverlay(true);
// });

// document.addEventListener('onload', () => {
//     document.querySelectorAll(".UserDisplayName").forEach((displayNameElement) => {
//         displayNameElement.innerText = GetDisplayName();
//     });

//     window.LoadingOverlay(false);
// });