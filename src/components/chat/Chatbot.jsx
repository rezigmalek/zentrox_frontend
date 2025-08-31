import { useEffect } from "react";

function Chatbot() {
  useEffect(() => {
    // Initialisation de Chatbase si ce n'est pas déjà fait
    if (
      !window.chatbase ||
      window.chatbase("getState") !== "initialized"
    ) {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) window.chatbase.q = [];
        window.chatbase.q.push(args);
      };

      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") return target.q;
          return (...args) => target(prop, ...args);
        },
      });
    }

    // Fonction qui insère le script
    const onLoad = () => {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "WVfbFfkKSFygK-FIXhZu0"; // Remplace par ton vrai ID si différent
      script.theme = "dark"; // force dark mode
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return null; // No UI needed, the chatbot widget injects itself
}

export default Chatbot;
