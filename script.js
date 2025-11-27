// EmailJS init
(function () {
  emailjs.init("1I1zHzuMF9CGAITwE"); // PUBLIC KEY
})();

// Sabitler
const SERVICE_ID = "service_cir4ng9";
const TEMPLATE_ID_CONTACT = "template_yfar6gh";
const TEMPLATE_ID_ORDER = "template_4p9629d";
const UNIT_PRICE = 100; // TL

// Scroll animasyonları
const scrollElements = document.querySelectorAll(".scroll-up, .scroll-fade");

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

scrollElements.forEach((el) => scrollObserver.observe(el));

// HERO 3D KART hareketi (hafif mouse parallax)
const heroCard = document.getElementById("heroCard");
if (heroCard) {
  heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / 12).toFixed(2);
    const rotateY = (x / 12).toFixed(2);
    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

// MOBILE NAV
const navToggle = document.getElementById("navToggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// İLETİŞİM FORMU
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    contactStatus.textContent = "Gönderiliyor...";
    contactStatus.style.color = "#c0c3cf";

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID_CONTACT, {
        name,
        email,
        message,
        to_email: "by599296@gmail.com",
      })
      .then(
        () => {
          contactStatus.textContent = "Mesajın başarıyla gönderildi.";
          contactStatus.style.color = "#a5ff65";
          contactForm.reset();
        },
        () => {
          contactStatus.textContent = "Bir hata oluştu. Lütfen tekrar dene.";
          contactStatus.style.color = "#ff8c8c";
        }
      );
  });
}

// SİPARİŞ SAYFASI – Kart alanlarını oluşturma
function generateCardFields() {
  const cardCountEl = document.getElementById("cardCount");
  const cardDetails = document.getElementById("cardDetails");
  const totalUnitsLabel = document.getElementById("totalUnitsLabel");
  const totalPriceLabel = document.getElementById("totalPriceLabel");

  if (!cardCountEl || !cardDetails) return;

  const count = parseInt(cardCountEl.value, 10);
  cardDetails.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const box = document.createElement("div");
    box.className = "card-box";
    box.innerHTML = `
      <h3>${i}. Kart</h3>
      <p style="font-size:0.8rem;opacity:0.8;margin-bottom:6px;">
        Bu kart okutulduğunda hangi <strong>tek verinin</strong> (örneğin tek bir link) kullanılacağını yaz:
      </p>
      <input
        type="text"
        id="card_${i}"
        placeholder="Örn: https://instagram.com/kullanici_adi"
        required
      />
    `;
    cardDetails.appendChild(box);
  }

  if (totalUnitsLabel && totalPriceLabel) {
    totalUnitsLabel.textContent = String(count);
    totalPriceLabel.textContent = `${count * UNIT_PRICE} TL`;
  }
}

// Sayfa yüklendiğinde ilk oluşturma
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cardCount")) {
    generateCardFields();
  }
});

// SİPARİŞ FORMU
const orderForm = document.getElementById("orderForm");
const orderStatus = document.getElementById("orderStatus");

if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const cardCount = parseInt(
      document.getElementById("cardCount").value,
      10
    );
    const customerName = document.getElementById("customerName").value.trim();
    const customerEmail = document
      .getElementById("customerEmail")
      .value.trim();

    let orderDetails = "";
    for (let i = 1; i <= cardCount; i++) {
      const input = document.getElementById(`card_${i}`);
      const value = (input?.value || "").trim();
      orderDetails += `Kart ${i} Verisi: ${value}\n`;
    }

    const totalUnits = cardCount;
    const unitPrice = UNIT_PRICE;
    const totalPrice = totalUnits * unitPrice;

    // Order ID (basit random)
    const orderId = `R0Y-${Date.now().toString().slice(-6)}`;

    if (orderStatus) {
      orderStatus.textContent = "Sipariş gönderiliyor...";
      orderStatus.style.color = "#c0c3cf";
    }

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID_ORDER, {
        order_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
        order_details: orderDetails,
        total_units: totalUnits,
        unit_price: unitPrice,
        total_price: totalPrice,
        to_email: "by599296@gmail.com",
      })
      .then(
        () => {
          if (orderStatus) {
            orderStatus.textContent =
              "Siparişin başarıyla gönderildi. En kısa sürede dönüş yapılacak.";
            orderStatus.style.color = "#a5ff65";
          }
          orderForm.reset();
          generateCardFields(); // reset sonrası 1 karta dönsün
        },
        () => {
          if (orderStatus) {
            orderStatus.textContent =
              "Sipariş gönderilirken bir hata oluştu. Lütfen tekrar dene.";
            orderStatus.style.color = "#ff8c8c";
          }
        }
      );
  });
}
