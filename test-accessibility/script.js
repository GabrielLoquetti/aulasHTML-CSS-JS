// ===== Animação inicial com JavaScript =====
window.addEventListener("load", () => {
    const title = document.getElementById("product-title");
    const description = document.getElementById("product-description");

    // Slide para o título
    setTimeout(() => {
    title.style.opacity = "1";
    title.style.transform = "translateY(0)";
    title.style.transition = "all 0.8s ease";
    }, 300);

    // Slide para a descrição
    setTimeout(() => {
    description.style.opacity = "1";
    description.style.transform = "translateY(0)";
    description.style.transition = "all 0.8s ease";
    }, 700);
});

// ===== Animações avançadas com GSAP =====
gsap.from(".product img", {
    duration: 1.5,
    rotation: 10,
    y: -20,
    ease: "elastic.out(1, 0.5)"
});

// Botão pulsando
gsap.to("#btn-cart", {
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    duration: 0.8,
    ease: "power1.inOut",
    delay: 2
});