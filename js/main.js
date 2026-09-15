document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll effect ──
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-md');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-md');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ── Mobile menu toggle ──
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // ── Smooth scrolling ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── Quantity controls ──
    const PRICE_PER_CAN = 300;
    const qtyInput = document.getElementById('qtyInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyDisplay = document.getElementById('qtyDisplay');
    const totalPrice = document.getElementById('totalPrice');

    function updatePrice() {
        const qty = Math.max(1, parseInt(qtyInput.value) || 1);
        qtyInput.value = qty;
        qtyDisplay.textContent = qty;
        totalPrice.textContent = (qty * PRICE_PER_CAN).toLocaleString('ar-SY') + ' ل.س';
    }

    qtyMinus.addEventListener('click', () => {
        const current = parseInt(qtyInput.value) || 1;
        if (current > 1) {
            qtyInput.value = current - 1;
            updatePrice();
        }
    });

    qtyPlus.addEventListener('click', () => {
        const current = parseInt(qtyInput.value) || 1;
        if (current < 100) {
            qtyInput.value = current + 1;
            updatePrice();
        }
    });

    qtyInput.addEventListener('input', () => {
        let val = parseInt(qtyInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 100) val = 100;
        qtyInput.value = val;
        updatePrice();
    });

    updatePrice();

    // ── WhatsApp integration ──
    const whatsappBtn = document.getElementById('whatsappBtn');
    const WHATSAPP_PHONE = '963952737292';

    function getOrderDetails() {
        return {
            name: document.getElementById('custName')?.value.trim() || '',
            phone: document.getElementById('custPhone')?.value.trim() || '',
            address: document.getElementById('custAddress')?.value.trim() || '',
            qty: Math.max(1, parseInt(qtyInput.value) || 1)
        };
    }

    function buildWhatsAppLink(details) {
        const total = details.qty * PRICE_PER_CAN;
        const msg = encodeURIComponent(
            `🐾 طلب جديد - Healthy Pet\n\n` +
            `الاسم: ${details.name}\n` +
            `الهاتف: ${details.phone}\n` +
            `العنوان: ${details.address}\n` +
            `الكمية: ${details.qty} علبة\n` +
            `المجموع: ${total} ل.س`
        );
        return `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    }

    // WhatsApp quick-order button: pre-fills from the form (if filled) then opens WhatsApp.
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const details = getOrderDetails();
        const link = buildWhatsAppLink(details);
        window.open(link, '_blank');
    });

    // ── Order form submit: validate → build message → open WhatsApp → confirm modal ──
    const orderForm = document.getElementById('orderForm');
    const successModal = document.getElementById('successModal');
    const modalDetails = document.getElementById('modalDetails');
    const closeModalBtn = document.getElementById('closeModal');

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const details = getOrderDetails();

        if (!details.name) {
            alert('يرجى إدخال الاسم الكامل');
            document.getElementById('custName').focus();
            return;
        }
        if (!details.phone) {
            alert('يرجى إدخال رقم الهاتف');
            document.getElementById('custPhone').focus();
            return;
        }
        if (!details.address) {
            alert('يرجى إدخال عنوان التوصيل');
            document.getElementById('custAddress').focus();
            return;
        }

        // Open WhatsApp with the formatted order message.
        const link = buildWhatsAppLink(details);
        window.open(link, '_blank');

        const total = details.qty * PRICE_PER_CAN;
        modalDetails.innerHTML = `
            <div><strong>الاسم:</strong> ${details.name}</div>
            <div><strong>الهاتف:</strong> ${details.phone}</div>
            <div><strong>العنوان:</strong> ${details.address}</div>
            <div><strong>الكمية:</strong> ${details.qty} علبة</div>
            <div><strong>المجموع:</strong> ${total} ل.س</div>
        `;

        successModal.classList.remove('hidden');
        successModal.classList.add('flex');
    });

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
        orderForm.reset();
        qtyInput.value = 1;
        updatePrice();
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModalBtn.click();
        }
    });

    // ── Scroll reveal animation ──
    const revealElements = document.querySelectorAll(
        '#products .group, #features .group, #reviews > div > div > div:last-child > div, .animate-on-scroll'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .review-card').forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
});
