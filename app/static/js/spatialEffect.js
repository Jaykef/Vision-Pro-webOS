const parallax = document.getElementById("parallax");
const rect = parallax.getBoundingClientRect();
const icons = document.getElementsByClassName("ui")[0];
const iconsRect = icons.getBoundingClientRect();
var pos = {
  x: 0,
  y: 0
};
var mousePos = {
  x: 0,
  y: 0
};
var iconPos = {
  x: 0,
  y: 0
}
var iconDesiredPos = {
  x: 0,
  y: 0
}
parallax.addEventListener("pointermove", function (e) {
  mousePos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
    
  iconDesiredPos = {
    x: (e.clientX - window.innerWidth / 2) - iconsRect.left,
    y: (e.clientY - window.innerHeight / 2) - iconsRect.top
  }
  
});
function render() {
  pos.x += easing(pos.x, mousePos.x, 0.01);
  pos.y += easing(pos.y, mousePos.y, 0.01);
  parallax.style.transformOrigin = `${pos.x}px ${pos.y}px`;
  parallax.style.transform = `scale(1.25)`;
  
  iconPos.x += easing(iconPos.x, iconDesiredPos.x / -10, 0.01);
  iconPos.y += easing(iconPos.y, iconDesiredPos.y / -10, 0.01);
  icons.style.transform = `translateX(${iconPos.x}px) translateY(${iconPos.y}px)`;
  
  requestAnimationFrame(render);
}
render();
function easing(a, b, speed) {
  return (b - a) * speed;
}

function webView() {
    var webview = document.createElement("webview");
    webview.src = "https://www.google.com";
    webview.style.width = "100%";
    webview.style.height = "100%";
    document.body.appendChild(webview);
}



