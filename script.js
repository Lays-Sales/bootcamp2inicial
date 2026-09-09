const API_KEY = "UlOA3BFc9r4GNBMsvfCItC9KJFPEIBoBJjJVRH10";
const API_URL = "https://api.nasa.gov/planetary/apod";
const FIRST_APOD_DATE = "1995-06-16";

const form = document.querySelector("#search-form" );
const dateInput = document.querySelector("#date-input");
const searchButton = document.querySelector("#search-button");
const todayButton = document.querySelector("#today-button");

const statusMessage = document.querySelector("#status-message");
const emptyState = document.querySelector("#empty-state");
const resultCard = document.querySelector("#result-card");

const apodImage = document.querySelector("#apod-image");
const videoContainer = document.querySelector("#video-container");
const videoLink = document.querySelector("#video-link");

const apodDate = document.querySelector("#apod-date");
const mediaType = document.querySelector("#media-type");
const apodTitle = document.querySelector("#apod-title");
const apodExplanation = document.querySelector("#apod-explanation");
const copyright = document.querySelector("#copyright");
const originalLink = document.querySelector("#original-link");

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
}

function showResult(data) {
  const mediaUrl = data.hdurl || data.url || data.thumbnail_url;

  resultCard.hidden = false;
  emptyState.hidden = true;

  apodDate.textContent = formatDate(data.date);

  mediaType.textContent =
    data.media_type === "video" ? "Vídeo" : "Imagem";

  apodTitle.textContent = data.title || "Sem título";

  apodExplanation.textContent =
    data.explanation || "A NASA não forneceu uma explicação.";

  copyright.textContent = data.copyright
    ? `Crédito: ${data.copyright}`
    : "Crédito: NASA";

  originalLink.href = mediaUrl;

  if (data.media_type === "image") {
    apodImage.hidden = false;
    videoContainer.hidden = true;

    apodImage.src = mediaUrl;
    apodImage.alt = `${data.title} — imagem astronômica da NASA`;
  } else {
    apodImage.hidden = true;
    videoContainer.hidden = false;

    videoLink.href = mediaUrl;
  }
}

async function loadApod(date) {
  searchButton.disabled = true;
  resultCard.hidden = true;
  emptyState.hidden = true;

  showStatus("Carregando conteúdo da NASA...");

  try {
    const url = new URL(API_URL);

    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("date", date);
    url.searchParams.set("thumbs", "true");

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(
        data.msg || "Não foi possível encontrar conteúdo para essa data."
      );
    }

    showResult(data);

    showStatus(
      `Conteúdo de ${formatDate(data.date)} carregado com sucesso.`,
      "success"
    );
  } catch (error) {
    resultCard.hidden = true;
    emptyState.hidden = false;

    showStatus(
      "Não foi possível carregar a imagem. Verifique a data ou tente novamente.",
      "error"
    );

    console.error("Erro ao consultar a NASA:", error);
  } finally {
    searchButton.disabled = false;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!dateInput.value) {
    showStatus("Escolha uma data antes de pesquisar.", "error");
    return;
  }

  loadApod(dateInput.value);
});

todayButton.addEventListener("click", function () {
  dateInput.value = getToday();
  loadApod(dateInput.value);
});

apodImage.addEventListener("error", function () {
  showStatus(
    "A informação foi carregada, mas a imagem não pôde ser exibida.",
    "error"
  );
});

const today = getToday();

dateInput.min = FIRST_APOD_DATE;
dateInput.max = today;
dateInput.value = today;

loadApod(today);
