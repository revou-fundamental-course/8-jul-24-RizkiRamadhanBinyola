document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bmi-form");
    const downloadButton = document.getElementById("download-result");
    let isBMICalculated = false;  

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const beratBadan = parseFloat(document.getElementById("berat-badan").value);
        const tinggiBadan = parseFloat(document.getElementById("tinggi-badan").value) / 100;
        const jenisKelamin = document.querySelector('input[name="jenis_kelamin"]:checked');

        if (isNaN(beratBadan) || isNaN(tinggiBadan) || tinggiBadan === 0 || !jenisKelamin) {
            alert("Mohon lengkapi data yang diperlukan untuk menghitung BMI.");
            return;
        }

        const bmi = beratBadan / (tinggiBadan * tinggiBadan);
        displayResult(bmi, jenisKelamin.value);
        isBMICalculated = true;  
    });

    downloadButton.addEventListener("click", () => {
        if (!isBMICalculated) {
            alert("Silakan hitung BMI Anda terlebih dahulu sebelum mengunduh hasil.");
            return;
        }

        const resultValue = document.getElementById("bmi-result-value").textContent;
        const resultTitle = document.getElementById("bmi-result-title").textContent;
        const resultDescription = document.getElementById("bmi-result-description").textContent;
        const resultRange = document.getElementById("bmi-result-range").textContent;
        const diseases = Array.from(document.querySelectorAll("#disease-list li")).map(li => li.textContent).join(", ");
        const jenisKelamin = document.querySelector('input[name="jenis_kelamin"]:checked').value;

        const text = `
        ${resultValue}
        ${resultTitle}
        ${resultDescription}
        ${resultRange}
        Jenis Kelamin: ${jenisKelamin}
        ${diseases ? `Penyakit terkait: ${diseases}` : ""}
        `;

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "BMI_Result.txt";
        a.click();
        URL.revokeObjectURL(url);
    });

    // menghitung BMI dan menampilkan hasil, termasuk kategori BMI dan daftar penyakit terkait.
    function displayResult(bmi, jenisKelamin) {
        const resultTitle = document.getElementById("bmi-result-title");
        const resultValue = document.getElementById("bmi-result-value");
        const resultDescription = document.getElementById("bmi-result-description");
        const resultRange = document.getElementById("bmi-result-range");
        const diseaseList = document.getElementById("disease-list");
        const bmiMarker = document.getElementById("bmi-marker");

        let diseases = [];
        let scalePosition = 0; 

        resultValue.textContent = `Hasil BMI Anda: ${bmi.toFixed(2)}`;

        if (bmi < 18.5) {
            resultTitle.textContent = "Anda kekurangan berat badan";
            resultDescription.textContent = "Anda berada dalam kategori kekurangan berat badan.";
            resultRange.textContent = "Hasil BMI di bawah 18.5";
            diseases = ["Anemia", "Malnutrisi", "Osteoporosis"];
            scalePosition = 0;
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            resultTitle.textContent = "Berat badan Anda normal";
            resultDescription.textContent = "Anda berada dalam kategori berat badan normal.";
            resultRange.textContent = "Hasil BMI di antara 18.5 dan 24.9";
            scalePosition = 33;
        } else if (bmi >= 25 && bmi <= 29.9) {
            resultTitle.textContent = "Anda kelebihan berat badan";
            resultDescription.textContent = "Anda berada dalam kategori kelebihan berat badan.";
            resultRange.textContent = "Hasil BMI di antara 25 dan 29.9";
            diseases = ["Hipertensi", "Diabetes Tipe 2", "Sleep Apnea"];
            scalePosition = 66;
        } else {
            resultTitle.textContent = "Anda mengalami obesitas";
            resultDescription.textContent = "Anda berada dalam kategori obesitas.";
            resultRange.textContent = "Hasil BMI di atas 30";
            diseases = ["Penyakit Jantung", "Diabetes Tipe 2", "Stroke"];
            scalePosition = 100;
        }

        while (diseaseList.firstChild) {
            diseaseList.removeChild(diseaseList.firstChild);
        }

        diseases.forEach(disease => {
            const li = document.createElement("li");
            li.textContent = disease;
            diseaseList.appendChild(li);
        });

        bmiMarker.style.left = `${scalePosition}%`;
    }
});
