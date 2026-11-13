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

        const response = await fetch(`${recordsURL}/${baseUserInfo.record.id}`, {
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

// document.addEventListener('DOMContentLoaded', () => {
//     window.LoadingOverlay(true);
// });

// document.addEventListener('onload', () => {
//     document.querySelectorAll(".UserDisplayName").forEach((displayNameElement) => {
//         displayNameElement.innerText = GetDisplayName();
//     });

//     window.LoadingOverlay(false);
// });