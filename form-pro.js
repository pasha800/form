(function () {
  "use strict";

  const DRAFT_KEY = "worker-form-pro-draft-v1";
  const toolbarId = "form-pro-toolbar";
  const form = document.getElementById("worker-form");
  const progressPanel = document.querySelector(".progress-panel");
  const previewButton = document.getElementById("preview-button");
  const resetButton = document.getElementById("reset-button");

  if (!form || !progressPanel || document.getElementById(toolbarId)) return;

  function collectValues() {
    const values = {};
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      if (!field.name || field.type === "file") return;
      if (field.type === "checkbox") {
        if (!values[field.name]) values[field.name] = [];
        if (field.checked) values[field.name].push(field.value);
        return;
      }
      if (field.type === "radio") {
        if (field.checked) values[field.name] = field.value;
        return;
      }
      values[field.name] = field.value;
    });
    return values;
  }

  function applyValues(values) {
    Object.entries(values || {}).forEach(([name, value]) => {
      const fields = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
      fields.forEach((field) => {
        if (field.type === "file") return;
        if (field.type === "checkbox") {
          field.checked = Array.isArray(value) && value.includes(field.value);
        } else if (field.type === "radio") {
          field.checked = field.value === value;
        } else {
          field.value = value || "";
        }
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  function saveDraft() {
    const payload = {
      savedAt: new Date().toISOString(),
      serial: document.getElementById("serial-preview")?.textContent || "",
      values: collectValues()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    setStatus("پاشەکەوت کرا");
  }

  function restoreDraft() {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      setStatus("هیچ draft ـێک نییە");
      return;
    }
    try {
      const payload = JSON.parse(raw);
      applyValues(payload.values);
      setStatus("Draft گەڕێندرایەوە");
    } catch {
      localStorage.removeItem(DRAFT_KEY);
      setStatus("Draft ـەکە خراب بوو و سڕایەوە");
    }
  }

  function exportJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      serial: document.getElementById("serial-preview")?.textContent || "worker-form",
      values: collectValues()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${payload.serial || "worker-form"}.json`.replace(/[^\w\-.]+/g, "-");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("JSON دابەزێندرا");
  }

  function setStatus(text) {
    const status = document.getElementById("form-pro-status");
    if (status) status.textContent = text;
  }

  function createToolbar() {
    const toolbar = document.createElement("section");
    toolbar.id = toolbarId;
    toolbar.className = "form-pro-toolbar";
    toolbar.setAttribute("aria-label", "ئامرازە خێراکانی فۆرم");
    toolbar.innerHTML = `
      <div>
        <strong>فۆڕمی پێشکەوتوو</strong><br />
        <small id="form-pro-status">Autosave چالاکە · Ctrl+S بۆ پاشەکەوت</small>
      </div>
      <div class="toolbar-actions">
        <button type="button" id="form-pro-save">پاشەکەوت</button>
        <button type="button" id="form-pro-restore">گەڕاندنەوەی draft</button>
        <button type="button" id="form-pro-export">Export JSON</button>
        <button type="button" id="form-pro-preview">پێشبینین</button>
      </div>
    `;
    progressPanel.insertAdjacentElement("afterend", toolbar);
    toolbar.querySelector("#form-pro-save")?.addEventListener("click", saveDraft);
    toolbar.querySelector("#form-pro-restore")?.addEventListener("click", restoreDraft);
    toolbar.querySelector("#form-pro-export")?.addEventListener("click", exportJson);
    toolbar.querySelector("#form-pro-preview")?.addEventListener("click", () => previewButton?.click());
  }

  let saveTimer = null;
  form.addEventListener("input", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 700);
  });
  form.addEventListener("change", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 700);
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && key === "s") {
      event.preventDefault();
      saveDraft();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      previewButton?.click();
    }
  });

  resetButton?.addEventListener("click", () => {
    setTimeout(() => {
      localStorage.removeItem(DRAFT_KEY);
      setStatus("Draft سڕایەوە");
    }, 300);
  });

  createToolbar();
})();
