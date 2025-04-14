const imageInput = document.getElementById("imageInput");
const qualityInput = document.getElementById("qualityInput");
const compressButton = document.getElementById("compressButton");
const originalImage = document.getElementById("originalImage");
const compressedImage = document.getElementById("compressedImage");
const downloadLink = document.getElementById("downloadLink");
const outputFormatSelect = document.getElementById("outputFormat");

imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      originalImage.src = e.target.result;
      originalImage.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

compressButton.addEventListener("click", async function () {
  const file = imageInput.files[0];
  if (!file) return alert("Please select an image.");

  const quality = qualityInput.value;
  const outputFormat = outputFormatSelect.value;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("quality", quality);
  formData.append("format", outputFormat);

  try {
    const response = await fetch("/compress", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

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
    alert("Failed to compress. Try again.");
  }
});
