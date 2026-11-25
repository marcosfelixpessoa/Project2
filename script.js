// Base de dados fornecida na atividade
const dadosPesquisa = {
  mediaNacionalDiaria: 4,
  alertaSaude: 6,
  sugestoes: [
    { limite: 2, mensagem: "Parabéns! Seu uso está equilibrado. Você tem mais tempo livre para hobbies e descanso." },
    { limite: 5, mensagem: "Atenção. Você está na média nacional, mas já gasta quase um dia inteiro da sua semana olhando para a tela." },
    { limite: 24, mensagem: "Cuidado! Seu uso é considerado muito alto. Isso pode afetar seu sono, foco e saúde mental. Que tal um detox digital?" }
  ]
};

const formulario = document.querySelector("#form-calculo");
const campoHoras = document.querySelector("#horas-diarias");
const estadoInicial = document.querySelector("#estado-inicial");
const conteudoResultado = document.querySelector("#conteudo-resultado");
const resultado = document.querySelector("#resultado");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const horasDiarias = Number(campoHoras.value);
  const valorInvalido = campoHoras.value.trim() === "" || !Number.isFinite(horasDiarias) || horasDiarias < 0 || horasDiarias > 24;

  if (valorInvalido) {
    mostrarErro("Digite um número entre 0 e 24 horas.");
    campoHoras.focus();
    return;
  }

  limparErro();
  calcularResultado(horasDiarias);
});

function calcularResultado(horasDiarias) {
  const horasSemana = horasDiarias * 7;
  const horasMes = horasDiarias * 30;
  const formatarHoras = (valor) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(valor);

  document.querySelector("#total-semanal").textContent = formatarHoras(horasSemana);
  document.querySelector("#total-mensal").textContent = formatarHoras(horasMes);

  mostrarComparacao(horasDiarias, horasSemana, formatarHoras);
  mostrarReflexao(horasDiarias);

  estadoInicial.hidden = true;
  conteudoResultado.hidden = false;
}

function mostrarComparacao(horasDiarias, horasSemana, formatarHoras) {
  let comparacao;
  const media = dadosPesquisa.mediaNacionalDiaria;

  if (horasDiarias > media) {
    comparacao = `Seu uso diário está <strong>acima da média de referência de ${media} horas por dia</strong>.`;
  } else if (horasDiarias === media) {
    comparacao = `Seu uso diário está <strong>na média de referência de ${media} horas por dia</strong>.`;
  } else {
    comparacao = `Seu uso diário está <strong>abaixo da média de referência de ${media} horas por dia</strong>.`;
  }

  const alerta = horasDiarias > dadosPesquisa.alertaSaude
    ? ` Você também ultrapassa o limite de alerta de ${dadosPesquisa.alertaSaude} horas por dia usado nesta atividade.`
    : "";

  document.querySelector("#comparacao").innerHTML = `Você passa <strong>${formatarHoras(horasSemana)} horas por semana</strong> nas redes sociais. ${comparacao}${alerta}`;
}

function mostrarReflexao(horasDiarias) {
  const sugestao = dadosPesquisa.sugestoes.find((item) => horasDiarias <= item.limite);
  const caixaReflexao = document.querySelector("#reflexao");

  caixaReflexao.textContent = sugestao.mensagem;
  caixaReflexao.className = "reflection";

  if (horasDiarias > dadosPesquisa.alertaSaude) {
    caixaReflexao.classList.add("high");
  } else if (horasDiarias > 2) {
    caixaReflexao.classList.add("alert");
  }
}

function mostrarErro(mensagem) {
  limparErro();
  const aviso = document.createElement("p");
  aviso.className = "error-message";
  aviso.id = "erro-horas";
  aviso.setAttribute("role", "alert");
  aviso.textContent = mensagem;
  formulario.append(aviso);
  resultado.setAttribute("aria-describedby", "erro-horas");
}

function limparErro() {
  document.querySelector("#erro-horas")?.remove();
  resultado.removeAttribute("aria-describedby");
}
