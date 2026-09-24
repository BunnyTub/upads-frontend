document.addEventListener("DOMContentLoaded", (event) => {
    let overlay = document.createElement("div");
    overlay.id = "LoadingOverlay";

    let icon = document.createElement("img");
    icon.id = "LoadingIcon";
    icon.src = "/Images/Rasters/LargeLoadingSpinner.png";

    document.body.append(overlay);
    overlay.appendChild(icon);

    window.LoadingOverlay = function LoadingOverlay(visible) {
        if (visible) {
            overlay.style.pointerEvents = "auto";
            overlay.style.opacity = 0.8;
        } else {
            overlay.style.pointerEvents = "none";
            overlay.style.opacity = 0;
        }
    }
    
    window.LoadingOverlay(false);
});