const form = document.querySelector("#symptomForm");
const resultTitle = document.querySelector("#resultTitle");
const resultSummary = document.querySelector("#resultSummary");
const urgencyText = document.querySelector("#urgencyText");
const clinicText = document.querySelector("#clinicText");
const adviceText = document.querySelector("#adviceText");
const totalChecks = document.querySelector("#totalChecks");
const emergencyFlags = document.querySelector("#emergencyFlags");
const recentClinic = document.querySelector("#recentClinic");

let checks = 0;
let emergencies = 0;

const clinicRules = [
  {
    clinic: "Emergency Care",
    urgency: "Emergency",
    className: "urgent",
    symptoms: ["chest pain", "difficulty breathing"],
    advice: "Please seek emergency help immediately or contact local emergency services."
  },
  {
    clinic: "Dental Clinic",
    urgency: "Moderate",
    className: "moderate",
    symptoms: ["tooth pain"],
    advice: "Visit a dental clinic for checking, cleaning, or tooth pain treatment."
  },
  {
    clinic: "Dermatology",
    urgency: "Moderate",
    className: "moderate",
    symptoms: ["skin rash"],
    advice: "Visit a dermatology clinic if the rash spreads, hurts, or does not improve."
  },
  {
    clinic: "Eye Clinic",
    urgency: "Moderate",
    className: "moderate",
    symptoms: ["eye redness"],
    advice: "Visit an eye clinic if redness is painful, affects vision, or continues."
  },
  {
    clinic: "General Clinic",
    urgency: "Moderate",
    className: "moderate",
    symptoms: ["fever", "cough", "sore throat", "headache", "stomach pain", "vomiting", "joint pain"],
    advice: "Visit a general clinic for assessment, especially if symptoms continue or become worse."
  }
];

function getSelectedSymptoms() {
  return Array.from(document.querySelectorAll("#symptomList input:checked"))
    .map((input) => input.value);
}

function analyzeSymptoms(symptoms, severity, duration) {
  const emergencyRule = clinicRules[0];
  const hasEmergencySymptom = symptoms.some((symptom) => emergencyRule.symptoms.includes(symptom));

  if (hasEmergencySymptom || severity === "severe") {
    return {
      ...emergencyRule,
      urgency: hasEmergencySymptom ? "Emergency" : "Urgent",
      advice: hasEmergencySymptom
        ? emergencyRule.advice
        : "Your symptoms are marked severe. Please visit urgent care or a nearby clinic as soon as possible."
    };
  }

  const matchedRule = clinicRules.find((rule) =>
    rule.symptoms.some((symptom) => symptoms.includes(symptom))
  );

  if (!matchedRule) {
    return {
      clinic: "General Clinic",
      urgency: "Low",
      className: "low",
      advice: "Monitor your symptoms and visit a clinic if you feel worse or symptoms continue."
    };
  }

  if (duration >= 8) {
    return {
      ...matchedRule,
      urgency: "Urgent",
      className: "urgent",
      advice: `Because the symptoms lasted more than a week, please visit ${matchedRule.clinic.toLowerCase()} soon.`
    };
  }

  return matchedRule;
}

function updateResult(result, name, symptoms) {
  const symptomText = symptoms.length ? symptoms.join(", ") : "no selected symptoms";

  resultTitle.textContent = `${result.clinic} recommended`;
  resultSummary.textContent = `${name}, based on ${symptomText}, the system recommends ${result.clinic.toLowerCase()}.`;
  urgencyText.textContent = result.urgency;
  clinicText.textContent = result.clinic;
  adviceText.textContent = result.advice;

  urgencyText.className = "";
  urgencyText.classList.add(result.className);
}

function updateDashboard(result) {
  checks += 1;
  if (result.urgency === "Emergency" || result.urgency === "Urgent") {
    emergencies += 1;
  }

  totalChecks.textContent = checks;
  emergencyFlags.textContent = emergencies;
  recentClinic.textContent = result.clinic;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#patientName").value.trim() || "Patient";
  const severity = document.querySelector("#severity").value;
  const duration = Number(document.querySelector("#duration").value);
  const symptoms = getSelectedSymptoms();

  if (!symptoms.length) {
    resultTitle.textContent = "Select at least one symptom";
    resultSummary.textContent = "The system needs symptoms before it can recommend a clinic.";
    urgencyText.textContent = "--";
    clinicText.textContent = "--";
    adviceText.textContent = "Please choose one or more symptoms from the checklist.";
    return;
  }

  const result = analyzeSymptoms(symptoms, severity, duration);
  updateResult(result, name, symptoms);
  updateDashboard(result);
});

form.addEventListener("reset", () => {
  resultTitle.textContent = "Waiting for symptoms";
  resultSummary.textContent = "Fill out the form to generate a clinic recommendation.";
  urgencyText.textContent = "--";
  clinicText.textContent = "--";
  adviceText.textContent = "Your result will appear here after analysis.";
});
