document.addEventListener("DOMContentLoaded", function () {
  const apps = document.querySelectorAll(".app");
  let openWindows = [];
  let appsVisible = false;
  const ui = document.querySelector(".agumented-ui");

  apps.forEach((app) => {
    app.addEventListener("click", function (event) {
      event.preventDefault(); 

      const appName = app.querySelector('img').getAttribute('alt').trim().toLowerCase();

      const script = document.createElement("script");
      script.src = `./static/js/apps/${appName}.js`;
      script.onload = function () {
        if (typeof appContent === "function" && typeof appControls === "function" && typeof bottomNav === "function") {
          const content = appContent();
          const controls = appControls();
          const appNav = bottomNav();
          openApp(content, controls, appNav, appName);
          if (appName === 'tv') {
            tvHome();
          }
          if (appName === 'photos') {
            photoHome();
          }
        } else {
          console.error(
            `Function 'generateContent' not defined in ${appName}.js`
          );
        }
      };
      script.onerror = function () {
        console.error(`Error loading ${appName}.js`);
      };
      document.body.appendChild(script);

      function tvHome() {
        const homeButton = document.querySelector('.tv-sidebar .selected');
        homeButton.addEventListener('click', function() {
            const originalContent = appContent(); 
            const tvContent = document.querySelector(".tv-content");
            tvContent.innerHTML = originalContent;
            playMovie();
        });
      }

      function photoHome() {
        const homeButton = document.querySelector('.photo-sidebar .selected');
        const modal = document.querySelector('.modal-content');
        homeButton.addEventListener('click', function() {
            const originalContentString = appContent();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = originalContentString;
            const originalContent = tempDiv.querySelector(".photo-content"); 
            const photoContent = document.querySelector(".photo-content");
            photoContent.replaceWith(originalContent); 
            modal.style.width ="900px";
            openPhoto();
        });
      }
    });
    
  });

  function playMovie() {
    const movieImages = document.querySelectorAll(".tv-content .cards .row img");
    movieImages.forEach((img) => {
        img.addEventListener("click", function () {
            const videoSrc = img.getAttribute("alt"); 
            const tvContent = document.querySelector(".tv-content");
            tvContent.innerHTML = `<video src="${videoSrc}" controls autoplay></video>`;
        });
    });
  }

  function openPhoto() {
    const movieImages = document.querySelectorAll(".photo-content .row img");
    const modal = document.querySelector('.modal-content');
    movieImages.forEach((img) => {
        img.addEventListener("click", function () {
            const imgSrc = img.getAttribute("src"); 
            const photoContent = document.querySelector(".photo-content");
            photoContent.setAttribute('style', 'display: flex;');
            modal.setAttribute('style', 'width: fit-content !important;');
            photoContent.innerHTML = `<img style="object-fit: contain;width: 100%;height: 100%;" src="${imgSrc}"/>`;
        });
    });
  }

  function openApp(appContent, appControls, appNav, appName) {

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.style.zIndex = 10;
    document.body.appendChild(modal);
    ui.setAttribute("style", "display: none !important;");
    
    modal.innerHTML = '';
    
    // Append new content
    modal.innerHTML = `
        ${appControls}
        <div class="modal-content">
            <span class="close">&times;</span>
            ${appContent}
        </div>
        ${appNav}
    `;
    
    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", function () {
        closeModal(modal);
    });
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal(modal);
        }
    });

    if (appName === "tv") {
      playMovie();
    }

    if (appName === "photos") {
      openPhoto();
    }

    if (appName === "safari") {
      function openURLInSafari(url) {
          safariContent.innerHTML = `
              <iframe src="${url}" style="width: 100%; height: 100%; border: none;" ></iframe>
          `;
      }

      const safariContent = document.querySelector(".modal .modal-content .safari-content");
      const urlInput = document.getElementById("urlInput");
      console.log(safariContent);
      console.log(urlInput);
      
      document.body.insertAdjacentHTML("beforeend", safariContent);

      urlInput.addEventListener("keypress", function(event) {
          if (event.key === "Enter") {
          let url = urlInput.value;
          if (!url.includes("http")) {
              url = `https://www.bing.com/search?q=${encodeURIComponent(url)}`;
          }
          }
      });

      openURLInSafari('https://www.bing.com/search?q=jaykef');
    }

    if (appName === "mindfulness") {
      const content = document.querySelector('.modal .mf-content');
      const img = document.querySelector('.modal .mf-content .img1');
      let alpha = 0;
      let height = 100;
      
      setInterval(() => {
        if (alpha <= 78 && height <= 460) {
          alpha++;
          height+=4;
          content.style.backgroundColor = `rgba(9, 9, 9, ${alpha / 100})`;
          img.style.maxHeight = `${height}px`;
        }
      }, 100);

    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let perspective = 50;
    let initialWidth = modal.offsetWidth;
    let initialHeight = modal.offsetHeight;

    modal.addEventListener("mousedown", function (event) {
      if (event.detail === 2) {
        isDragging = true;
        startX = event.clientX - modal.offsetLeft;
        startY = event.clientY - modal.offsetTop;
        modal.classList.add("grabbed");
      } else {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialWidth = modal.offsetWidth;
        initialHeight = modal.offsetHeight;
      }
    });

    document.addEventListener("mousemove", function (event) {
      if (isDragging) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const newWidth = initialWidth + deltaX;
        const newHeight = initialHeight + deltaY;
        const x = event.clientX - startX;
        const y = event.clientY - startY;
        modal.style.left = x + "px";
        modal.style.top = y + "px";

        perspective = 100 + Math.sqrt(deltaX ** 2 + deltaY ** 2);

        modal.style.width = newWidth + "px";
        modal.style.height = newHeight + "px";
        modal.style.transform = `perspective(${perspective}px) rotateY(${
          deltaX / 10
        }deg) rotateX(${-deltaY / 10}deg)`;
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
      modal.classList.remove("dragging");
    });

    openWindows.push(modal);

    setTimeout(() => {
      modal.classList.add("show");
    }, 50);
  }

  function closeModal(modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
      document
        .querySelector(".agumented-ui")
        .setAttribute("style", "display: grid !important;");

      openWindows = openWindows.filter((window) => window !== modal);
    }, 300);
  }

  document.addEventListener("keydown", function (event) {
    if (openWindows.length > 0 && event.metaKey && !appsVisible) {
      ui.setAttribute("style", "display: grid !important; z-index: 999;backdrop-filter: blur(10px);");
      appsVisible = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (!event.metaKey && appsVisible) {
      document.querySelector(".agumented-ui").style.display = "none";
      appsVisible = false;
    }
  });
});
