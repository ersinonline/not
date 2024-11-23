function toggleCalculationType() {
    const type = document.getElementById("calculationType").value;
    
    document.getElementById("kurCalculation").style.display = type === "kur" ? "block" : "none";
    document.getElementById("proficiencyCalculation").style.display = type === "proficiency" ? "block" : "none";
    document.getElementById("calendar").style.display = type === "calendar" ? "block" : "none";  // Takvim görünür
    document.getElementById("support").style.display = type === "support" ? "block" : "none";  // Support görünür
    
    if (type === "calendar" || type === "support") {
        document.querySelector('.result').style.display = 'none'; 
    } else {
        document.querySelector('.result').style.display = 'block';  
    }

    saveFormData(); 
}

function saveFormData() {
    const formData = {
        calculationType: document.getElementById("calculationType").value,
        midLevel: document.getElementById("midLevel").value || "",
        endLevel: document.getElementById("endLevel").value || "",
        wextHomework: document.getElementById("wextHomework").value || "",
        macmillanHomework: document.getElementById("macmillanHomework").value || "",
        writing: document.getElementById("writing").value || "",
        participation: document.getElementById("participation").value || "",
        proficiencyExam: document.getElementById("proficiencyExam").value || "",
        a2Score: document.getElementById("a2Score").value || "",
        b1Score: document.getElementById("b1Score").value || "",
        b1PlusScore: document.getElementById("b1PlusScore").value || "",
        b2Score: document.getElementById("b2Score").value || "",
    };
    localStorage.setItem("formData", JSON.stringify(formData)); // JSON formatında kaydediliyor
}

function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem("formData")); // JSON formatında okuma
    if (savedData) {
        document.getElementById("calculationType").value = savedData.calculationType || "kur";
        toggleCalculationType(); // Tür değişikliğine göre alanları göster/gizle
        document.getElementById("midLevel").value = savedData.midLevel || "";
        document.getElementById("endLevel").value = savedData.endLevel || "";
        document.getElementById("wextHomework").value = savedData.wextHomework || "";
        document.getElementById("macmillanHomework").value = savedData.macmillanHomework || "";
        document.getElementById("writing").value = savedData.writing || "";
        document.getElementById("participation").value = savedData.participation || "";
        document.getElementById("proficiencyExam").value = savedData.proficiencyExam || "";
        document.getElementById("a2Score").value = savedData.a2Score || "";
        document.getElementById("b1Score").value = savedData.b1Score || "";
        document.getElementById("b1PlusScore").value = savedData.b1PlusScore || "";
        document.getElementById("b2Score").value = savedData.b2Score || "";
    }
}

function calculateKur() {
    saveFormData(); // Veriler hesaplamadan önce kaydedilir
    const midLevel = parseFloat(document.getElementById("midLevel").value) || 0;
    const endLevel = parseFloat(document.getElementById("endLevel").value) || null;
    const wextHomework = parseFloat(document.getElementById("wextHomework").value) || 0;
    const macmillanHomework = parseFloat(document.getElementById("macmillanHomework").value) || 0;
    const writing = parseFloat(document.getElementById("writing").value) * 5 || 0;
    const participation = parseFloat(document.getElementById("participation").value) || 0;

    let totalGrade = midLevel * 0.2 + wextHomework + macmillanHomework + writing * 0.1 + participation;

    if (endLevel === null) {
        const requiredEndLevel = (70 - totalGrade) / 0.45;
        document.getElementById("totalGrade").textContent = "-";
        if (requiredEndLevel > 100) {
            document.getElementById("passFailMessage").innerHTML =
                '<span class="fail">Maalesef, bu kuru geçmeniz mümkün değil.</span>';
        } else if (requiredEndLevel < 0) {
            document.getElementById("passFailMessage").innerHTML =
                '<span class="pass">Tebrikler, end level sınavına girmeden bu kuru geçebilirsiniz!</span>';
        } else {
            document.getElementById("passFailMessage").innerHTML =
                `<span class="error">Bu kuru geçebilmek için End of Level sınavından en az ${requiredEndLevel.toFixed(2)} puan almanız gerekiyor.</span>`;
        }
    } else {
        totalGrade += endLevel * 0.45;
        document.getElementById("totalGrade").textContent = totalGrade.toFixed(2);
        document.getElementById("passFailMessage").innerHTML =
            totalGrade >= 70
                ? '<span class="pass">Tebrikler, bu kuru geçtiniz!</span>'
                : '<span class="fail">Maalesef, bu kuru geçemediniz.</span>';
    }
}

function calculateProficiency() {
    saveFormData(); // Hesaplamadan önce kaydedilir
    const proficiencyExam = parseFloat(document.getElementById("proficiencyExam").value) || null;
    const a2Score = parseFloat(document.getElementById("a2Score").value);
    const b1Score = parseFloat(document.getElementById("b1Score").value);
    const b1PlusScore = parseFloat(document.getElementById("b1PlusScore").value);
    const b2ScoreInput = document.getElementById("b2Score").value;
    const b2Score = b2ScoreInput !== "" ? parseFloat(b2ScoreInput) : null;

    const scores = [a2Score, b1Score, b1PlusScore];
    if (b2Score !== null) scores.push(b2Score);

    const maxExamScore = scores.length * 100;
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const scaledExamScore = (totalScore / maxExamScore) * 30;

    if (proficiencyExam === null) {
        const requiredProficiency = (60 - scaledExamScore) / 0.7;
        document.getElementById("totalGrade").textContent = "-";
        if (requiredProficiency > 100) {
            document.getElementById("passFailMessage").innerHTML =
                '<span class="fail">Maalesef, bu puanlarla hazırlık aşamasını geçmeniz mümkün değil.</span>';
        } else if (requiredProficiency < 0) {
            document.getElementById("passFailMessage").innerHTML =
                '<span class="pass">Tebrikler, Proficiency Exam sonucu girmeden hazırlık aşamasını geçtiniz!</span>';
        } else {
            document.getElementById("passFailMessage").innerHTML =
                `<span class="error">Bu aşamayı geçebilmek için Proficiency Exam'dan en az ${requiredProficiency.toFixed(2)} puan almanız gerekiyor.</span>`;
        }
    } else {
        const scaledProficiencyScore = proficiencyExam * 0.7;
        const finalScore = scaledExamScore + scaledProficiencyScore;

        document.getElementById("totalGrade").textContent = finalScore.toFixed(2);
        document.getElementById("passFailMessage").innerHTML =
            finalScore >= 60
                ? '<span class="pass">Tebrikler, hazırlık aşamasını geçtiniz!</span>'
                : '<span class="fail">Maalesef, hazırlık aşamasını geçemediniz.</span>';
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    document.querySelector(".theme-toggle").textContent =
        newTheme === "dark" ? "☀️ Aydınlık Mod" : "🌙 Karanlık Mod";
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    document.querySelector(".theme-toggle").textContent =
        savedTheme === "dark" ? "☀️ Aydınlık Mod" : "🌙 Karanlık Mod";
}

window.onload = function () {
    loadTheme();
    loadFormData();
};

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").then(
        (registration) => {
            console.log("Service Worker kayıtlı:", registration);
        },
        (error) => {
            console.log("Service Worker kaydedilemedi:", error);
        }
        );
    });
}

document.querySelectorAll('#kurCalculation input, #kurCalculation select').forEach(input => {
    input.addEventListener('input', calculateKur); // Giriş değiştikçe hesaplama
});

// Hazırlık kısmı için otomatik hesaplama
document.querySelectorAll('#proficiencyCalculation input, #proficiencyCalculation select').forEach(input => {
    input.addEventListener('input', calculateProficiency); // Giriş değiştikçe hesaplama
});