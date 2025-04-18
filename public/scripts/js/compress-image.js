const imageInput = document.getElementById("imageInput");
const qualityInput = document.getElementById("qualityInput");
const compressButton = document.getElementById("compressButton");
const originalImage = document.getElementById("originalImage");
const compressedImage = document.getElementById("compressedImage");
const downloadLink = document.getElementById("downloadLink");
const outputFormatSelect = document.getElementById("outputFormat");
const loadingMessage = document.getElementById("loadingMessage");

const roundedCornersCheckbox = document.getElementById(
  "roundedCornersCheckbox"
);
const cornerRadiusInput = document.getElementById("cornerRadiusInput");

imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 30 * 1024 * 1024) {
      alert("Image is too large. Maximum size is 30MB.");
      imageInput.value = "";
      originalImage.src = "";
      originalImage.classList.add("hidden");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      originalImage.src = e.target.result;
      originalImage.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

roundedCornersCheckbox.addEventListener("change", function () {
  cornerRadiusInput.disabled = !this.checked;
});

compressButton.addEventListener("click", async function () {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image before compressing.");
    return;
  }

  const quality = parseInt(qualityInput.value);
  if (isNaN(quality) || quality < 0 || quality > 100) {
    alert("Please enter a quality value between 0 and 100.");
    qualityInput.value = "75";
    return;
  }

  const outputFormat = outputFormatSelect.value;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("quality", quality);
  formData.append("format", outputFormat);

  formData.append("roundedCorners", roundedCornersCheckbox.checked);
  formData.append("cornerRadius", cornerRadiusInput.value);

  loadingMessage.classList.remove("hidden");
  compressButton.disabled = true;

  try {
    const response = await fetch("/compress", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`HTTP error: ${response.status} - ${errorMessage}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    compressedImage.src = imageUrl;
    compressedImage.classList.remove("hidden");
    downloadLink.href = imageUrl;
    downloadLink.classList.remove("hidden");

    const filename = file.name.split(".").slice(0, -1).join(".");
    downloadLink.download = `${filename}_compressed.${outputFormat}`;
  } catch (error) {
    console.error("Compression failed:", error);
    alert(error.message);
  } finally {
    loadingMessage.classList.add("hidden");
    compressButton.disabled = false;
  }
});
