window.onscroll = function () {
  debounceScrollFunction();
};

let scrollTimeout;
function debounceScrollFunction() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(scrollFunction, 100);
}

function scrollFunction() {
  var btnBackToTop = document.getElementById("btnBackToTop");
  if (btnBackToTop) {
    if (document.documentElement.scrollTop > 20 || window.pageYOffset > 20) {
      btnBackToTop.style.display = "block";
    } else {
      btnBackToTop.style.display = "none";
    }
  } else {
    console.warn('Elemento "btnBackToTop" não encontrado.');
  }
}

function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* TESTS MODAL */

function togglePopup() {
  const popup = document.getElementById("popup-1");
  if (popup) {
    popup.classList.toggle("active");
  } else {
    console.error('Elemento "popup-1" não encontrado.');
  }
}

/* CRUD */
const $form = document.querySelector("form");
const $listaDonate = document.querySelector(".listaDonate");
const emailError = document.getElementById("email-error");

let editando = false;
let editandoId = null;

function formatarValor(valor) {
  valor = valor.replace(/\D/g, "");
  valor = (valor / 100).toFixed(2) + "";
  valor = valor.replace(".", ",");
  valor = "R$" + valor;
  return valor;
}

function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document
  .querySelector('input[name="criaNome"]')
  .addEventListener("input", function (event) {
    this.value = this.value.replace(/[0-9]/g, "");
  });

document
  .querySelector('input[name="criaValor"]')
  .addEventListener("input", function (event) {
    this.value = formatarValor(this.value);
  });

document
  .querySelector('input[name="criaEmail"]')
  .addEventListener("input", function (event) {
    if (validarEmail(this.value)) {
      emailError.style.display = "none";
    } else {
      emailError.style.display = "block";
    }
  });

$form.addEventListener("submit", function (eventInfos) {
  eventInfos.preventDefault();
  if (!validateForm()) return;

  const $criaNome = document.querySelector('input[name="criaNome"]');
  const $criaEmail = document.querySelector('input[name="criaEmail"]');
  const $criaValor = document.querySelector('input[name="criaValor"]');
  const $pagamento = document.querySelector('select[name="pagamento"]');

  const htmlString = `
    <p data-id="${editando ? editandoId : Date.now()}">
      <strong>Doador:</strong> <span class="nome">${$criaNome.value}</span> <br>
      <strong>Email:</strong> <span class="email">${
        $criaEmail.value
      }</span> <br>
      <strong>Valor:</strong> <span class="valor">${
        $criaValor.value
      }</span> <br>
      <strong>Método:</strong> <span class="metodo">${$pagamento.value}</span>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
    </p>
  `;

  if ($listaDonate) {
    if ($listaDonate.style.padding === "0px") {
      $listaDonate.style.padding = "10px";
    }

    if ($listaDonate.style.border === "0px") {
      $listaDonate.style.border = "1px solid black";
    }

    if (editando) {
      document.querySelector(`p[data-id="${editandoId}"]`).remove();
      editando = false;
      editandoId = null;
    }

    $listaDonate.insertAdjacentHTML("afterbegin", htmlString);

    $criaNome.value = "";
    $criaEmail.value = "";
    $criaValor.value = "";
    $pagamento.value = "";
  } else {
    console.error(".listaDonate element not found");
  }
});

$listaDonate.addEventListener("click", function (event) {
  const target = event.target;
  const pElement = target.closest("p");
  if (!pElement) return;

  if (target.classList.contains("edit-btn")) {
    const id = pElement.getAttribute("data-id");

    const nome = pElement.querySelector(".nome").textContent.trim();
    const email = pElement.querySelector(".email").textContent.trim();
    const valor = pElement
      .querySelector(".valor")
      .textContent.trim()
      .replace("R$", "")
      .replace(",", ".");
    const metodo = pElement.querySelector(".metodo").textContent.trim();

    document.querySelector('input[name="criaNome"]').value = nome;
    document.querySelector('input[name="criaEmail"]').value = email;
    document.querySelector('input[name="criaValor"]').value = valor;
    document.querySelector('select[name="pagamento"]').value = metodo;

    editando = true;
    editandoId = id;

    togglePopup();
  } else if (target.classList.contains("delete-btn")) {
    pElement.remove();
  }
});

function validateForm() {
  let valid = true;
  const $criaNome = document.querySelector('input[name="criaNome"]');
  const $criaEmail = document.querySelector('input[name="criaEmail"]');
  const $criaValor = document.querySelector('input[name="criaValor"]');
  const $pagamento = document.querySelector('select[name="pagamento"]');

  if ($criaNome.value === "") {
    $criaNome.style.border = "1px solid red";
    valid = false;
  } else {
    $criaNome.style.border = "none";
  }

  if ($criaEmail.value === "" || !validarEmail($criaEmail.value)) {
    $criaEmail.style.border = "1px solid red";
    emailError.style.display = "block";
    valid = false;
  } else {
    $criaEmail.style.border = "none";
    emailError.style.display = "none";
  }

  if ($criaValor.value === "" || $criaValor.value === "R$0,00") {
    $criaValor.style.border = "1px solid red";
    valid = false;
  } else {
    $criaValor.style.border = "none";
  }

  if ($pagamento.value === "") {
    $pagamento.style.border = "1px solid red";
    valid = false;
  } else {
    $pagamento.style.border = "none";
  }

  return valid;
}
