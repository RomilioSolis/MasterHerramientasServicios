document.addEventListener("DOMContentLoaded", function () {
    const whatsappButton = document.createElement("div");
    whatsappButton.innerHTML = `
        <div id="whatsapp-float">
            <a href="https://wa.me/573165345675" target="_blank" aria-label="Chatear por WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
        </div>
    `;
    document.body.appendChild(whatsappButton);
});
