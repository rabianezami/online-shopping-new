// modules/chatbot.js
export class Chatbot {
  constructor(containerId, products = []) {
    this.container = document.getElementById(containerId);
    this.products = products;

    this.messages = JSON.parse(localStorage.getItem("chatbotHistory")) || [
      { sender: "bot", text: "Hi! I can help you find products. Ask me anything." }
    ];

    this.open = false;
    this.render();
  }

  render() {
    this.container.innerHTML = "";

    // دکمه باز کردن چت بات
    if (!this.open) {
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "chatbot-toggle";
      toggleBtn.innerHTML = '<i class="bi bi-chat-dots-fill"></i>'; // آیکون چت
      toggleBtn.onclick = () => { this.open = true; this.render(); };
      this.container.appendChild(toggleBtn);
      return;
    }

    const panel = document.createElement("div");
    panel.className = "chatbot-panel";

    // Header
    const header = document.createElement("div");
    header.className = "chatbot-header d-flex justify-content-between align-items-center";
    header.innerHTML = `<span>Online Support</span>`;
    const closeBtn = document.createElement("button");
    closeBtn.className = "chatbot-close-btn";
    closeBtn.innerHTML = '<i class="bi bi-x-lg"></i>'; // آیکون بستن
    closeBtn.onclick = () => { this.open = false; this.render(); };
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Messages
    const messagesDiv = document.createElement("div");
    messagesDiv.className = "chatbot-messages mb-2";
    messagesDiv.style.maxHeight = "300px";
    messagesDiv.style.overflowY = "auto";

    this.messages.forEach(m => {
      const msgDiv = document.createElement("div");
      msgDiv.className = `mb-2 ${m.sender === "user" ? "text-end" : "text-start"}`;

      const bubble = document.createElement("div");
      bubble.className = `d-inline-block p-2 rounded ${m.sender === "user" ? "bg-primary text-white" : "bg-light"}`;
      if (m.isHTML) bubble.innerHTML = m.text;
      else bubble.textContent = m.text;

      msgDiv.appendChild(bubble);
      messagesDiv.appendChild(msgDiv);
    });
    panel.appendChild(messagesDiv);

    // Input
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.className = "form-control";
    textarea.placeholder = "Ask something like: 'Suggest women's products'";
    textarea.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage(textarea.value);
      }
    };

    const sendBtn = document.createElement("button");
    sendBtn.className = "btn btn-primary";
    sendBtn.textContent = "Send";
    sendBtn.onclick = () => this.sendMessage(textarea.value);

    inputGroup.appendChild(textarea);
    inputGroup.appendChild(sendBtn);
    panel.appendChild(inputGroup);

    this.container.appendChild(panel);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async sendMessage(text) {
    text = text.trim();
    if (!text) return;

    this.messages.push({ sender: "user", text });
    this.saveMessages();
    this.render();

    const productSummary = this.products.length
      ? `Available products: ${this.products.slice(0, 8).map(p => `${p.title} (${p.category})`).join("; ")}`
      : "";

    const systemPrompt = `
You are a helpful assistant for an online shopping site.
Give short helpful answers in English.
Prefer to suggest relevant products from the provided list if possible.
`;

    const messagesForApi = [
      { role: "system", content: systemPrompt },
      ...(productSummary ? [{ role: "system", content: productSummary }] : []),
      { role: "user", content: text }
    ];

    try {
      const resp = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesForApi })
      });

      if (!resp.ok) throw new Error("Failed to fetch");

      const data = await resp.json();
      let reply = data.choices?.[0]?.message?.content?.trim() || "I have no answer.";

      if (reply.toLowerCase().includes("suggest")) {
        let htmlContent = `<div>${reply}</div><div class='d-flex flex-wrap mt-2'>`;
        this.products.slice(0, 4).forEach(p => {
          htmlContent += `
            <div class="card m-1" style="width:100px;">
              <img src="${p.image}" class="card-img-top" alt="${p.title}" />
              <div class="card-body p-1">
                <p class="small mb-1">${p.title}</p>
                <p class="small mb-1">$${p.price}</p>
                <a href="${p.href || '#'}" class="small btn btn-sm btn-primary w-100">View</a>
              </div>
            </div>`;
        });
        htmlContent += `</div>`;
        this.messages.push({ sender: "bot", text: htmlContent, isHTML: true });
      } else {
        this.messages.push({ sender: "bot", text: reply });
      }

    } catch (err) {
      console.error("Chat error:", err);
      this.messages.push({ sender: "bot", text: "Error connecting to AI service." });
    }

    this.saveMessages();
    this.render();
  }

  saveMessages() {
    localStorage.setItem("chatbotHistory", JSON.stringify(this.messages));
  }
}
