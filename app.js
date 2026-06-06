(function () {
  "use strict";

  const SESSION_KEY = "worker-form-session";
  const SESSION_MINUTES = 20;
  const WHATSAPP_PHONE = "9647514705065";
  const LOGIN_HASH = "8990c6d5e99971bf351720e72583f7ca5796e57ffb9de710ab05417da867f878";
  const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
  const MAX_FILE_SIZE = 12 * 1024 * 1024;
  const PDF_PAGE_WIDTH_PX = 794;
  const PDF_PAGE_HEIGHT_PX = 1123;
  const PDF_PAGE_WIDTH_MM = 210;
  const PDF_PAGE_HEIGHT_MM = 297;
  const PDF_CANVAS_MIN_SCALE = 3;
  const PDF_CANVAS_MAX_SCALE = 4;
  const QR_TARGET_SIZE_PX = 1024;
  const QR_QUIET_ZONE_MODULES = 4;

  const sections = [
    {
      id: "personal",
      title: "زانیاری کەسی",
      icon: "user",
      fields: [
        text("fullName", "ناوی تەواوی کرێکار", true, "ناوی سیانی یان چوارانی بنوسە", "ناوی کرێکار بە تەواوی بنوسە."),
        text("motherName", "ناوی دایک", true, "ناوی دایکی کرێکار بنوسە"),
        radio("gender", "ڕەگەز", true, ["نێر", "مێ"]),
        text("birthDate", "بەرواری لەدایکبوون", true, "ڕۆژ/مانگ/ساڵ"),
        text("birthPlace", "شوێنی لەدایکبوون", true, "شار یان شوێنی لەدایکبوون"),
        text("identityNumber", "ژمارەی ناسنامە یان پاسپۆرت", true, "ژمارەی ناسنامە یان پاسپۆرت"),
        select("maritalStatus", "باری خێزانی", true, ["تاک", "هاوسەرگیری کردوو", "جیابووەوە", "بێوەژن یان بێوەمێرد"]),
        text("mobile", "ژمارەی مۆبایل", true, "ژمارەی مۆبایل بە شێوەی دروست بنوسە"),
        text("secondMobile", "ژمارەی مۆبایلی دووەم", false, "ئەگەر هەبێت"),
        text("email", "ئیمەیڵ", false, "ئەگەر هەبێت", "", "email")
      ]
    },
    {
      id: "photo",
      title: "وێنەی کەسی",
      icon: "camera",
      fields: [
        fileField("profilePhoto", "وێنەی کەسی کرێکار", true, "وێنەیەکی ڕوون و فەرمی باربکە", "image/*", false, "photo")
      ]
    },
    {
      id: "address",
      title: "ناونیشان",
      icon: "map-pin",
      fields: [
        text("country", "وڵات", true, "وڵات"),
        text("governorate", "پارێزگا", true, "پارێزگا"),
        text("district", "قەزا", true, "قەزا"),
        text("subdistrict", "ناحیە", false, "ناحیە"),
        text("neighborhood", "گەڕەک", false, "گەڕەک"),
        text("street", "کۆڵان", false, "کۆڵان"),
        text("landmark", "نزیکترین خاڵی ناسراو", false, "نزیکترین خاڵی ناسراو"),
        area("fullAddress", "ناونیشانی تەواو", true, "ناونیشان بە وردی بنوسە", "تکایە ناونیشان بە وردی بنوسە بۆ ئەوەی بە ئاسانی بدۆزرێتەوە.")
      ]
    },
    {
      id: "work",
      title: "کار و پیشە",
      icon: "briefcase-business",
      fields: [
        text("currentJob", "ناوی پیشە یان کاری ئێستا", true, "پیشە یان کاری ئێستا"),
        text("specialty", "بوار/تایبەتمەندی کرێکار", true, "بوار یان تایبەتمەندی"),
        text("experienceYears", "ساڵانی ئەزموون", true, "بۆ نموونە: ٥ ساڵ"),
        radio("workedBefore", "ئایا پێشتر لە شوێنی تر کاری کردووە؟", false, ["بەڵێ", "نەخێر"]),
        text("previousWorkplace", "ناوی شوێنی کاری پێشوو", false, "ئەگەر هەبێت"),
        text("expectedSalary", "مووچەی داواکراو یان چاوەڕوانکراو", true, "بڕی مووچە"),
        text("availability", "دەتوانێت لە کام کاتانەدا کار بکات؟", true, "بۆ نموونە: بەیانی، ئێوارە، تەواوی ڕۆژ"),
        radio("nightShift", "ئایا دەتوانێت شەوانە کار بکات؟", false, ["بەڵێ", "نەخێر"]),
        radio("canRelocate", "ئایا دەتوانێت لە شار یان شوێنی تر کار بکات؟", false, ["بەڵێ", "نەخێر"]),
        area("skillsNotes", "تێبینی دەربارەی تواناکانی کرێکار", false, "ئەگەر ئەزموونی کارت هەیە، بە کورتی ڕوونی بکەوە")
      ]
    },
    {
      id: "education",
      title: "خوێندن و تواناکان",
      icon: "graduation-cap",
      fields: [
        select("educationLevel", "ئاستی خوێندن", true, ["نەخوێندەوار", "سەرەتایی", "ناوەندی", "ئامادەیی", "دبلۆم", "بەکالۆریۆس", "ماستەر یان زیاتر"]),
        text("degree", "بڕوانامە", false, "ناوی بڕوانامە"),
        checkbox("languages", "زمانەکان", false, ["کوردی", "عەرەبی", "ئینگلیزی", "هی تر"]),
        select("languageLevel", "ئاستی زمان", false, ["سەرەتایی", "مامناوەند", "باش", "زۆر باش"]),
        select("computerSkill", "توانای بەکارهێنانی کۆمپیوتەر", false, ["نییە", "سەرەتایی", "مامناوەند", "باش", "پیشەیی"]),
        area("training", "خول یان ڕاهێنانی پێشوو", false, "ناوی خول یان ڕاهێنان"),
        text("specialCertificate", "بڕوانامە یان بەڵگەنامەی تایبەت", false, "ئەگەر هەبێت")
      ]
    },
    {
      id: "health",
      title: "تەندروستی و ئاسایش",
      icon: "heart-pulse",
      fields: [
        radio("hasHealthIssue", "ئایا کرێکار کێشەی تەندروستی هەیە کە کاری لەسەر دەکات؟", true, ["بەڵێ", "نەخێر"]),
        radio("needsSupport", "ئایا پێویستی بە هاوکاری تایبەت هەیە؟", true, ["بەڵێ", "نەخێر"]),
        radio("physicalWork", "ئایا توانای کاری جەستەیی هەیە؟", true, ["بەڵێ", "نەخێر"]),
        area("healthNotes", "تێبینی تەندروستی", false, "ئەگەر پێویست بوو")
      ]
    },
    {
      id: "emergency",
      title: "پەیوەندی لە کاتی پێویست",
      icon: "phone-call",
      fields: [
        text("emergencyName", "ناوی کەسی نزیک", true, "ناوی کەسی نزیک"),
        text("emergencyRelation", "پەیوەندی بە کرێکار", true, "بۆ نموونە: برا، باوک، هاوسەر"),
        text("emergencyPhone", "ژمارەی مۆبایل", true, "ژمارەی مۆبایل"),
        area("emergencyAddress", "ناونیشان", false, "ئەگەر پێویست بوو")
      ]
    },
    {
      id: "documents",
      title: "بەڵگەنامەکان",
      icon: "folder-up",
      fields: [
        fileField("idDocument", "ناسنامە یان پاسپۆرت", false, "فایل یان وێنە باربکە", "image/*,application/pdf", true),
        fileField("nationalCard", "کارتی نیشتمانی", false, "ئەگەر هەبێت", "image/*,application/pdf", true),
        fileField("certificates", "بڕوانامەکان", false, "بڕوانامەکان باربکە", "image/*,application/pdf", true),
        fileField("trainingDocuments", "بەڵگەنامەی ڕاهێنان", false, "ئەگەر هەبێت", "image/*,application/pdf", true),
        fileField("otherDocuments", "هەر بەڵگەنامەیەکی تر", false, "فایلەکانی تر", "image/*,application/pdf", true),
        checkbox("workerConsent", "ڕەزامەندی کرێکار", true, ["ڕازیم زانیارییەکانم بۆ دروستکردنی فۆرمی PDF و ناردن بە WhatsApp بەکاربهێنرێت."]),
        area("internalNote", "تێبینی ناوخۆیی", false, "تێبینی وەرگر، بۆ نموونە: بەڵگەنامەکان تەواون یان ژمارە پشکنراوە"),
        checkbox("includeInternalNote", "پیشاندانی تێبینی ناوخۆیی", false, ["تێبینی ناوخۆیی لە PDF پیشان بدرێت"])
      ]
    }
  ];

  const fileState = {
    profilePhoto: null,
    idDocument: [],
    nationalCard: [],
    certificates: [],
    trainingDocuments: [],
    otherDocuments: []
  };

  let currentSection = 0;
  let dirty = false;
  let serial = makeSerial();
  let lastPdf = null;
  let sessionTimer = null;

  const el = {
    loginView: document.getElementById("login-view"),
    appView: document.getElementById("app-view"),
    loginForm: document.getElementById("login-form"),
    loginError: document.getElementById("login-error"),
    togglePassword: document.getElementById("toggle-password"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    stepNav: document.getElementById("step-nav"),
    progressText: document.getElementById("progress-text"),
    progressFill: document.getElementById("progress-fill"),
    assessmentButton: document.getElementById("assessment-button"),
    assessmentPanel: document.getElementById("assessment-panel"),
    workerForm: document.getElementById("worker-form"),
    formScreen: document.getElementById("form-screen"),
    previewScreen: document.getElementById("preview-screen"),
    previewContent: document.getElementById("preview-content"),
    previewButton: document.getElementById("preview-button"),
    editButton: document.getElementById("edit-button"),
    printButton: document.getElementById("print-button"),
    sendButton: document.getElementById("send-button"),
    prevSection: document.getElementById("prev-section"),
    nextSection: document.getElementById("next-section"),
    resetButton: document.getElementById("reset-button"),
    logoutButton: document.getElementById("logout-button"),
    serialPreview: document.getElementById("serial-preview"),
    connectionStatus: document.getElementById("connection-status"),
    sessionClock: document.getElementById("session-clock"),
    pdfStage: document.getElementById("pdf-stage"),
    successDialog: document.getElementById("success-dialog"),
    successMessage: document.getElementById("success-message"),
    downloadAgain: document.getElementById("download-again"),
    openWhatsapp: document.getElementById("open-whatsapp"),
    newForm: document.getElementById("new-form")
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    el.serialPreview.textContent = serial;
    renderStepNav();
    renderForm();
    bindEvents();
    updateProgress();
    updateConnectionStatus();
    if (isSessionValid()) {
      showApp();
    } else {
      showLogin();
    }
    refreshIcons();
  }

  function text(id, label, required, placeholder, hint, type) {
    return { kind: "input", id, label, required, placeholder, hint, type: type || "text" };
  }

  function area(id, label, required, placeholder, hint) {
    return { kind: "textarea", id, label, required, placeholder, hint, full: true };
  }

  function select(id, label, required, options) {
    return { kind: "select", id, label, required, options };
  }

  function radio(id, label, required, options) {
    return { kind: "radio", id, label, required, options, full: true };
  }

  function checkbox(id, label, required, options) {
    return { kind: "checkbox", id, label, required, options, full: true };
  }

  function fileField(id, label, required, hint, accept, multiple, mode) {
    return { kind: "file", id, label, required, hint, accept, multiple, mode, full: true };
  }

  function bindEvents() {
    el.loginForm.addEventListener("submit", handleLogin);
    el.togglePassword.addEventListener("click", togglePassword);
    el.logoutButton.addEventListener("click", logout);
    el.assessmentButton.addEventListener("click", toggleAssessment);
    el.previewButton.addEventListener("click", handlePreview);
    el.editButton.addEventListener("click", showForm);
    el.printButton.addEventListener("click", handlePrint);
    el.sendButton.addEventListener("click", handleSend);
    el.prevSection.addEventListener("click", () => setSection(currentSection - 1));
    el.nextSection.addEventListener("click", () => {
      if (currentSection === sections.length - 1) {
        handlePreview();
        return;
      }
      if (validateSection(currentSection)) {
        setSection(currentSection + 1);
      }
    });
    el.resetButton.addEventListener("click", () => {
      if (confirm("دڵنیایت دەتەوێت فۆرمەکە پاک بکەیتەوە؟")) {
        resetForm(true);
      }
    });

    el.workerForm.addEventListener("input", handleFormChange);
    el.workerForm.addEventListener("change", handleFormChange);
    el.workerForm.addEventListener("blur", (event) => {
      const field = event.target.closest("[data-field]");
      if (field) validateField(field.dataset.field, false);
    }, true);

    el.downloadAgain.addEventListener("click", () => {
      if (lastPdf) downloadBlob(lastPdf.blob, lastPdf.fileName);
    });
    el.openWhatsapp.addEventListener("click", () => openWhatsappMessage());
    el.newForm.addEventListener("click", () => {
      el.successDialog.close();
      resetForm(true);
      sessionStorage.removeItem(SESSION_KEY);
      showLogin();
    });

    window.addEventListener("online", updateConnectionStatus);
    window.addEventListener("offline", updateConnectionStatus);
    window.addEventListener("beforeunload", (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    });

    ["click", "keydown", "pointermove", "touchstart"].forEach((name) => {
      document.addEventListener(name, throttle(touchSession, 15000), { passive: true });
    });
  }

  function renderStepNav() {
    el.stepNav.innerHTML = sections.map((section, index) => `
      <button class="step-button${index === currentSection ? " active" : ""}" type="button" data-step="${index}">
        <i data-lucide="${section.icon}"></i>
        <span>${escapeHtml(section.title)}</span>
      </button>
    `).join("");

    el.stepNav.querySelectorAll(".step-button").forEach((button) => {
      button.addEventListener("click", () => setSection(Number(button.dataset.step)));
    });
  }

  function renderForm() {
    el.workerForm.innerHTML = sections.map((section, index) => `
      <section class="section-panel${index === currentSection ? " active" : ""}" data-section="${index}" aria-labelledby="${section.id}-title">
        <header class="section-head">
          <span class="section-icon" aria-hidden="true"><i data-lucide="${section.icon}"></i></span>
          <div>
            <p class="eyebrow">بەشی ${toKurdishNumber(index + 1)}</p>
            <h2 id="${section.id}-title">${escapeHtml(section.title)}</h2>
          </div>
        </header>
        <div class="section-body">
          ${section.fields.map(renderField).join("")}
        </div>
      </section>
    `).join("");

    bindFileInputs();
    setSection(currentSection);
  }

  function renderField(field) {
    if (field.kind === "file") return renderFileField(field);

    const full = field.full ? " full" : "";
    const required = field.required ? `<span class="required-mark">*</span>` : "";
    const hint = field.hint ? `<small class="hint">${escapeHtml(field.hint)}</small>` : "";
    const error = `<small class="field-error" data-error-for="${field.id}"></small>`;
    let control = "";

    if (field.kind === "input") {
      control = `<input id="${field.id}" name="${field.id}" type="${field.type}" placeholder="${escapeAttr(field.placeholder || "")}" ${field.required ? "required" : ""} />`;
    }
    if (field.kind === "textarea") {
      control = `<textarea id="${field.id}" name="${field.id}" rows="4" placeholder="${escapeAttr(field.placeholder || "")}" ${field.required ? "required" : ""}></textarea>`;
    }
    if (field.kind === "select") {
      control = `
        <select id="${field.id}" name="${field.id}" ${field.required ? "required" : ""}>
          <option value="">هەڵبژێرە</option>
          ${field.options.map((option) => `<option value="${escapeAttr(option)}">${escapeHtml(option)}</option>`).join("")}
        </select>`;
    }
    if (field.kind === "radio") {
      control = `
        <div class="radio-group" role="radiogroup" aria-labelledby="${field.id}-label">
          ${field.options.map((option, index) => `
            <label class="choice">
              <input type="radio" name="${field.id}" value="${escapeAttr(option)}" ${field.required && index === -1 ? "required" : ""} />
              <span>${escapeHtml(option)}</span>
            </label>
          `).join("")}
        </div>`;
    }
    if (field.kind === "checkbox") {
      control = `
        <div class="check-group" aria-labelledby="${field.id}-label">
          ${field.options.map((option) => `
            <label class="choice">
              <input type="checkbox" name="${field.id}" value="${escapeAttr(option)}" />
              <span>${escapeHtml(option)}</span>
            </label>
          `).join("")}
        </div>`;
    }

    return `
      <label class="field${full}" data-field="${field.id}">
        <span id="${field.id}-label">${escapeHtml(field.label)}${required}</span>
        ${control}
        ${hint}
        ${error}
      </label>
    `;
  }

  function renderFileField(field) {
    const required = field.required ? `<span class="required-mark">*</span>` : "";
    const multiple = field.multiple ? "multiple" : "";
    const capture = field.mode === "photo" ? "capture=\"user\"" : "";
    const preview = field.mode === "photo"
      ? `<div id="${field.id}-preview" class="photo-preview">وێنە</div>`
      : `<div id="${field.id}-list" class="file-list"></div>`;
    return `
      <div class="file-block${field.full ? " full" : ""}" data-field="${field.id}">
        <label for="${field.id}">${escapeHtml(field.label)}${required}</label>
        <div class="file-control" data-file-control="${field.id}">
          <span class="hint">${escapeHtml(field.hint || "")}</span>
          <input id="${field.id}" name="${field.id}" type="file" accept="${escapeAttr(field.accept)}" ${multiple} ${capture} />
          ${preview}
        </div>
        <small class="field-error" data-error-for="${field.id}"></small>
      </div>
    `;
  }

  function bindFileInputs() {
    getFileFields().forEach((field) => {
      const input = document.getElementById(field.id);
      input.addEventListener("change", () => handleFileChange(field, input));
    });
  }

  async function handleFileChange(field, input) {
    clearFieldError(field.id);
    const files = Array.from(input.files || []);
    if (!files.length) {
      if (field.mode === "photo") {
        fileState.profilePhoto = null;
        renderPhotoPreview();
      } else {
        fileState[field.id] = [];
        renderFileList(field.id);
      }
      validateField(field.id, false);
      return;
    }

    const sizeLimit = field.mode === "photo" ? MAX_PHOTO_SIZE : MAX_FILE_SIZE;
    const tooLarge = files.find((file) => file.size > sizeLimit);
    if (tooLarge) {
      input.value = "";
      setFieldError(field.id, `قەبارەی "${tooLarge.name}" زۆر گەورەیە.`);
      return;
    }

    if (field.mode === "photo") {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        input.value = "";
        setFieldError(field.id, "تکایە تەنها وێنە باربکە.");
        return;
      }
      fileState.profilePhoto = {
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: await imageFileToDataUrl(file, 1400, 0.92)
      };
      renderPhotoPreview();
    } else {
      fileState[field.id] = await Promise.all(files.map(async (file) => ({
        id: randomId(),
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        file,
        dataUrl: file.type.startsWith("image/") ? await imageFileToDataUrl(file, 1200, 0.84) : ""
      })));
      renderFileList(field.id);
    }
    validateField(field.id, false);
    updateProgress();
    if (!el.assessmentPanel.hidden) renderAssessment();
    refreshIcons();
  }

  function renderPhotoPreview() {
    const target = document.getElementById("profilePhoto-preview");
    if (!target) return;
    if (!fileState.profilePhoto) {
      target.innerHTML = "وێنە";
      return;
    }
    target.innerHTML = `<img src="${fileState.profilePhoto.dataUrl}" alt="وێنەی کەسی کرێکار" />`;
  }

  function renderFileList(fieldId) {
    const target = document.getElementById(`${fieldId}-list`);
    if (!target) return;
    const files = fileState[fieldId] || [];
    target.innerHTML = files.map((item) => `
      <div class="file-item" data-file-id="${item.id}">
        <span class="file-thumb" aria-hidden="true">
          ${item.dataUrl ? `<img src="${item.dataUrl}" alt="" />` : `<i data-lucide="${item.type === "application/pdf" ? "file-type-2" : "file"}"></i>`}
        </span>
        <span>
          <span class="file-name">${escapeHtml(item.name)}</span>
          <span class="file-meta">${escapeHtml(fileTypeLabel(item.type))} · ${formatBytes(item.size)}</span>
        </span>
        <button class="remove-file" type="button" aria-label="سڕینەوەی فایل" title="سڕینەوەی فایل">
          <i data-lucide="x"></i>
        </button>
      </div>
    `).join("");

    target.querySelectorAll(".remove-file").forEach((button) => {
      button.addEventListener("click", () => {
        const row = button.closest(".file-item");
        const id = row.dataset.fileId;
        fileState[fieldId] = fileState[fieldId].filter((file) => file.id !== id);
        const input = document.getElementById(fieldId);
        input.value = "";
        renderFileList(fieldId);
        validateField(fieldId, false);
        markDirty();
        updateProgress();
        if (!el.assessmentPanel.hidden) renderAssessment();
        refreshIcons();
      });
    });
  }

  async function handleLogin(event) {
    event.preventDefault();
    el.loginError.hidden = true;
    clearLoginErrors();

    const username = el.username.value.trim();
    const password = el.password.value;
    let hasError = false;

    if (!username) {
      setLoginFieldError("username", "ناوی بەکارهێنەر بنوسە.");
      hasError = true;
    }
    if (!password) {
      setLoginFieldError("password", "پاسۆرد بنوسە.");
      hasError = true;
    }
    if (hasError) return;

    const digest = await sha256(`${username}:${password}`);
    if (digest !== LOGIN_HASH) {
      el.loginError.textContent = "ناوی بەکارهێنەر یان پاسۆرد هەڵەیە";
      el.loginError.hidden = false;
      return;
    }

    createSession();
    el.password.value = "";
    showApp();
  }

  function togglePassword() {
    const isPassword = el.password.type === "password";
    el.password.type = isPassword ? "text" : "password";
    el.togglePassword.setAttribute("aria-label", isPassword ? "شاردنەوەی پاسۆرد" : "پیشاندانی پاسۆرد");
    el.togglePassword.innerHTML = `<i data-lucide="${isPassword ? "eye-off" : "eye"}"></i>`;
    refreshIcons();
  }

  function showLogin() {
    el.appView.hidden = true;
    el.loginView.hidden = false;
    stopSessionClock();
    refreshIcons();
  }

  function showApp() {
    el.loginView.hidden = true;
    el.appView.hidden = false;
    touchSession();
    startSessionClock();
    refreshIcons();
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    clearFormValuesOnly();
    clearLastPdf();
    serial = makeSerial();
    el.serialPreview.textContent = serial;
    dirty = false;
    showLogin();
  }

  function createSession() {
    const expiresAt = Date.now() + SESSION_MINUTES * 60 * 1000;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expiresAt }));
  }

  function touchSession() {
    if (el.appView.hidden || !isSessionValid()) return;
    createSession();
  }

  function isSessionValid() {
    try {
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      return Boolean(session && session.expiresAt && session.expiresAt > Date.now());
    } catch {
      return false;
    }
  }

  function startSessionClock() {
    stopSessionClock();
    updateSessionClock();
    sessionTimer = window.setInterval(updateSessionClock, 1000);
  }

  function stopSessionClock() {
    if (sessionTimer) window.clearInterval(sessionTimer);
    sessionTimer = null;
  }

  function updateSessionClock() {
    if (!isSessionValid()) {
      logout();
      return;
    }
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    const ms = Math.max(0, session.expiresAt - Date.now());
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    el.sessionClock.querySelector("span").textContent = `${pad(minutes)}:${pad(seconds)}`;
  }

  function setSection(index) {
    currentSection = Math.min(Math.max(index, 0), sections.length - 1);
    document.querySelectorAll(".section-panel").forEach((panel) => {
      panel.classList.toggle("active", Number(panel.dataset.section) === currentSection);
    });
    el.stepNav.querySelectorAll(".step-button").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.step) === currentSection);
    });
    el.prevSection.disabled = currentSection === 0;
    el.nextSection.innerHTML = currentSection === sections.length - 1
      ? `<i data-lucide="eye"></i> پێشبینین`
      : `دواتر <i data-lucide="chevron-left"></i>`;
    updateProgress();
    refreshIcons();
  }

  function validateSection(index) {
    let ok = true;
    sections[index].fields.forEach((field) => {
      if (!validateField(field.id, false)) ok = false;
    });
    updateStepErrors();
    return ok;
  }

  function validateAll() {
    let firstInvalidSection = -1;
    sections.forEach((section, index) => {
      section.fields.forEach((field) => {
        const ok = validateField(field.id, false);
        if (!ok && firstInvalidSection === -1) firstInvalidSection = index;
      });
    });
    updateStepErrors();
    if (firstInvalidSection !== -1) {
      setSection(firstInvalidSection);
      return false;
    }
    return true;
  }

  function validateField(fieldId, silent) {
    const field = findField(fieldId);
    if (!field) return true;

    const value = getFieldValue(field);
    let message = "";

    if (field.required) {
      const isEmpty = Array.isArray(value) ? value.length === 0 : !String(value || "").trim();
      if (isEmpty) message = "ئەم خانەیە پێویستە.";
    }

    if (!message && field.id === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "ئیمەیڵەکە بە شێوەی دروست بنوسە.";
    }

    if (!message && ["mobile", "secondMobile", "emergencyPhone"].includes(field.id) && value) {
      const normalized = normalizeDigits(value).replace(/\s+/g, "");
      if (!/^\+?\d{8,16}$/.test(normalized)) {
        message = "ژمارەی مۆبایل بە شێوەی دروست بنوسە.";
      }
    }

    if (!message && field.id === "birthDate" && value && !isValidKurdishDate(value)) {
      message = "بەروار بە شێوەی ڕۆژ/مانگ/ساڵ بنوسە، بۆ نموونە 01/01/1990.";
    }

    if (!message && field.id === "experienceYears" && value && !isPlainNumber(value, true)) {
      message = "ساڵانی ئەزموون دەبێت ژمارە بێت.";
    }

    if (!message && field.id === "expectedSalary" && value && !isPlainNumber(value, false)) {
      message = "مووچە دەبێت بە ژمارە بنووسرێت.";
    }

    if (!message && field.kind === "file" && field.mode === "photo" && fileState.profilePhoto && !fileState.profilePhoto.type.startsWith("image/")) {
      message = "تکایە وێنەیەکی دروست باربکە.";
    }

    if (!silent) {
      if (message) setFieldError(field.id, message);
      else clearFieldError(field.id);
    }
    return !message;
  }

  function updateStepErrors() {
    sections.forEach((section, index) => {
      const hasError = section.fields.some((field) => {
        const wrapper = el.workerForm.querySelector(`[data-field="${field.id}"]`);
        return wrapper && wrapper.classList.contains("invalid");
      });
      const button = el.stepNav.querySelector(`[data-step="${index}"]`);
      if (button) button.classList.toggle("has-error", hasError);
    });
  }

  function setFieldError(fieldId, message) {
    const wrapper = el.workerForm.querySelector(`[data-field="${fieldId}"]`);
    const error = el.workerForm.querySelector(`[data-error-for="${fieldId}"]`);
    const fileControl = el.workerForm.querySelector(`[data-file-control="${fieldId}"]`);
    if (wrapper) wrapper.classList.add("invalid");
    if (fileControl) fileControl.classList.add("invalid");
    if (error) error.textContent = message;
  }

  function clearFieldError(fieldId) {
    const wrapper = el.workerForm.querySelector(`[data-field="${fieldId}"]`);
    const error = el.workerForm.querySelector(`[data-error-for="${fieldId}"]`);
    const fileControl = el.workerForm.querySelector(`[data-file-control="${fieldId}"]`);
    if (wrapper) wrapper.classList.remove("invalid");
    if (fileControl) fileControl.classList.remove("invalid");
    if (error) error.textContent = "";
  }

  function clearLoginErrors() {
    ["username", "password"].forEach((name) => {
      setLoginFieldError(name, "");
    });
  }

  function setLoginFieldError(name, message) {
    const error = document.querySelector(`[data-error-for="${name}"]`);
    const wrapper = document.getElementById(name).closest(".field");
    if (error) error.textContent = message;
    if (wrapper) wrapper.classList.toggle("invalid", Boolean(message));
  }

  function handlePreview() {
    if (!validateAll()) return;
    buildPreview();
    showPreview();
  }

  function showPreview() {
    el.formScreen.classList.remove("active");
    el.previewScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    refreshIcons();
  }

  function showForm() {
    el.previewScreen.classList.remove("active");
    el.formScreen.classList.add("active");
    refreshIcons();
  }

  async function handlePrint() {
    if (!validateAll()) {
      showForm();
      return;
    }
    const oldText = el.printButton.innerHTML;
    el.printButton.disabled = true;
    el.printButton.innerHTML = `<i data-lucide="loader-circle"></i> ئامادەکردنی چاپ`;
    refreshIcons();
    try {
      const data = collectData();
      await waitForFonts();
      el.pdfStage.innerHTML = "";
      const pages = buildPdfPages(data);
      el.pdfStage.innerHTML = "";
      pages.forEach((page) => el.pdfStage.appendChild(page));
      await waitForPdfAssets(el.pdfStage);
      await nextFrame();
      window.print();
    } finally {
      window.setTimeout(() => {
        el.pdfStage.innerHTML = "";
      }, 500);
      el.printButton.disabled = false;
      el.printButton.innerHTML = oldText;
      refreshIcons();
    }
  }

  async function handleSend() {
    if (!validateAll()) {
      showForm();
      return;
    }

    const oldText = el.sendButton.innerHTML;
    el.sendButton.disabled = true;
    el.sendButton.innerHTML = `<i data-lucide="loader-circle"></i> دروستکردنی PDF`;
    refreshIcons();

    try {
      const data = collectData();
      const blob = await createPdf(data);
      const fileName = `worker-form-${serial}.pdf`;
      setLastPdf(blob, fileName);
      const shared = await handoffToWhatsapp(blob, fileName);
      clearLastPdf();
      dirty = false;
      clearFormValuesOnly();
      serial = makeSerial();
      el.serialPreview.textContent = serial;
      setSection(0);
      showForm();
      showSuccess(shared);
      sessionStorage.removeItem(SESSION_KEY);
      showLogin();
    } catch (error) {
      console.error(error);
      alert("PDF دروست نەبوو. تکایە دووبارە هەوڵ بدەوە.");
    } finally {
      el.sendButton.disabled = false;
      el.sendButton.innerHTML = oldText;
      refreshIcons();
    }
  }

  function buildPreview() {
    const data = collectData();
    el.previewContent.innerHTML = renderPreview(data);
  }

  function collectData() {
    return {
      serial,
      createdAt: new Date(),
      sections: sections.map((section) => ({
        id: section.id,
        title: section.title,
        fields: section.fields.map((field) => ({
          id: field.id,
          label: field.label,
          kind: field.kind,
          mode: field.mode,
          full: field.full,
          value: getFieldValue(field)
        }))
      })),
      photo: fileState.profilePhoto
    };
  }

  function getFieldValue(field) {
    if (field.kind === "file") {
      if (field.mode === "photo") return fileState.profilePhoto ? fileState.profilePhoto.name : "";
      return (fileState[field.id] || []).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: file.dataUrl || ""
      }));
    }
    if (field.kind === "radio") {
      const checked = el.workerForm.querySelector(`input[name="${field.id}"]:checked`);
      return checked ? checked.value : "";
    }
    if (field.kind === "checkbox") {
      return Array.from(el.workerForm.querySelectorAll(`input[name="${field.id}"]:checked`)).map((input) => input.value);
    }
    const input = document.getElementById(field.id);
    return input ? input.value.trim() : "";
  }

  function renderPreview(data) {
    const photoHtml = data.photo
      ? `<img class="preview-photo" src="${data.photo.dataUrl}" alt="وێنەی کەسی کرێکار" />`
      : `<span class="preview-value">نەبارکراوە</span>`;

    const cards = data.sections.map((section) => {
      const rows = section.fields.map((field) => {
        const value = previewValue(field.value);
        const full = field.full || field.kind === "file" ? " full" : "";
        const valueHtml = field.mode === "photo"
          ? photoHtml
          : field.kind === "file"
            ? renderPreviewFiles(field.value)
            : escapeHtml(value);
        return `
          <div class="preview-row${full}">
            <span class="preview-label">${escapeHtml(field.label)}</span>
            <span class="preview-value">${valueHtml}</span>
          </div>
        `;
      }).join("");
      return `
        <article class="preview-card">
          <h3>${escapeHtml(section.title)}</h3>
          <div class="preview-grid">${rows}</div>
        </article>
      `;
    }).join("");

    return cards;
  }

  function renderPreviewFiles(files) {
    if (!files || !files.length) return `<span class="preview-value">نەبارکراوە</span>`;
    return `
      <div class="file-list">
        ${files.map((file) => `
          <div class="file-item">
            <span class="file-thumb" aria-hidden="true">
              ${file.dataUrl ? `<img src="${file.dataUrl}" alt="" />` : `<i data-lucide="${file.type === "application/pdf" ? "file-type-2" : "file"}"></i>`}
            </span>
            <span>
              <span class="file-name">${escapeHtml(file.name)}</span>
              <span class="file-meta">${escapeHtml(fileTypeLabel(file.type))} · ${formatBytes(file.size)}</span>
            </span>
          </div>
        `).join("")}
      </div>
    `;
  }

  async function createPdf(data) {
    await waitForFonts();
    el.pdfStage.innerHTML = "";
    const pdfPages = buildPdfPages(data);
    el.pdfStage.innerHTML = "";
    pdfPages.forEach((page) => el.pdfStage.appendChild(page));

    await waitForPdfAssets(el.pdfStage);
    await nextFrame();

    const pdf = new window.jspdf.jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const scale = getPdfCanvasScale();

    for (let index = 0; index < pdfPages.length; index += 1) {
      const canvas = await window.html2canvas(pdfPages[index], {
        scale,
        width: PDF_PAGE_WIDTH_PX,
        height: PDF_PAGE_HEIGHT_PX,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false
      });
      if (index > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, PDF_PAGE_WIDTH_MM, PDF_PAGE_HEIGHT_MM, undefined, "SLOW");
    }

    el.pdfStage.innerHTML = "";
    return pdf.output("blob");
  }

  function buildPdfPages(data) {
    const pages = [];
    const pdfData = normalizePdfData(data);
    let currentPage = createPdfPage(pdfData, true);
    let currentBody = currentPage.querySelector(".pdf-page-body");
    pages.push(currentPage);

    const startNewPage = () => {
      currentPage = createPdfPage(pdfData, false);
      currentBody = currentPage.querySelector(".pdf-page-body");
      pages.push(currentPage);
      return currentBody;
    };

    pdfData.sections.forEach((section) => {
      currentBody = appendPdfSection(section, currentBody, startNewPage);
    });

    const noticeSection = createPdfNoticeSection();
    currentBody = appendPdfElement(noticeSection, currentBody, startNewPage);

    const signatureSection = createSignatureSection();
    currentBody = appendPdfElement(signatureSection, currentBody, startNewPage);

    pages.forEach((page, index) => {
      const footer = page.querySelector(".pdf-page-footer");
      footer.innerHTML = `
        <span>زانیاری فۆرم لە داتابەیس، شوێنی هەڵگرتنی ناوخۆیی یان server هەڵنەگیراوە.</span>
        <span>پەڕە ${toKurdishNumber(index + 1)} لە ${toKurdishNumber(pages.length)}</span>
      `;
    });

    return pages;
  }

  function createPdfPage(data, includeHeader) {
    const page = document.createElement("article");
    page.className = "pdf-page";
    page.innerHTML = `
      ${includeHeader ? renderPdfHeader(data) : ""}
      <main class="pdf-page-body"></main>
      <footer class="pdf-page-footer"></footer>
    `;
    el.pdfStage.appendChild(page);
    return page;
  }

  function renderPdfHeader(data) {
    const photo = data.photo ? data.photo.dataUrl : "";
    const photoHtml = photo
      ? `<img class="pdf-photo" src="${photo}" alt="وێنەی کەسی کرێکار" />`
      : `<div class="pdf-photo"></div>`;
    const qrHtml = data.qrCode
      ? `<div class="pdf-qr"><img src="${data.qrCode}" alt="QR Code" /><span>QR Code ـی زانیاری سەرەکی کرێکار</span></div>`
      : `<div class="pdf-qr unavailable"><span>QR Code ئامادە نەبوو</span></div>`;

    return `
      <header class="pdf-header">
        <div class="pdf-title">
          <h1>فۆرمی زانیاری کرێکار</h1>
          <p>ژمارەی فۆرم: ${escapeHtml(data.serial)}</p>
          <p>بەروار و کات: ${escapeHtml(formatDateTime(data.createdAt))}</p>
        </div>
        ${qrHtml}
        ${photoHtml}
      </header>
    `;
  }

  function appendPdfSection(section, body, startNewPage) {
    let sectionNode = createPdfSection(section, section.fields);
    const previousCount = body.children.length;
    body.appendChild(sectionNode);

    if (!pdfBodyOverflows(body)) return body;

    body.removeChild(sectionNode);
    if (previousCount > 0) {
      body = startNewPage();
      body.appendChild(sectionNode);
      if (!pdfBodyOverflows(body)) return body;
      body.removeChild(sectionNode);
    }

    return appendPdfSectionRows(section, body, startNewPage);
  }

  function appendPdfSectionRows(section, body, startNewPage) {
    let sectionNode = createPdfSection(section, []);
    let grid = sectionNode.querySelector(".pdf-grid");
    body.appendChild(sectionNode);

    section.fields.forEach((field) => {
      const row = createPdfRow(field);
      grid.appendChild(row);
      if (!pdfBodyOverflows(body)) return;

      grid.removeChild(row);
      if (grid.children.length === 0 && body.children.length === 1) {
        grid.appendChild(row);
        return;
      }

      if (grid.children.length === 0) {
        body.removeChild(sectionNode);
      }

      body = startNewPage();
      sectionNode = createPdfSection(section, []);
      sectionNode.classList.add("continued");
      grid = sectionNode.querySelector(".pdf-grid");
      body.appendChild(sectionNode);
      grid.appendChild(row);
    });
    return body;
  }

  function appendPdfElement(node, body, startNewPage) {
    body.appendChild(node);
    if (!pdfBodyOverflows(body)) return body;
    body.removeChild(node);
    body = startNewPage();
    body.appendChild(node);
    return body;
  }

  function createPdfSection(section, fields) {
    const node = document.createElement("section");
    node.className = "pdf-section";
    node.innerHTML = `
      <h2>${escapeHtml(section.title)}</h2>
      <div class="pdf-grid"></div>
    `;
    const grid = node.querySelector(".pdf-grid");
    fields.forEach((field) => grid.appendChild(createPdfRow(field)));
    return node;
  }

  function createPdfRow(field) {
    const row = document.createElement("div");
    row.className = `pdf-row${field.full || field.kind === "file" ? " full" : ""}`;
    row.innerHTML = `
      <span class="pdf-label">${escapeHtml(field.label)}</span>
      <span class="pdf-value">${renderPdfFieldValue(field)}</span>
    `;
    return row;
  }

  function createPdfNoticeSection() {
    const node = document.createElement("section");
    node.className = "pdf-section pdf-notice";
    node.innerHTML = `
      <h2>تێبینی پاراستنی داتا</h2>
      <div class="pdf-grid">
        <div class="pdf-row full">
          <span class="pdf-value">ئەم PDF ـە لە ناو براوسەرەکەدا دروست کراوە. دوای ئامادەکردن، زانیاری فۆرم، وێنە و فایلە بارکراوەکان لە فۆرم پاک دەکرێنەوە و هیچ داتابەیسێک بەکار نەهاتووە.</span>
        </div>
      </div>
    `;
    return node;
  }

  function createSignatureSection() {
    const node = document.createElement("section");
    node.className = "pdf-section pdf-signatures";
    node.innerHTML = `
      <h2>واژۆ و پەنجەمۆر</h2>
      <div class="signature-grid">
        <div><span>واژۆی کرێکار</span></div>
        <div><span>پەنجەمۆری کرێکار</span></div>
        <div><span>واژۆی وەرگر</span></div>
        <div><span>بەرواری وەرگرتن</span></div>
      </div>
    `;
    return node;
  }

  function normalizePdfData(data) {
    const includeInternalNote = Boolean(findCollectedField(data, "includeInternalNote")?.value?.length);
    return {
      serial: data.serial,
      createdAt: data.createdAt,
      photo: data.photo,
      qrCode: createQrCodeDataUrl(buildQrPayload(data)),
      sections: data.sections
        .filter((section) => section.id !== "photo")
        .map((section) => ({
          ...section,
          fields: section.fields.filter((field) => shouldShowFieldInPdf(field, includeInternalNote))
        }))
        .filter((section) => section.fields.length > 0)
    };
  }

  function shouldShowFieldInPdf(field, includeInternalNote) {
    if (field.mode === "photo") return false;
    if (field.id === "includeInternalNote") return false;
    if (field.id === "internalNote") {
      return Boolean(includeInternalNote && String(field.value || "").trim());
    }
    if (field.required) return true;
    if (Array.isArray(field.value)) return field.value.length > 0;
    return Boolean(String(field.value || "").trim());
  }

  function renderPdfFieldValue(field) {
    if (field.kind === "file") {
      return renderPdfFiles(field.value);
    }
    return escapeHtml(pdfValue(field.value));
  }

  function renderPdfFiles(files) {
    if (!files || !files.length) return "—";
    return `
      <div class="pdf-files">
        ${files.map((file) => `
          <div class="pdf-file">
            <span class="pdf-file-thumb">${file.dataUrl ? `<img src="${file.dataUrl}" alt="" />` : `<span>${escapeHtml(fileExtension(file.name))}</span>`}</span>
            <span>
              <span class="pdf-file-name">${escapeHtml(file.name)}</span>
              <span class="pdf-file-meta">${escapeHtml(fileTypeLabel(file.type))} · ${formatBytes(file.size)}</span>
            </span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function pdfValue(value) {
    if (Array.isArray(value)) {
      if (!value.length) return "—";
      return value.map((item) => typeof item === "string" ? item : item.name).join("، ");
    }
    return value ? String(value) : "—";
  }

  function pdfBodyOverflows(body) {
    return body.scrollHeight > body.clientHeight + 2;
  }

  function buildQrPayload(data) {
    const value = (id, maxLength, normalizeNumber) => qrFieldValue(data, id, maxLength, normalizeNumber);
    const address = [
      value("governorate", 28),
      value("district", 28),
      value("neighborhood", 34)
    ].filter(Boolean).join(" / ");
    const lines = [
      ["FORM", data.serial],
      ["DATE", formatQrDateTime(data.createdAt)],
      ["NAME", value("fullName", 44)],
      ["MOTHER", value("motherName", 34)],
      ["MOBILE", value("mobile", 24, true)],
      ["ID", value("identityNumber", 34, true)],
      ["DOB", value("birthDate", 24, true)],
      ["ADDR", limitQrText(address, 78)],
      ["JOB", value("currentJob", 42)],
      ["EXP", value("experienceYears", 20, true)],
      ["CONTACT", value("emergencyName", 42)],
      ["CONTACT_MOBILE", value("emergencyPhone", 24, true)]
    ];
    return lines
      .filter(([, fieldValue]) => fieldValue)
      .map(([label, fieldValue]) => `${label}:${fieldValue}`)
      .join("\n");
  }

  function createQrCodeDataUrl(payload) {
    if (!window.qrcode) return "";
    try {
      enableQrUtf8();
      const qr = window.qrcode(0, "H");
      qr.addData(payload, "Byte");
      qr.make();
      return createQrSvgDataUrl(qr);
    } catch {
      try {
        enableQrUtf8();
        const qr = window.qrcode(0, "Q");
        qr.addData(compactQrPayload(payload), "Byte");
        qr.make();
        return createQrSvgDataUrl(qr);
      } catch {
        return "";
      }
    }
  }

  function qrFieldValue(data, fieldId, maxLength, normalizeNumber) {
    const field = findCollectedField(data, fieldId);
    if (!field) return "";
    let value = field.value;
    if (Array.isArray(value)) {
      value = value.map((item) => typeof item === "string" ? item : item.name).join(", ");
    }
    value = String(value || "").replace(/\s+/g, " ").trim();
    if (normalizeNumber) value = normalizeDigits(value);
    return limitQrText(value, maxLength);
  }

  function limitQrText(value, maxLength) {
    const text = String(value || "").trim();
    if (!maxLength || text.length <= maxLength) return text;
    return `${text.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
  }

  function compactQrPayload(payload) {
    return payload
      .split("\n")
      .map((line) => limitQrText(line, 80))
      .join("\n")
      .slice(0, 700);
  }

  function enableQrUtf8() {
    if (window.qrcode.stringToBytesFuncs && window.qrcode.stringToBytesFuncs["UTF-8"]) {
      window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs["UTF-8"];
    }
  }

  function createQrSvgDataUrl(qr) {
    const modules = qr.getModuleCount();
    const cellSize = Math.max(8, Math.ceil(QR_TARGET_SIZE_PX / (modules + QR_QUIET_ZONE_MODULES * 2)));
    const margin = cellSize * QR_QUIET_ZONE_MODULES;
    const svg = qr.createSvgTag({ cellSize, margin });
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function findCollectedField(data, fieldId) {
    return data.sections.flatMap((section) => section.fields).find((field) => field.id === fieldId);
  }

  async function handoffToWhatsapp(blob, fileName) {
    const message = whatsappMessage();
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "فۆرمی زانیاری کرێکار",
          text: message
        });
        return true;
      } catch (error) {
        if (error.name !== "AbortError") console.warn(error);
      }
    }

    downloadBlob(blob, fileName);
    openWhatsappMessage();
    return false;
  }

  function showSuccess(shared) {
    el.downloadAgain.hidden = true;
    el.successMessage.textContent = shared
      ? "فایلەکە بە share sheet نێردرا. زانیاری فۆرم لە ناو وێبسایتەکەدا تۆمار نەکرا."
      : "PDF دابەزێنرا. تکایە لە WhatsApp فایلە دابەزێنراوەکە هاوپێچ بکە و بینێرە. زانیاری فۆرم لە ناو وێبسایتەکەدا تۆمار نەکرا.";
    if (!el.successDialog.open) el.successDialog.showModal();
    refreshIcons();
  }

  function setLastPdf(blob, fileName) {
    if (lastPdf && lastPdf.url) URL.revokeObjectURL(lastPdf.url);
    lastPdf = {
      blob,
      fileName,
      url: URL.createObjectURL(blob)
    };
  }

  function downloadBlob(blob, fileName) {
    const url = lastPdf && lastPdf.blob === blob ? lastPdf.url : URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    if (!lastPdf || lastPdf.blob !== blob) URL.revokeObjectURL(url);
  }

  function openWhatsappMessage() {
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function whatsappMessage() {
    return "سڵاو، ئەمە فۆرمی زانیاری کرێکارە. تکایە فایلە PDF ـەکە ببینە.";
  }

  function resetForm(makeNewSerial) {
    clearFormValuesOnly();
    clearLastPdf();
    if (makeNewSerial) {
      serial = makeSerial();
      el.serialPreview.textContent = serial;
    }
    dirty = false;
    setSection(0);
    showForm();
  }

  function clearFormValuesOnly() {
    el.workerForm.reset();
    fileState.profilePhoto = null;
    getFileFields().forEach((field) => {
      if (field.mode !== "photo") fileState[field.id] = [];
      clearFieldError(field.id);
    });
    sections.flatMap((section) => section.fields).forEach((field) => clearFieldError(field.id));
    renderPhotoPreview();
    getFileFields().forEach((field) => {
      if (field.mode !== "photo") renderFileList(field.id);
    });
    el.previewContent.innerHTML = "";
  }

  function clearLastPdf() {
    if (lastPdf && lastPdf.url) URL.revokeObjectURL(lastPdf.url);
    lastPdf = null;
  }

  function updateConnectionStatus() {
    const online = navigator.onLine;
    el.connectionStatus.classList.toggle("offline", !online);
    el.connectionStatus.innerHTML = `
      <i data-lucide="${online ? "wifi" : "wifi-off"}"></i>
      <span>${online ? "ئۆنلاین" : "ئۆفلاین"}</span>
    `;
    refreshIcons();
  }

  function findField(fieldId) {
    return sections.flatMap((section) => section.fields).find((field) => field.id === fieldId);
  }

  function getFileFields() {
    return sections.flatMap((section) => section.fields).filter((field) => field.kind === "file");
  }

  function markDirty() {
    dirty = true;
  }

  function handleFormChange() {
    markDirty();
    updateProgress();
    if (!el.assessmentPanel.hidden) renderAssessment();
  }

  function updateProgress() {
    const completed = sections.filter(isSectionComplete).length;
    const percent = Math.round((completed / sections.length) * 100);
    el.progressText.textContent = `${toKurdishNumber(completed)} لە ${toKurdishNumber(sections.length)} بەش تەواو کراوە`;
    el.progressFill.style.width = `${percent}%`;
  }

  function isSectionComplete(section) {
    const requiredFields = section.fields.filter((field) => field.required);
    if (!requiredFields.length) return true;
    return requiredFields.every((field) => validateField(field.id, true));
  }

  function toggleAssessment() {
    if (el.assessmentPanel.hidden) {
      renderAssessment();
      el.assessmentPanel.hidden = false;
    } else {
      el.assessmentPanel.hidden = true;
    }
    refreshIcons();
  }

  function renderAssessment() {
    const fields = sections.flatMap((section) => section.fields.map((field) => ({ ...field, sectionTitle: section.title })));
    const completeFields = fields.filter((field) => {
      const value = getFieldValue(field);
      return Array.isArray(value) ? value.length > 0 : Boolean(String(value || "").trim());
    });
    const emptyFields = fields.filter((field) => !field.required && !completeFields.some((complete) => complete.id === field.id));
    const invalidRequired = fields.filter((field) => field.required && !validateField(field.id, true));
    const uploadedFiles = getFileFields().reduce((count, field) => {
      if (field.mode === "photo") return count + (fileState.profilePhoto ? 1 : 0);
      return count + (fileState[field.id] || []).length;
    }, 0);

    el.assessmentPanel.innerHTML = `
      <div class="assessment-grid">
        ${assessmentItem("check-circle", "خانە تەواوەکان", completeFields.length)}
        ${assessmentItem("circle", "خانە بەتاڵە ناپێویستەکان", emptyFields.length)}
        ${assessmentItem("triangle-alert", "خانە پێویستە هەڵەدارەکان", invalidRequired.length)}
        ${assessmentItem("paperclip", "فایل و وێنەی بارکراو", uploadedFiles)}
      </div>
      <div class="assessment-details">
        <h3>خانە پێویستەکان</h3>
        ${invalidRequired.length
          ? `<ul>${invalidRequired.map((field) => `<li>${escapeHtml(field.sectionTitle)}: ${escapeHtml(field.label)}</li>`).join("")}</ul>`
          : `<p>هەموو خانە پێویستەکان ئامادەن.</p>`}
        <h3>دۆخی وێنەی کەسی</h3>
        <p>${fileState.profilePhoto ? "وێنەی کەسی بارکراوە." : "وێنەی کەسی هێشتا بارنەکراوە."}</p>
      </div>
    `;
    refreshIcons();
  }

  function assessmentItem(icon, label, value) {
    return `
      <div class="assessment-item">
        <i data-lucide="${icon}"></i>
        <span>${escapeHtml(label)}</span>
        <strong>${toKurdishNumber(value)}</strong>
      </div>
    `;
  }

  function previewValue(value) {
    if (Array.isArray(value)) {
      if (!value.length) return "نەنووسراوە";
      return value.map((item) => typeof item === "string" ? item : item.name).join("، ");
    }
    return value ? String(value) : "نەنووسراوە";
  }

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function imageFileToDataUrl(file, maxDimension, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
          const width = Math.max(1, Math.round(image.width * scale));
          const height = Math.max(1, Math.round(image.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        image.onerror = () => resolve(reader.result);
        image.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function waitForPdfAssets(root) {
    await waitForFonts();
    await waitForImages(root);
    await nextFrame();
  }

  async function waitForFonts() {
    if (!document.fonts) return;
    const sample = "فۆرمی زانیاری کرێکار";
    await Promise.all([
      document.fonts.load("400 16px 'Noto Sans Arabic'", sample),
      document.fonts.load("700 16px 'Noto Sans Arabic'", sample),
      document.fonts.load("800 18px 'Noto Kufi Arabic'", sample)
    ]);
    await document.fonts.ready;
  }

  async function waitForImages(root) {
    const images = Array.from(root.querySelectorAll("img"));
    await Promise.all(images.map(async (image) => {
      if (!image.complete) {
        await new Promise((resolve) => {
          image.onload = resolve;
          image.onerror = resolve;
        });
      }
      if (image.decode) {
        try {
          await image.decode();
        } catch {
          // The image is already loaded; keep going if decode is not available for its type.
        }
      }
    }));
  }

  function getPdfCanvasScale() {
    const ratio = window.devicePixelRatio || 1;
    return Math.min(PDF_CANVAS_MAX_SCALE, Math.max(PDF_CANVAS_MIN_SCALE, ratio));
  }

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function makeSerial() {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join("");
    const time = [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join("");
    return `WF-${stamp}-${time}-${Math.floor(100 + Math.random() * 900)}`;
  }

  function formatDateTime(date) {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    return toKurdishNumber(`${day}/${month}/${year} ${hour}:${minute}`);
  }

  function formatQrDateTime(date) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join("-") + ` ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 KB";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit += 1;
    }
    return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
  }

  function toKurdishNumber(number) {
    return String(number).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
  }

  function normalizeDigits(value) {
    return String(value)
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
      .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
  }

  function isValidKurdishDate(value) {
    const normalized = normalizeDigits(value).trim();
    const match = normalized.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (!match) return false;
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return year >= 1900
      && year <= new Date().getFullYear()
      && date.getFullYear() === year
      && date.getMonth() === month - 1
      && date.getDate() === day;
  }

  function isPlainNumber(value, allowDecimal) {
    const normalized = normalizeDigits(value).replace(/[,\s٬،]/g, "").trim();
    const pattern = allowDecimal ? /^\d+(\.\d+)?$/ : /^\d+$/;
    return pattern.test(normalized);
  }

  function fileTypeLabel(type) {
    if (!type) return "فایل";
    if (type === "application/pdf") return "PDF";
    if (type.startsWith("image/")) return "وێنە";
    return "فایل";
  }

  function fileExtension(name) {
    const part = String(name || "").split(".").pop();
    return part && part !== name ? part.slice(0, 5) : "FILE";
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function randomId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function throttle(fn, delay) {
    let last = 0;
    return function throttled() {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn();
      }
    };
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();
