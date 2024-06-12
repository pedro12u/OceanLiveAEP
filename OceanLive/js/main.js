window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var btnBackToTop = document.getElementById("btnBackToTop");
  if (document.documentElement.scrollTop > 20 || window.pageYOffset > 20) {
    btnBackToTop.style.display = "block";
  } else {
    btnBackToTop.style.display = "none";
  }
}

function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
