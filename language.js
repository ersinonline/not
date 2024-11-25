// Dil dosyalarının tanımlandığı nesne
const translations = {
    tr: {
        title: "İKÜ Hazırlık Yardımcım",
        form_label: "Nasıl yardımcı olabilirim?",
        option_kur: "Kur notumu hesaplayacağım.",
        option_proficiency: "Hazırlık puanımı hesaplayacağım.",
        option_calendar: "Sınav takvimine bakacağım.",
        option_support: "Yardım almak istiyorum.",
        total_score: "Toplam Notun:",
        theme_toggle: "🌙 Karanlık Mod"
    },
    en: {
        title: "IKU Prep Assistant",
        form_label: "How can I help you?",
        option_kur: "I want to calculate my course grade.",
        option_proficiency: "I want to calculate my prep grade.",
        option_calendar: "I want to check the exam calendar.",
        option_support: "I need help.",
        total_score: "Your Total Score:",
        theme_toggle: "🌙 Dark Mode"
    }
};

// Varsayılan dil
let currentLanguage = "tr";

// Sayfadaki tüm metinleri güncelleme fonksiyonu
function updateLanguage(lang) {
    currentLanguage = lang;

    // Tüm data-lang etiketine sahip elemanları seç
    const elementsToUpdate = document.querySelectorAll("[data-lang]");

    elementsToUpdate.forEach(element => {
        const translationKey = element.getAttribute("data-lang");
        if (translations[lang][translationKey]) {
            element.textContent = translations[lang][translationKey];
        }
    });
}

// Dil değiştirme butonlarını bağlama
document.getElementById("changeToTR").addEventListener("click", () => updateLanguage("tr"));
document.getElementById("changeToEN").addEventListener("click", () => updateLanguage("en"));

// Sayfa yüklendiğinde varsayılan dili yükle
document.addEventListener("DOMContentLoaded", () => updateLanguage(currentLanguage));
