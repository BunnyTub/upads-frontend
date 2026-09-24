function EnforceRestriction() {
    if (path === "/User/Restricted") return;

    if (localStorage.getItem("PreviouslyLoggedInAccountRestricted") == "true") {
        if (path === "/User/Login") window.location.replace("/User/Restricted");
    }
}

EnforceRestriction();