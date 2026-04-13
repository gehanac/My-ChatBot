$(document).ready(function () {
  const $messageInput = $("#messageInput");
  const $sendBtn = $("#sendBtn");
  const $messagesContainer = $("#messagesContainer");
  const $typingIndicator = $("#typingIndicator");
  const $welcomeScreen = $("#welcomeScreen");
  const $sidebar = $("#sidebar");
  const $sidebarOverlay = $("#sidebarOverlay");

  const aiResponses = [
    "Sure! I can help you with that.",
    "That is a great question. Let me explain it simply.",
    "Here is a clear step-by-step explanation for you.",
    "I can guide you through the basics.",
    "Let me break this down in an easy way.",
    "That sounds interesting. Tell me more."
  ];

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function scrollToBottom() {
    const chatMain = document.querySelector(".chat-main");
    chatMain.scrollTop = chatMain.scrollHeight;
  }

  function createMessageHTML(text, sender) {
    const time = getCurrentTime();
    const isUser = sender === "user";
    const senderName = isUser ? "You" : "Assistant";
    const avatarClass = isUser ? "user-avatar" : "ai-avatar";
    const avatarText = isUser ? "You" : "AI";

    return `
      <div class="message ${sender}">
        <div class="avatar ${avatarClass}">${avatarText}</div>
        <div class="message-content">
          <div class="message-header">
            <span>${senderName}</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-text">${text}</div>
        </div>
      </div>
    `;
  }

  function addMessage(text, sender) {
    const messageHTML = createMessageHTML(text, sender);
    $messagesContainer.append(messageHTML);
    scrollToBottom();
  }

  function autoResizeTextarea() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  function toggleSendButton() {
    const text = $messageInput.val().trim();
    $sendBtn.prop("disabled", text === "");
  }

  function showTypingIndicator() {
    $typingIndicator.show();
    scrollToBottom();
  }

  function hideTypingIndicator() {
    $typingIndicator.hide();
  }

  function getRandomResponse() {
    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    return aiResponses[randomIndex];
  }

  function sendMessage() {
    const text = $messageInput.val().trim();

    if (text === "") {
      return;
    }

    if ($welcomeScreen.is(":visible")) {
      $welcomeScreen.hide();
    }

    addMessage(text, "user");
    $messageInput.val("");
    $messageInput.css("height", "24px");
    toggleSendButton();

    showTypingIndicator();

    setTimeout(function () {
      hideTypingIndicator();
      addMessage(getRandomResponse(), "ai");
    }, 1500);
  }

  function startNewChat() {
    $messagesContainer.empty();
    hideTypingIndicator();
    $welcomeScreen.show();
    $messageInput.val("");
    $messageInput.css("height", "24px");
    toggleSendButton();
    $messageInput.focus();
  }

  function openSidebar() {
    $sidebar.addClass("active");
    $sidebarOverlay.addClass("active");
  }

  function closeSidebar() {
    $sidebar.removeClass("active");
    $sidebarOverlay.removeClass("active");
  }

  function exportChat() {
    let chatText = "";

    $(".message").each(function () {
      const sender = $(this).hasClass("user") ? "User" : "Assistant";
      const text = $(this).find(".message-text").text();
      const time = $(this).find(".message-time").first().text();

      chatText += `${sender} (${time}): ${text}\n\n`;
    });

    const blob = new Blob([chatText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chat-history.txt";
    link.click();
  }

  $messageInput.on("input", function () {
    autoResizeTextarea.call(this);
    toggleSendButton();
  });

  $messageInput.on("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  $sendBtn.on("click", function () {
    sendMessage();
  });

  $(".suggestion-card").on("click", function () {
    const suggestionText = $(this).find("p").text();
    $messageInput.val(suggestionText);
    autoResizeTextarea.call($messageInput[0]);
    toggleSendButton();
    $messageInput.focus();
  });

  $(".new-chat-btn").on("click", function () {
    startNewChat();
  });

  $("#menuBtn").on("click", function () {
    openSidebar();
  });

  $sidebarOverlay.on("click", function () {
    closeSidebar();
  });

  window.exportChat = exportChat;
});

function exportChat() {
  let chatText = "";

  $(".message").each(function () {
    const sender = $(this).hasClass("user") ? "User" : "AI";
    const text = $(this).find(".message-text").text();
    const time = $(this).find(".message-time").text();

    chatText += `${sender} (${time}): ${text}\n\n`;
  });

  const blob = new Blob([chatText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat-history.txt";
  link.click();
}