$(document).ready(function () {
  const STORAGE_KEYS = { recipes: "dapurKitaRecipesV1", favorites: "dapurKitaFavoritesV1" };
  const starterRecipes = [
    { id: "r1", name: "Nasi Goreng Kampung", category: "Makanan Utama", time: 20, emoji: "🍳", tone: 0, description: "Nasi goreng sederhana dengan bumbu rumahan yang gurih dan harum.", ingredients: ["2 piring nasi putih", "2 siung bawang putih", "3 siung bawang merah", "1 butir telur", "Kecap manis secukupnya", "Garam dan merica"], steps: ["Haluskan bawang merah dan bawang putih.", "Tumis bumbu hingga harum, lalu masukkan telur.", "Tambahkan nasi, kecap, garam, dan merica.", "Aduk hingga rata dan sajikan hangat."], author: "DapurKita", createdAt: 5 },
    { id: "r2", name: "Salad Sayur Segar", category: "Makanan Utama", time: 15, emoji: "🥗", tone: 1, description: "Salad segar dengan sayuran renyah dan dressing sederhana.", ingredients: ["Selada secukupnya", "1 buah tomat", "1 buah mentimun", "Jagung manis", "Dressing sesuai selera"], steps: ["Cuci bersih seluruh sayuran.", "Potong sayuran sesuai selera.", "Campurkan dalam mangkuk.", "Tambahkan dressing sebelum disajikan."], author: "DapurKita", createdAt: 4 },
    { id: "r3", name: "Pancake Buah", category: "Dessert", time: 25, emoji: "🥞", tone: 2, description: "Pancake lembut dengan potongan buah segar untuk sarapan atau camilan.", ingredients: ["100 g tepung terigu", "1 butir telur", "120 ml susu", "1 sdm gula", "Buah segar secukupnya"], steps: ["Campur tepung, telur, susu, dan gula.", "Aduk hingga adonan halus.", "Tuang sedikit adonan ke wajan anti lengket.", "Balik saat muncul gelembung, lalu sajikan dengan buah."], author: "DapurKita", createdAt: 3 },
    { id: "r4", name: "Nasi Udang Lemon", category: "Makanan Utama", time: 30, emoji: "🍤", tone: 1, description: "Nasi dengan udang berbumbu dan sentuhan lemon yang segar.", ingredients: ["200 g udang kupas", "2 piring nasi", "2 siung bawang putih", "1/2 buah lemon", "Garam dan lada"], steps: ["Bumbui udang dengan garam, lada, dan lemon.", "Tumis bawang putih hingga harum.", "Masukkan udang dan masak hingga matang.", "Sajikan bersama nasi hangat."], author: "DapurKita", createdAt: 2 },
    { id: "r5", name: "Kari Ayam Rumahan", category: "Makanan Utama", time: 40, emoji: "🍛", tone: 0, description: "Kari ayam dengan kuah gurih dan rempah yang menghangatkan.", ingredients: ["300 g ayam", "200 ml santan", "Bumbu kari", "1 batang serai", "Garam secukupnya"], steps: ["Tumis bumbu kari dan serai hingga harum.", "Masukkan ayam, aduk hingga berubah warna.", "Tambahkan santan dan sedikit air.", "Masak sampai ayam empuk dan bumbu meresap."], author: "DapurKita", createdAt: 1 },
    { id: "r6", name: "Sup Krim Jagung", category: "Sup", time: 25, emoji: "🍲", tone: 3, description: "Sup jagung lembut dan hangat, cocok untuk santapan ringan.", ingredients: ["1 buah jagung manis", "400 ml kaldu", "100 ml susu", "1 sdm tepung maizena", "Garam dan lada"], steps: ["Pipil jagung dan rebus dengan kaldu.", "Tambahkan susu, lalu aduk perlahan.", "Larutkan maizena dengan sedikit air dan tuangkan.", "Bumbui, masak hingga mengental, lalu sajikan."], author: "DapurKita", createdAt: 0 },
    { id: "r7", name: "Pisang Goreng Renyah", category: "Camilan", time: 20, emoji: "🍌", tone: 2, description: "Pisang goreng dengan lapisan luar renyah dan bagian dalam lembut.", ingredients: ["4 buah pisang", "100 g tepung terigu", "1 sdm gula", "Air secukupnya", "Minyak untuk menggoreng"], steps: ["Campur tepung, gula, dan air hingga menjadi adonan.", "Iris pisang sesuai selera.", "Celupkan pisang ke dalam adonan.", "Goreng hingga keemasan dan tiriskan."], author: "DapurKita", createdAt: -1 },
    { id: "r8", name: "Es Teh Lemon", category: "Minuman", time: 10, emoji: "🍋", tone: 1, description: "Minuman teh dingin dengan rasa lemon yang menyegarkan.", ingredients: ["1 kantong teh", "250 ml air panas", "1/2 buah lemon", "Gula atau madu", "Es batu"], steps: ["Seduh teh dengan air panas.", "Tambahkan gula atau madu sesuai selera.", "Biarkan teh agak dingin.", "Tambahkan lemon dan es batu."], author: "DapurKita", createdAt: -2 },
    { id: "r9", name: "Brownies Cokelat", category: "Dessert", time: 45, emoji: "🍫", tone: 3, description: "Brownies cokelat dengan tekstur lembut dan rasa cokelat yang pekat.", ingredients: ["100 g cokelat", "80 g mentega", "2 butir telur", "80 g gula", "70 g tepung terigu"], steps: ["Lelehkan cokelat dan mentega.", "Kocok telur dan gula hingga tercampur.", "Masukkan cokelat leleh dan tepung.", "Panggang hingga matang, lalu dinginkan sebelum dipotong."], author: "DapurKita", createdAt: -3 }
  ];

  let recipes = loadArray(STORAGE_KEYS.recipes, starterRecipes);
  let favorites = loadArray(STORAGE_KEYS.favorites, []);
  let activeCategory = "Semua";
  let activeView = "home";
  let currentDetailId = null;
  let visibleCount = 6;
  let toastTimer = null;

  function loadArray(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback.slice();
    } catch (error) {
      return fallback.slice();
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEYS.recipes, JSON.stringify(recipes));
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    } catch (error) {
      showToast("Penyimpanan browser penuh atau tidak tersedia.");
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function safeImageUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function showToast(message) {
    const $toast = $("#toast");
    $toast.text(message).addClass("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $toast.removeClass("show"); }, 2600);
  }

  function getRecipe(id) {
    return recipes.find(function (recipe) { return recipe.id === id; });
  }

  function recipeMatchesView(recipe) {
    if (activeView === "favorites") return favorites.includes(recipe.id);
    if (activeView === "my-recipes") return recipe.author === "Kamu";
    return true;
  }

  function filteredRecipes() {
    const query = $("#searchInput").val().trim().toLowerCase();
    let result = recipes.filter(function (recipe) {
      const matchesQuery = [recipe.name, recipe.category, recipe.description, ...(recipe.ingredients || [])]
        .join(" ").toLowerCase().includes(query);
      const matchesCategory = activeCategory === "Semua" || recipe.category === activeCategory;
      return matchesQuery && matchesCategory && recipeMatchesView(recipe);
    });

    const sort = $("#sortSelect").val();
    if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name, "id"));
    else if (sort === "newest") result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    else result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return result;
  }

  function photoMarkup(recipe) {
    const photo = safeImageUrl(recipe.photo);
    if (photo) {
      return `<img class="recipe-photo" src="${escapeHtml(photo)}" alt="${escapeHtml(recipe.name)}" loading="lazy" onerror="this.outerHTML='<div class=&quot;recipe-emoji tone-${Number(recipe.tone) % 4}&quot; aria-label=&quot;Foto belum tersedia&quot;>🍽️</div>'">`;
    }
    return `<div class="recipe-emoji tone-${Number(recipe.tone || 0) % 4}" aria-label="Ilustrasi makanan">${escapeHtml(recipe.emoji || "🍽️")}</div>`;
  }

  function cardMarkup(recipe, index) {
    const isFavorite = favorites.includes(recipe.id);
    return `
      <article class="recipe-card" style="animation-delay:${Math.min(index, 8) * 35}ms">
        <div class="recipe-card-top">
          ${photoMarkup(recipe)}
          <button class="favorite-toggle ${isFavorite ? "is-favorite" : ""}" data-favorite="${escapeHtml(recipe.id)}" aria-label="${isFavorite ? "Hapus dari favorit" : "Tambahkan ke favorit"}" title="${isFavorite ? "Hapus dari favorit" : "Tambahkan ke favorit"}">${isFavorite ? "♥" : "♡"}</button>
        </div>
        <div class="recipe-card-content">
          <div class="recipe-card-meta"><span class="mini-tag">${escapeHtml(recipe.category)}</span><span>◷ ${Number(recipe.time) || 0} menit</span></div>
          <h3>${escapeHtml(recipe.name)}</h3>
          <p>${escapeHtml(recipe.description || "Resep pilihan untuk dicoba di rumah.")}</p>
          <div class="recipe-card-bottom"><span class="recipe-author">Oleh ${escapeHtml(recipe.author || "DapurKita")}</span><button class="recipe-detail-button" data-detail="${escapeHtml(recipe.id)}">Lihat resep <span>↗</span></button></div>
        </div>
      </article>`;
  }

  function updatePageCopy() {
    const copy = {
      home: ["Masak enak, <span>mulai dari sini.</span>", "Kumpulan inspirasi resep untuk menemani setiap momen di rumah.", "DIKURASI UNTUKMU", "Resep pilihan hari ini"],
      browse: ["Jelajahi <span>ide masakan.</span>", "Cari inspirasi baru berdasarkan nama, bahan, atau kategori.", "SEMUA INSPIRASI", "Jelajahi semua resep"],
      favorites: ["Resep <span>kesukaanmu.</span>", "Semua resep yang kamu simpan ada di satu tempat.", "KOLEKSI PRIBADI", "Resep favorit"],
      "my-recipes": ["Dari dapur <span>untuk semua.</span>", "Kelola dan temukan kembali resep yang kamu bagikan.", "KREASI KAMU", "Resep yang kamu bagikan"]
    };
    const selected = copy[activeView] || copy.home;
    $("#pageTitle").html(selected[0]);
    $("#pageSubtitle").text(selected[1]);
    $("#recipesEyebrow").text(selected[2]);
    $("#recipesTitle").html(`${selected[3]} <span class="heading-spark">✳</span>`);
  }

  function renderRecipes() {
    const results = filteredRecipes();
    const shown = results.slice(0, visibleCount);
    $("#recipeGrid").html(shown.map(cardMarkup).join(""));
    $("#emptyState").toggleClass("hidden", results.length > 0);
    $("#recipeGrid").toggleClass("hidden", results.length === 0);
    $("#loadMoreBtn").toggleClass("hidden", results.length <= visibleCount);
    $("#favoriteCount").text(favorites.length);
    updatePageCopy();
  }

  function setView(view) {
    activeView = view;
    $(".nav-link").removeClass("active").filter(`[data-view="${view}"]`).addClass("active");
    if (view === "browse") activeCategory = "Semua";
    if (view === "favorites" || view === "my-recipes") activeCategory = "Semua";
    $(".category-pill").removeClass("active").filter('[data-category="Semua"]').addClass("active");
    visibleCount = 6;
    renderRecipes();
    $("#sidebar").removeClass("open");
    if (view !== "home") $(".recipes-section")[0].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setCategory(category) {
    activeCategory = category;
    $(".category-pill").removeClass("active").filter(`[data-category="${category}"]`).addClass("active");
    visibleCount = 6;
    renderRecipes();
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(function (favoriteId) { return favoriteId !== id; });
      showToast("Resep dihapus dari favorit.");
    } else {
      favorites.push(id);
      showToast("Resep ditambahkan ke favorit.");
    }
    saveData();
    renderRecipes();
    if (currentDetailId === id) updateDetailFavoriteButton();
  }

  function openDetail(id) {
    const recipe = getRecipe(id);
    if (!recipe) return;
    currentDetailId = id;
    const photo = safeImageUrl(recipe.photo);
    $("#detailImage").html(photo ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(recipe.name)}">` : `<span>${escapeHtml(recipe.emoji || "🍽️")}</span>`);
    $("#detailCategory").text(recipe.category);
    $("#detailTime").text(`◷ ${recipe.time} menit`);
    $("#modalTitle").text(recipe.name);
    $("#detailDescription").text(recipe.description || "");
    $("#detailIngredients").html((recipe.ingredients || []).map(item => `<li>${escapeHtml(item)}</li>`).join(""));
    $("#detailSteps").html((recipe.steps || []).map(item => `<li>${escapeHtml(item)}</li>`).join(""));
    updateDetailFavoriteButton();
    $("#recipeModal").removeClass("hidden");
    $("body").css("overflow", "hidden");
  }

  function updateDetailFavoriteButton() {
    const saved = favorites.includes(currentDetailId);
    $("#detailFavorite").html(saved ? "♥ Tersimpan di favorit" : "♡ Simpan favorit");
    $("#detailFavorite").toggleClass("button-primary", saved).toggleClass("button-outline", !saved);
  }

  function openAddModal() {
    $("#recipeForm")[0].reset();
    $(".field-error").text("");
    $(".form-field input, .form-field textarea, .form-field select").removeClass("invalid");
    $("#addModal").removeClass("hidden");
    $("body").css("overflow", "hidden");
    setTimeout(() => $("#inputNamaResep").trigger("focus"), 100);
  }

  function closeModal(id) {
    $("#" + id).addClass("hidden");
    if ($(".modal-backdrop:not(.hidden)").length === 0) $("body").css("overflow", "");
  }

  function setFieldError(inputId, errorId, message) {
    $("#" + inputId).toggleClass("invalid", Boolean(message));
    $("#" + errorId).text(message || "");
  }

  function validateForm() {
    const name = $("#inputNamaResep").val().trim();
    const category = $("#inputKategori").val();
    const time = Number($("#inputWaktu").val());
    const photo = $("#inputFoto").val().trim();
    const description = $("#inputDeskripsi").val().trim();
    const ingredients = $("#inputBahan").val().split("\n").map(item => item.trim()).filter(Boolean);
    const steps = $("#inputLangkah").val().split("\n").map(item => item.trim()).filter(Boolean);
    let valid = true;

    const checks = [
      ["inputNamaResep", "nameError", name.length >= 3 ? "" : "Nama resep minimal 3 karakter."],
      ["inputKategori", "categoryError", category ? "" : "Silakan pilih kategori."],
      ["inputWaktu", "timeError", Number.isFinite(time) && time >= 1 && time <= 600 ? "" : "Waktu harus 1–600 menit."],
      ["inputDeskripsi", "descriptionError", description.length >= 10 ? "" : "Deskripsi minimal 10 karakter."],
      ["inputBahan", "ingredientsError", ingredients.length >= 1 ? "" : "Masukkan minimal satu bahan."],
      ["inputLangkah", "stepsError", steps.length >= 1 ? "" : "Masukkan minimal satu langkah."]
    ];

    checks.forEach(function (check) {
      setFieldError(check[0], check[1], check[2]);
      if (check[2]) valid = false;
    });

    const safePhoto = safeImageUrl(photo);
    const photoError = photo && !safePhoto ? "Masukkan URL foto yang valid (http/https)." : "";
    setFieldError("inputFoto", "photoError", photoError);
    if (photoError) valid = false;
    return valid;
  }

  $("#searchInput").on("input", function () {
    visibleCount = 6;
    renderRecipes();
    if ($(this).val().trim()) activeView = activeView === "favorites" || activeView === "my-recipes" ? activeView : "browse";
  });

  $(".nav-link").on("click", function () { setView($(this).data("view")); });
  $(".category-pill").on("click", function () { setCategory($(this).data("category")); });
  $("#clearFilters, #resetEmpty").on("click", function () {
    $("#searchInput").val("");
    setCategory("Semua");
    if (activeView === "favorites" || activeView === "my-recipes") setView("home");
  });
  $("#sortSelect").on("change", renderRecipes);
  $("#loadMoreBtn").on("click", function () { visibleCount += 6; renderRecipes(); });
  $("#recipeGrid").on("click", "[data-favorite]", function (event) {
    event.stopPropagation();
    toggleFavorite(String($(this).data("favorite")));
  });
  $("#recipeGrid").on("click", "[data-detail]", function () { openDetail(String($(this).data("detail"))); });
  $("#detailFavorite").on("click", function () { if (currentDetailId) toggleFavorite(currentDetailId); });
  $("#heroAddBtn, #sidebarAddBtn").on("click", openAddModal);
  $("#profileButton").on("click", function () { showToast("Halo! Selamat memasak bersama DapurKita."); });
  $(".feature-card").on("click", function () {
    const targetName = $(this).data("feature");
    const target = recipes.find(recipe => recipe.name.toLowerCase() === String(targetName).toLowerCase());
    if (target) openDetail(target.id);
    else {
      $("#searchInput").val(targetName);
      setView("browse");
      renderRecipes();
    }
  });
  $("#mobileMenu").on("click", function () { $("#sidebar").toggleClass("open"); });
  $(document).on("click", function (event) {
    if ($(window).width() <= 760 && $("#sidebar").hasClass("open") && !$(event.target).closest("#sidebar, #mobileMenu").length) {
      $("#sidebar").removeClass("open");
    }
  });
  $("[data-close]").on("click", function () { closeModal($(this).data("close")); });
  $(".modal-backdrop").on("click", function (event) {
    if (event.target === this) closeModal(this.id);
  });
  $(document).on("keydown", function (event) {
    if (event.key === "Escape") $(".modal-backdrop:not(.hidden)").each(function () { closeModal(this.id); });
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("#searchInput").trigger("focus");
    }
  });

  $("#recipeForm").on("submit", function (event) {
    event.preventDefault();
    if (!validateForm()) {
      const firstInvalid = $(".form-field .invalid").first();
      if (firstInvalid.length) firstInvalid.trigger("focus");
      showToast("Periksa kembali kolom yang ditandai.");
      return;
    }

    const photo = safeImageUrl($("#inputFoto").val().trim());
    const recipe = {
      id: "user-" + Date.now(),
      name: $("#inputNamaResep").val().trim(),
      category: $("#inputKategori").val(),
      time: Number($("#inputWaktu").val()),
      photo: photo,
      emoji: "🍽️",
      tone: recipes.length % 4,
      description: $("#inputDeskripsi").val().trim(),
      ingredients: $("#inputBahan").val().split("\n").map(item => item.trim()).filter(Boolean),
      steps: $("#inputLangkah").val().split("\n").map(item => item.trim()).filter(Boolean),
      author: "Kamu",
      createdAt: Date.now()
    };

    recipes.unshift(recipe);
    saveData();
    closeModal("addModal");
    activeView = "my-recipes";
    activeCategory = "Semua";
    $("#searchInput").val("");
    $(".nav-link").removeClass("active").filter('[data-view="my-recipes"]').addClass("active");
    $(".category-pill").removeClass("active").filter('[data-category="Semua"]').addClass("active");
    visibleCount = 6;
    renderRecipes();
    showToast("Resep berhasil disimpan. Terima kasih sudah berbagi!");
    $(".recipes-section")[0].scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Live validation: clear an error as soon as a field is corrected.
  $("#inputNamaResep").on("input", function () {
    setFieldError("inputNamaResep", "nameError", $(this).val().trim().length >= 3 ? "" : "Nama resep minimal 3 karakter.");
  });
  $("#inputKategori").on("change", function () {
    setFieldError("inputKategori", "categoryError", $(this).val() ? "" : "Silakan pilih kategori.");
  });
  $("#inputWaktu").on("input", function () {
    const value = Number($(this).val());
    setFieldError("inputWaktu", "timeError", value >= 1 && value <= 600 ? "" : "Waktu harus 1–600 menit.");
  });
  $("#inputDeskripsi").on("input", function () {
    setFieldError("inputDeskripsi", "descriptionError", $(this).val().trim().length >= 10 ? "" : "Deskripsi minimal 10 karakter.");
  });
  $("#inputBahan").on("input", function () {
    setFieldError("inputBahan", "ingredientsError", $(this).val().trim() ? "" : "Masukkan minimal satu bahan.");
  });
  $("#inputLangkah").on("input", function () {
    setFieldError("inputLangkah", "stepsError", $(this).val().trim() ? "" : "Masukkan minimal satu langkah.");
  });
  $("#inputFoto").on("input blur", function () {
    const value = $(this).val().trim();
    setFieldError("inputFoto", "photoError", value && !safeImageUrl(value) ? "Masukkan URL foto yang valid (http/https)." : "");
  });

  renderRecipes();
});
