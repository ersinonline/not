function toggleCalculationType() {
    const type = document.getElementById("calculationType").value;

    document.getElementById("kurCalculation").style.display = type === "kur" ? "block" : "none";
    document.getElementById("proficiencyCalculation").style.display = type === "proficiency" ? "block" : "none";
    document.getElementById("calendar").style.display = type === "calendar" ? "block" : "none";
    document.getElementById("support").style.display = type === "support" ? "block" : "none";

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
    localStorage.setItem("formData", JSON.stringify(formData));
}

function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem("formData"));
    if (savedData) {
        document.getElementById("calculationType").value = savedData.calculationType || "kur";
        toggleCalculationType();
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
    saveFormData();

    const midLevel = parseFloat(document.getElementById("midLevel").value) || 0;
    const endLevel = parseFloat(document.getElementById("endLevel").value) || null;

    const macmillanRaw = parseFloat(document.getElementById("macmillanHomework").value) || 0;
    const macmillanHomework = (macmillanRaw / 100) * 10;

    const wextRaw = parseFloat(document.getElementById("wextHomework").value) || 0;
    const wextHomework = (wextRaw / 100) * 5;

    const writing = parseFloat(document.getElementById("writing").value) || 0;
    const writingScore = (writing / 20) * 10;

    const participation = parseFloat(document.getElementById("participation").value) || 0;

    let totalGrade = midLevel * 0.2 + 
                     (endLevel !== null ? endLevel * 0.45 : 0) +
                     wextHomework + 
                     macmillanHomework + 
                     writingScore + 
                     participation;

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
        document.getElementById("totalGrade").textContent = totalGrade.toFixed(2);
        document.getElementById("passFailMessage").innerHTML =
            totalGrade >= 70
                ? '<span class="pass">Tebrikler, bu kuru geçtiniz!</span>'
                : '<span class="fail">Maalesef, bu kuru geçemediniz.</span>';
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
    input.addEventListener('input', calculateKur);
});
