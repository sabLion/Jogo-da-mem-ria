const placar = document.querySelector('#pontos');
const erros = document.querySelector('#erro');
const tabuleiro = document.querySelector("#tabuleiro");
const dificuldade = document.querySelector("#dificuldade");
const botaoReiniciar = document.querySelector("#reiniciar");

let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let travarCartas = false;
let pontuacao = 0;
let quantidadeErros = 0;

const modelos = document.querySelectorAll(".memoria");

function criarCartas() {
  tabuleiro.innerHTML = '';
  cartas = [];
  pontuacao = 0;
  quantidadeErros = 0;
  placar.innerText = "PONTUAÇÃO: 0";
  erros.innerText = "ERROS: 0";

  primeiraCarta = null;
  segundaCarta = null;

  let totalPares = 5;
  const nivel = dificuldade.value;
  if (nivel === 'medio') {
    totalPares = 8;
  } else if (nivel === 'dificil') {
    totalPares = 10;
  }

  for (let i = 0; i < totalPares; i++) {
    const modelo = modelos[i % modelos.length];
    for (let j = 0; j < 2; j++) {
      const carta = modelo.cloneNode(true);
      carta.classList.remove("modelo");
      carta.classList.remove("flip");
      carta.addEventListener("click", virarCarta);
      tabuleiro.appendChild(carta);
      cartas.push(carta);
    }
  }

  embaralharCartas();

  // ✅ Aplica grid de 5 por linha somente no nível difícil
  if (nivel === 'dificil') {
    tabuleiro.classList.add('dificil');
  } else {
    tabuleiro.classList.remove('dificil');
  }
}

function embaralharCartas() {
  cartas.forEach(carta => {
    let ordem = Math.floor(Math.random() * cartas.length);
    carta.style.order = ordem;
  });
}

function virarCarta() {
  if (travarCartas || this.classList.contains("flip")) {
    return;
  }

  this.classList.add("flip");

  if (!primeiraCarta) {
    primeiraCarta = this;
    return;
  }

  segundaCarta = this;
  verificarPar();
}

function verificarPar() {
  const par = primeiraCarta.dataset.card === segundaCarta.dataset.card;

  if (par) {
    pontuar();
  } else {
    desvirarCartas();
  }
}

function pontuar() {
  pontuacao++;
  placar.innerText = 'PONTUAÇÃO: ' + pontuacao;

  primeiraCarta.removeEventListener("click", virarCarta);
  segundaCarta.removeEventListener("click", virarCarta);
  resetarCartas();

  const nivel = dificuldade.value;

  let totalPares = nivel === 'medio' ? 8 : nivel === 'dificil' ? 10 : 5;

  if (pontuacao === totalPares) {
    setTimeout(() => {
      if (pontuacao > quantidadeErros) {
        placar.innerText = "VOCÊ GANHOU!!";
        placar.style.color = 'blue';
      } else if (pontuacao === quantidadeErros) {
        placar.innerText = "EMPATE!";
        placar.style.color = 'darkcyan';
      } else {
        placar.innerText = "VOCÊ PERDEU!!";
        placar.style.color = 'red';
      }
    }, 500);
  }
}

function desvirarCartas() {
  travarCartas = true;
  quantidadeErros++;
  erros.innerText = 'ERROS: ' + quantidadeErros;

  setTimeout(() => {
    primeiraCarta.classList.remove("flip");
    segundaCarta.classList.remove("flip");
    resetarCartas();
  }, 1000);
}

function resetarCartas() {
  [primeiraCarta, segundaCarta, travarCartas] = [null, null, false];
}

dificuldade.addEventListener("change", criarCartas);
botaoReiniciar.addEventListener("click", criarCartas);
window.addEventListener("load", criarCartas);