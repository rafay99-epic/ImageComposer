const dropZone = document.getElementById("dropZone");
imageInput = document.getElementById("imageInput");

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("border-teal-600", "bg-teal-50");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("border-teal-600", "bg-teal-50");
  });
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    imageInput.files = files;

    const changeEvent = new Event("change");
    imageInput.dispatchEvent(changeEvent);
  }
});
