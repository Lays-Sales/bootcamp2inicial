// Configuração da API da NASA
const API_KEY = "UlOA3BFc9r4GNBMsvfCItC9KJFPEIBoBJjJVRH10";
const API_URL = "https://api.nasa.gov/planetary/apod";
const FIRST_APOD_DATE = "1995-06-16";

// Configuração do Supabase (Substitua pelas suas credenciais reais)
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA_CHAVE_ANON_AQUI";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elementos da Interface
const form = document.querySelector("#search-form");
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
const favoriteButton = document.querySelector("#favorite-button");
const favoritesList = document.querySelector("#favorites-list");

let currentApodData = null;

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
  currentApodData = data;
  const mediaUrl = data.hdurl || data.url || data.thumbnail_url;

  resultCard.hidden = false;
  emptyState.hidden = true;

  apodDate.textContent = formatDate(data.date);
  mediaType.textContent = data.media_type === "video" ? "Vídeo" : "Imagem";
  apodTitle.textContent = data.title || "Sem título";
  apodExplanation.textContent = data.explanation || "A NASA não forneceu uma explicação.";
  copyright.textContent = data.copyright ? `Crédito: ${data.copyright}` : "Crédito: NASA";
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
      const apiMessage = data.error?.message || data.msg || "A NASA recusou a consulta.";
      throw new Error(apiMessage);
    }

    showResult(data);
    showStatus(`Conteúdo de ${formatDate(data.date)} carregado com sucesso.`, "success");
  } catch (error) {
    resultCard.hidden = true;
    emptyState.hidden = false;
    showStatus(`Não foi possível carregar a imagem: ${error.message}`, "error");
  } finally {
    searchButton.disabled = false;
  }
}

// ==========================================
// OPERAÇÕES DO BANCO DE DADOS (SUPABASE - CRUD)
// ==========================================

// CREATE: Salvar nos favoritos
async function salvarFavorito() {
  if (!currentApodData) return;

  const mediaUrl = currentApodData.hdurl || currentApodData.url || currentApodData.thumbnail_url;

  const novoFavorito = {
    title: currentApodData.title || "Sem título",
    date: currentApodData.date,
    media_url: mediaUrl,
    media_type: currentApodData.media_type
  };

  showStatus("Salvando nos favoritos...", "");

  const { error } = await supabaseClient.from("favoritos").insert([novoFavorito]);

  if (error) {
    console.error("Erro ao salvar favorito:", error);
    showStatus("Erro ao salvar favorito no banco.", "error");
  } else {
    showStatus("Salvo nos favoritos com sucesso!", "success");
    listarFavoritos();
  }
}

// READ: Listar favoritos
async function listarFavoritos() {
  const { data, error } = await supabaseClient
    .from("favoritos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar favoritos:", error);
    return;
  }

  favoritesList.innerHTML = "";

  if (data.length === 0) {
    favoritesList.innerHTML = "<p class='no-favorites'>Nenhum favorito salvo ainda.</p>";
    return;
  }

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "favorite-card";

    card.innerHTML = `
      <div class="fav-media">
        ${item.media_type === "image" 
          ? `<img src="${item.media_url}" alt="${item.title}" />` 
          : `<div class="fav-video-placeholder">🎥 Vídeo</div>`}
      </div>
      <div class="fav-info">
        <h4>${item.title}</h4>
        <p>${formatDate(item.date)}</p>
        <button onclick="removerFavorito(${item.id})" class="delete-btn">🗑️ Excluir</button>
      </div>
    `;

    favoritesList.appendChild(card);
  });
}

// DELETE: Remover favorito
async function removerFavorito(id) {
  const { error } = await supabaseClient.from("favoritos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao remover favorito:", error);
    showStatus("Erro ao excluir favorito.", "error");
  } else {
    showStatus("Favorito removido!", "success");
    listarFavoritos();
  }
}

// Event Listeners
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

favoriteButton.addEventListener("click", salvarFavorito);

// Inicialização
const today = getToday();
dateInput.min = FIRST_APOD_DATE;
dateInput.max = today;
dateInput.value = today;

loadApod(today);
listarFavoritos();
