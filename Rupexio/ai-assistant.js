document.addEventListener("DOMContentLoaded", () => {

  const aiFab = document.getElementById("aiFab");
  const aiPanel = document.getElementById("aiPanel");
  const closeAi = document.getElementById("closeAi");
  const aiInput = document.getElementById("aiInput");
  const aiSend = document.getElementById("aiSend");
  const aiMessages = document.getElementById("aiMessages");

  aiFab.onclick = () => aiPanel.style.display = "flex";
  closeAi.onclick = () => aiPanel.style.display = "none";

  aiSend.onclick = handleUserMessage;
  aiInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleUserMessage();
  });

  function handleUserMessage() {
    const message = aiInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    aiInput.value = "";

    setTimeout(() => {
      const reply = generateAIResponse(message.toLowerCase());
      addMessage(reply, "ai");
    }, 500);
  }

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "ai-msg " + type;
    div.innerText = text;
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateAIResponse(message) {

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income + expense;

    // ---------------- GREETINGS ----------------
    if (message.includes("hi") || message.includes("hello") || message.includes("hey")) {
      return random([
        "Hey Dinu 👋 I'm here to manage your money like a pro!",
        "Hello boss 😎 Ready to optimize your finances?",
        "Hi there! 💰 Let's build wealth today!",
        "Hey! Ask me anything about your money 🔥"
      ]);
    }

    // ---------------- ADD EXPENSE ----------------
    if (message.includes("add") || message.includes("expense")) {

      const amountMatch = message.match(/\d+/);
      if (amountMatch) {

        const amount = parseInt(amountMatch[0]);
        let category = "Other";

        if (message.includes("food")) category = "Food";
        if (message.includes("transport")) category = "Transport";
        if (message.includes("shop")) category = "Shopping";

        const newTransaction = {
          title: category,
          amount: -amount,
          date: new Date().toISOString().split("T")[0]
        };

        transactions.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        return random([
          `✅ Done! ₹${amount} added to ${category}.`,
          `📌 Expense recorded: ₹${amount} for ${category}.`,
          `🧾 Added ₹${amount} under ${category}. Budget updated.`
        ]);
      }
    }

    // ---------------- ADD INCOME ----------------
    if (message.includes("income") || message.includes("salary")) {

      const amountMatch = message.match(/\d+/);
      if (amountMatch) {

        const amount = parseInt(amountMatch[0]);

        transactions.push({
          title: "Income",
          amount: amount,
          date: new Date().toISOString().split("T")[0]
        });

        localStorage.setItem("transactions", JSON.stringify(transactions));

        return random([
          `💰 Nice! ₹${amount} income added.`,
          `🚀 Income updated with ₹${amount}.`,
          `🔥 ₹${amount} credited successfully!`
        ]);
      }
    }

    // ---------------- BUDGET STATUS ----------------
    if (message.includes("budget") || message.includes("status") || message.includes("balance")) {

      if (balance < 0) {
        return random([
          `⚠ You're overspending by ₹${Math.abs(balance)}.`,
          `😬 Careful! You're in negative balance ₹${Math.abs(balance)}.`,
          `Alert 🚨 Expenses exceed income by ₹${Math.abs(balance)}.`
        ]);
      }

      const savingsRate = income > 0
        ? Math.round((balance / income) * 100)
        : 0;

      return random([
        `📊 You're saving ${savingsRate}% of income. Good progress!`,
        `Balance is ₹${balance}. Savings rate: ${savingsRate}%.`,
        `Healthy finances 💚 Savings at ${savingsRate}%.`
      ]);
    }

    // ---------------- SAVING ADVICE ----------------
    if (message.includes("save") || message.includes("saving")) {

      if (balance < 0) {
        return "Start by cutting food delivery & impulse shopping first 🍔🛍️";
      }

      return random([
        "Try the 50/30/20 rule 💡",
        "Automate savings monthly 🔁",
        "Invest surplus funds for growth 📈"
      ]);
    }

    // ---------------- TOP CATEGORY ----------------
    if (message.includes("top") || message.includes("highest")) {

      const totals = {};

      transactions
        .filter(t => t.amount < 0)
        .forEach(t => {
          totals[t.title] = (totals[t.title] || 0) + Math.abs(t.amount);
        });

      let topCategory = "";
      let max = 0;

      for (let cat in totals) {
        if (totals[cat] > max) {
          max = totals[cat];
          topCategory = cat;
        }
      }

      if (!topCategory) return "No spending data yet.";

      return `Your biggest expense is ${topCategory} (₹${max}) 💸`;
    }

    // ---------------- MONTH COMPARISON ----------------
    if (message.includes("compare") || message.includes("last month")) {

      const currentMonth = new Date().getMonth();
      const previousMonth = currentMonth - 1;

      const thisMonthExpense = transactions
        .filter(t => t.amount < 0 && new Date(t.date).getMonth() === currentMonth)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const lastMonthExpense = transactions
        .filter(t => t.amount < 0 && new Date(t.date).getMonth() === previousMonth)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      if (thisMonthExpense > lastMonthExpense) {
        return `📈 Spending increased by ₹${thisMonthExpense - lastMonthExpense}.`;
      } else {
        return `📉 Good job! You reduced spending by ₹${lastMonthExpense - thisMonthExpense}.`;
      }
    }

    // ---------------- HALF MESSAGE UNDERSTANDING ----------------
    if (message.includes("400 food") || message.includes("food 400")) {
      return "Do you want me to add ₹400 to Food expense? 🤔";
    }

    if (message.length < 4) {
      return "Can you tell me a bit more? 😊";
    }

    // ---------------- DEFAULT INTELLIGENT RESPONSE ----------------
    if (balance < 0) {
      return "You're currently spending more than you earn. Let's tighten expenses 🔒";
    }

    return random([
      "Ask me about savings, expenses, or budget analysis 💰",
      "I'm ready to analyze your finances 🔍",
      "Tell me what you'd like to know!"
    ]);
  }

});
