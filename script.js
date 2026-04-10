const header = document.querySelector(".site-header");
const reveals = document.querySelectorAll(".reveal");
const transparentLogos = document.querySelectorAll(".transparent-logo");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

reveals.forEach((element) => revealObserver.observe(element));

const cutOutDarkBackground = (image) => {
  const source = image.getAttribute("src");
  if (!source) {
    return;
  }

  const bitmap = new Image();
  bitmap.crossOrigin = "anonymous";
  bitmap.src = source;

  bitmap.addEventListener("load", () => {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.naturalWidth;
    canvas.height = bitmap.naturalHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.drawImage(bitmap, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const brightness = Math.max(red, green, blue);
      const average = (red + green + blue) / 3;
      const greenBias = green - Math.max(red, blue);

      if (brightness < 42 && average < 32) {
        data[index + 3] = 0;
      } else if (brightness < 70 && greenBias < 18) {
        data[index + 3] = Math.max(0, Math.min(255, (brightness - 42) * 7));
      }
    }

    context.putImageData(imageData, 0, 0);
    image.src = canvas.toDataURL("image/png");
  });
};

transparentLogos.forEach(cutOutDarkBackground);

const updateHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
