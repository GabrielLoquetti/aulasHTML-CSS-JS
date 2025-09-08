// Sistema de Autenticação e Pagamento
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.bindEvents();
    }

    // Verificar se usuário está logado
    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    // Atualizar interface do usuário
    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');

        if (this.currentUser) {
            loginBtn.classList.add('hidden');
            userInfo.classList.remove('hidden');
            userName.textContent = `Olá, ${this.currentUser.name}`;
        } else {
            loginBtn.classList.remove('hidden');
            userInfo.classList.add('hidden');
        }
    }

    // Registrar novo usuário
    register(name, email, password) {
        // Verificar se email já existe
        if (this.users.find(user => user.email === email)) {
            throw new Error('Este e-mail já está cadastrado');
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password // Em produção, usar hash da senha
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        return newUser;
    }

    // Fazer login
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('E-mail ou senha incorretos');
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateUI();
        
        return user;
    }

    // Fazer logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
    }

    // Verificar se está logado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Vincular eventos
    bindEvents() {
        // Botões de abrir/fechar modais
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showAuthModal();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideAuthModal();
        });

        document.getElementById('close-payment').addEventListener('click', () => {
            this.hidePaymentModal();
        });

        document.getElementById('close-success').addEventListener('click', () => {
            this.hideSuccessModal();
        });

        // Alternar entre login e registro
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Formulários
        document.getElementById('login-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('register-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePayment(e);
        });

        // Botões de compra
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePurchase(e);
            });
        });

        // Fechar modal clicando fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Formatação de campos
        this.setupCardFormatting();
    }

    // Mostrar modal de autenticação
    showAuthModal() {
        document.getElementById('auth-modal').classList.remove('hidden');
        this.showLoginForm();
    }

    // Esconder modal de autenticação
    hideAuthModal() {
        document.getElementById('auth-modal').classList.add('hidden');
    }

    // Mostrar formulário de login
    showLoginForm() {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
    }

    // Mostrar formulário de registro
    showRegisterForm() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    }

    // Processar login
    handleLogin(e) {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            this.login(email, password);
            this.hideAuthModal();
            this.showMessage('Login realizado com sucesso!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    // Processar registro
    handleRegister(e) {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem', 'error');
            return;
        }

        try {
            const user = this.register(name, email, password);
            this.login(email, password);
            this.hideAuthModal();
            this.showMessage('Conta criada com sucesso!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    // Processar compra
    handlePurchase(e) {
        const product = e.target.dataset.product;
        const price = e.target.dataset.price;

        if (!this.isAuthenticated()) {
            this.showMessage('Você precisa fazer login para comprar', 'error');
            this.showAuthModal();
            return;
        }

        this.showPaymentModal(product, price);
    }

    // Mostrar modal de pagamento
    showPaymentModal(product, price) {
        document.getElementById('order-product').textContent = product;
        document.getElementById('order-price').textContent = `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
        document.getElementById('order-total').textContent = `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
        
        document.getElementById('payment-modal').classList.remove('hidden');
    }

    // Esconder modal de pagamento
    hidePaymentModal() {
        document.getElementById('payment-modal').classList.add('hidden');
    }

    // Processar pagamento
    handlePayment(e) {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        const cardName = document.getElementById('card-name').value;

        // Validações básicas
        if (!this.validateCard(cardNumber, cardExpiry, cardCvv, cardName)) {
            return;
        }

        // Simular processamento
        this.showMessage('Processando pagamento...', 'info');
        
        setTimeout(() => {
            this.hidePaymentModal();
            this.showSuccessModal();
            this.clearPaymentForm();
        }, 2000);
    }

    // Validar dados do cartão
    validateCard(number, expiry, cvv, name) {
        if (number.replace(/\s/g, '').length !== 16) {
            this.showMessage('Número do cartão deve ter 16 dígitos', 'error');
            return false;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            this.showMessage('Formato de validade inválido (MM/AA)', 'error');
            return false;
        }

        if (cvv.length !== 3) {
            this.showMessage('CVV deve ter 3 dígitos', 'error');
            return false;
        }

        if (name.trim().length < 2) {
            this.showMessage('Nome no cartão é obrigatório', 'error');
            return false;
        }

        return true;
    }

    // Mostrar modal de sucesso
    showSuccessModal() {
        document.getElementById('success-modal').classList.remove('hidden');
    }

    // Esconder modal de sucesso
    hideSuccessModal() {
        document.getElementById('success-modal').classList.add('hidden');
    }

    // Limpar formulário de pagamento
    clearPaymentForm() {
        document.getElementById('payment-form').reset();
    }

    // Configurar formatação de campos do cartão
    setupCardFormatting() {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');

        // Formatação do número do cartão
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            value = value.substring(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
        });

        // Formatação da validade
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // Formatação do CVV
        cardCvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    // Mostrar mensagens
    showMessage(message, type) {
        // Remover mensagem anterior se existir
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Estilos da mensagem
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // Cores por tipo
        const colors = {
            success: '#56ab2f',
            error: '#e74c3c',
            info: '#3498db'
        };

        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        // Remover após 3 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});