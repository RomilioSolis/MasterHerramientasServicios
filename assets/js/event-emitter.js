// ============================================
// EventEmitter - Sistema centralizado de eventos
// Comunicación decoupled entre componentes
// ============================================

const EventEmitter = (() => {
  
  // --- ESTADO PRIVADO ---
  const _listeners = new Map();
  
  // --- API PÚBLICA ---
  return {
    on(event, callback) {
      if (!event || typeof callback !== 'function') {
        console.warn('EventEmitter.on: event y callback requeridos');
        return () => {};
      }
      
      if (!_listeners.has(event)) {
        _listeners.set(event, new Set());
      }
      
      _listeners.get(event).add(callback);
      
      // Return unsubscribe function
      return () => this.off(event, callback);
    },
    
    off(event, callback) {
      if (!event) return;
      
      if (_listeners.has(event)) {
        _listeners.get(event).delete(callback);
        
        // Cleanup empty sets
        if (_listeners.get(event).size === 0) {
          _listeners.delete(event);
        }
      }
    },
    
    emit(event, data = {}) {
      if (!event) return;
      
      if (_listeners.has(event)) {
        _listeners.get(event).forEach(callback => {
          try {
            callback(data);
          } catch (e) {
            console.error(`EventEmitter error on "${event}":`, e);
          }
        });
      }
    },
    
    once(event, callback) {
      if (!event || typeof callback !== 'function') {
        return () => {};
      }
      
      const wrapper = (data) => {
        callback(data);
        this.off(event, wrapper);
      };
      
      return this.on(event, wrapper);
    },
    
    clear(event) {
      if (event) {
        _listeners.delete(event);
      } else {
        _listeners.clear();
      }
    },
    
    listenerCount(event) {
      if (!event) {
        let total = 0;
        _listeners.forEach(set => total += set.size);
        return total;
      }
      return _listeners.has(event) ? _listeners.get(event).size : 0;
    },
    
    hasListeners(event) {
      return this.listenerCount(event) > 0;
    },
    
    getEvents() {
      return Array.from(_listeners.keys());
    }
  };
  
})();

// ============================================
// LEGACY: Compatibilidad hacia atrás
// ============================================
if (typeof window !== 'undefined') {
  window.EventEmitter = EventEmitter;
  window.EE = EventEmitter; // Alias corto
  console.log('EventEmitter: Sistema de eventos centralizado cargado');
}

// Export
if (typeof module !== 'undefined') {
  module.exports = EventEmitter;
}