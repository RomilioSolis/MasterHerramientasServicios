import ChatWidget from '/assets/js/chat-widget.js';

const ChatWidgetLoader = {
    init() {
        let retries = 0;
        const maxRetries = 10;
        
        const checkAndInit = () => {
            const fab = document.getElementById('cw-fab');
            
            // Si fab no existe, reintentar hasta 10 veces (1 segundo total)
            if (!fab && retries < maxRetries) {
                retries++;
                setTimeout(checkAndInit, 100);
                return;
            }
            
            // Ahora fab debería existir
            if (fab && !window.chatWidgetInitialized) {
                window.chatWidgetInitialized = true;
                ChatWidget.init();
                console.log('ChatWidget loaded via component');
            }
        };

        // Ejecutar inmediatamente
        checkAndInit();
    }
};

export default ChatWidgetLoader;