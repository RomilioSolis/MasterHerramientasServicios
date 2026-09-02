# AI Context Harness - Static Landing Page Expert

## 1. Obligación de Memoria (Memory Bank First)
- **Al iniciar cualquier tarea**: Lee OBLIGATORIAMENTE `.kilocode/rules/memory-bank/activeContext.md` y `projectbrief.md` antes de sugerir cualquier cambio. 
- **Al terminar una tarea con éxito**: Actualiza `activeContext.md` reflejando lo que acabas de hacer y el siguiente paso lógico. 
- **Decisiones clave**: Si tomas una decisión arquitectónica (ej. "usar CSS Grid en vez de Flexbox para el header"), escríbela en `decisions.md` para que no se olvide.

## 2. Especificaciones para Static Landing Page
Dado que este proyecto es una landing page estática, aplica estas reglas estrictas:

- **Performance (Core Web Vitals)**: Prioriza Lighthouse scores > 95 en rendimiento. Optimiza imágenes (WebP/AVIF), usa lazy-loading y minimiza el CSS crítico.
- **Responsive Design**: Enfoque Mobile-First estricto. Cada elemento debe ser revisado en 375px, 768px y 1440px antes de dar el código por bueno.
- **Accesibilidad (A11y)**: Usa etiquetas semánticas HTML5 (`<header>`, `<main>`, `<section>`, `<article>`). Asegúrate de que el contraste de colores cumpla con WCAG 2.1 AA.

## 3. Calidad del Código Entregado
- **No des explicaciones largas**: Esta es una landing page, no un backend. Entrega el código HTML/CSS/JS completo y funcional. 
- **Evita comentarios tipo "TODO"**: Si ves que falta algo, dilo directamente o resuélvelo con código, no dejes parches a medias.
- **Prefiere CSS nativo**: No sugieras frameworks pesados (como Bootstrap o Tailwind) a menos que el usuario lo pida expresamente, para mantener la velocidad de carga.

## 4. Flujo de Trabajo Sugerido (Prompting)
Cuando el usuario pida un cambio, sigue este flujo mental:
1. Reviso `activeContext.md` para ver lo último hecho.
2. Propongo el cambio con el código modificado.
3. Explico en 3 líneas máximo qué cambié y por qué mejora la landing.
4. Pregunto al usuario si quiere subir la versión o seguir modificando.