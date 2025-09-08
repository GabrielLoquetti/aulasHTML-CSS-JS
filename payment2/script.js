document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal")
  const paymentModal = document.getElementById("paymentModal")
  const btnEntrarConta = document.getElementById("btnEntrarConta")
  const btnLogout = document.getElementById("btnLogout")
  const userInfo = document.getElementById("user-info")
  const userName = document.getElementById("user-name")

  let currentUser = null

  // Check if user is logged in on page load
  checkUserSession()

  // Event Listeners
  btnEntrarConta.addEventListener("click", async () => {
    try {
      const resposta = await fetch("http://localhost:3000/usuario-logado", {
        method: "GET",
        credentials: "include",
      })

      if (resposta.ok) {
        const userData = await resposta.json()
        currentUser = userData
        updateUI()
      } else {
        showModal(loginModal)
      }
    } catch (err) {
      console.error("Erro ao verificar sessão:", err)
      showModal(loginModal)
    }
  })

  btnLogout.addEventListener("click", async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      })
      currentUser = null
      updateUI()
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  })

  // Login Form Handler
  document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault()
    const mensagem = document.getElementById("login-mensagem")

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    try {
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, senha: password }),
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        mensagem.textContent = dados.sucesso || "Login realizado com sucesso!"
        mensagem.style.color = "green"
        currentUser = dados.usuario || { nome: "Usuário" }
        setTimeout(() => {
          hideModal(loginModal)
          updateUI()
        }, 1000)
      } else {
        mensagem.textContent = dados.erro || "Erro ao fazer login"
        mensagem.style.color = "red"
      }
    } catch (erro) {
      mensagem.textContent = "Erro ao conectar com servidor"
      mensagem.style.color = "red"
    }
  })

  // Register Form Handler
  document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
    e.preventDefault()
    const mensagem = document.getElementById("register-mensagem")

    const nome = document.getElementById("first-name").value
    const sobrenome = document.getElementById("last-name").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("password").value
    const confirmSenha = document.getElementById("confirm-password").value

    try {
      const response = await fetch("http://localhost:3000/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, sobrenome, email, senha, confirmSenha }),
      })

      const result = await response.json()

      if (response.ok) {
        mensagem.textContent = "Cadastro realizado com sucesso!"
        mensagem.style.color = "green"
        setTimeout(() => {
          showLoginForm()
          mensagem.textContent = ""
        }, 1500)
      } else {
        mensagem.textContent = result.message || "Erro ao cadastrar"
        mensagem.style.color = "red"
      }
    } catch (erro) {
      mensagem.textContent = "Erro ao conectar com servidor"
      mensagem.style.color = "red"
    }
  })

  // Buy buttons
  document.querySelectorAll(".btn-buy").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!currentUser) {
        alert("Você precisa estar logado para comprar!")
        showModal(loginModal)
        return
      }

      const product = e.target.dataset.product
      const price = e.target.dataset.price

      document.getElementById("payment-product").textContent = product
      document.getElementById("payment-price").textContent = Number.parseFloat(price).toFixed(2).replace(".", ",")

      showModal(paymentModal)
    })
  })

  // Payment form
  document.getElementById("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault()

    // Simulate payment processing
    alert("Processando pagamento...")

    setTimeout(() => {
      alert("Pagamento realizado com sucesso!")
      hideModal(paymentModal)
      document.getElementById("paymentForm").reset()
    }, 2000)
  })

  // Form switching
  document.getElementById("showRegister").addEventListener("click", (e) => {
    e.preventDefault()
    showRegisterForm()
  })

  document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault()
    showLoginForm()
  })

  // Modal close buttons
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal")
      hideModal(modal)
    })
  })

  // Close modal when clicking outside
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideModal(modal)
      }
    })
  })

  // Card formatting
  setupCardFormatting()

  // Helper Functions
  async function checkUserSession() {
    try {
      const resposta = await fetch("http://localhost:3000/usuario-logado", {
        method: "GET",
        credentials: "include",
      })

      if (resposta.ok) {
        const userData = await resposta.json()
        currentUser = userData
        updateUI()
      }
    } catch (err) {
      console.log("Usuário não logado")
    }
  }

  function updateUI() {
    if (currentUser) {
      btnEntrarConta.style.display = "none"
      btnLogout.style.display = "block"
      userInfo.style.display = "block"
      userName.textContent = currentUser.nome || currentUser.name || "Usuário"
    } else {
      btnEntrarConta.style.display = "block"
      btnLogout.style.display = "none"
      userInfo.style.display = "none"
    }
  }

  function showModal(modal) {
    modal.style.display = "block"
  }

  function hideModal(modal) {
    modal.style.display = "none"
  }

  function showLoginForm() {
    document.getElementById("loginForm").classList.add("active")
    document.getElementById("registerForm").classList.remove("active")
  }

  function showRegisterForm() {
    document.getElementById("loginForm").classList.remove("active")
    document.getElementById("registerForm").classList.add("active")
  }

  function setupCardFormatting() {
    const cardNumber = document.getElementById("card-number")
    const cardExpiry = document.getElementById("card-expiry")
    const cardCvv = document.getElementById("card-cvv")

    cardNumber.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "")
      value = value.substring(0, 16)
      value = value.replace(/(.{4})/g, "$1 ").trim()
      e.target.value = value
    })

    cardExpiry.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4)
      }
      e.target.value = value
    })

    cardCvv.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3)
    })
  }
})
