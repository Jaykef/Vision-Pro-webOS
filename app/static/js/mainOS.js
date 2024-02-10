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
    });
    
  });


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
            openURLInSafari(url);
            }
        });
    }

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let perspective = 50;
    let initialWidth = modal.offsetWidth;
    let initialHeight = modal.offsetHeight;

    modal.addEventListener("mousedown", function (event) {
      if (event.detail === 2) {
        // Check for double-click
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



