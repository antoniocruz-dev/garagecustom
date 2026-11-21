/*! Garage Custom · © 2026 · adaptado de UPW-TORQUE-M3E6 */

// ===== Dados do negócio =====
const NEGOCIO = {
  whatsapp: '5594992114825', // número Garage Custom com DDI+DDD
  nome: 'Garage Custom',
  mensagemPadrao: 'Olá! Vim pelo site da Garage Custom.',
};

document.documentElement.classList.add('js');

const linkZap = (msg) => `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(msg || NEGOCIO.mensagemPadrao)}`;

// Links de WhatsApp: <a data-whatsapp="mensagem">
document.querySelectorAll('[data-whatsapp]').forEach((a) => {
  a.href = linkZap(a.dataset.whatsapp);
  a.target = '_blank';
  a.rel = 'noopener';
});

// Topo: fundo ao rolar e menu do celular
const topo = document.getElementById('topo');
const abrir = document.getElementById('abrir');
const aoRolar = () => topo.classList.toggle('is-rolou', window.scrollY > 20);
aoRolar();
window.addEventListener('scroll', aoRolar, { passive: true });
const fecharMenu = () => { topo.classList.remove('is-aberto'); abrir?.setAttribute('aria-expanded', 'false'); };
abrir?.addEventListener('click', () => {
  const aberto = topo.classList.toggle('is-aberto');
  abrir.setAttribute('aria-expanded', String(aberto));
});
document.querySelectorAll('#menu a').forEach((a) => a.addEventListener('click', fecharMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });

// Formulário de orçamento: monta a mensagem e abre o WhatsApp
const form = document.getElementById('form-orcamento');
const previa = document.getElementById('previa');
const erro = document.getElementById('form-erro');

const montar = () => {
  const d = Object.fromEntries(new FormData(form));
  // Mensagem base conforme solicitação
  let msg = `Olá! Quero um orçamento na Garage Custom.`;
  // Dados do carro
  if (d.carro || d.ano) {
    let carro = d.carro ? d.carro.trim() : '';
    if (d.ano && d.ano.trim()) carro += (carro ? ` (${d.ano.trim()})` : d.ano.trim());
    msg += `\nCarro: ${carro}`;
  }
  if (d.servico) msg += `\nServiço: ${d.servico}`;
  if (d.detalhe && d.detalhe.trim()) msg += `\nO que está acontecendo: ${d.detalhe.trim()}`;
  return msg;
};

if (form) {
  form.ano.addEventListener('input', () => { form.ano.value = form.ano.value.replace(/\D/g, '').slice(0, 4); });
  form.addEventListener('input', () => { previa.textContent = montar(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const faltando = ['carro', 'ano', 'servico'].filter((n) => !String(form[n].value).trim());
    form.querySelectorAll('.is-erro').forEach((el) => el.classList.remove('is-erro'));
    faltando.forEach((n) => form[n].classList.add('is-erro'));
    erro.hidden = faltando.length === 0;
    if (faltando.length) { form[faltando[0]].focus(); return; }
    window.open(linkZap(montar()), '_blank', 'noopener');
  });
}

// Revelar ao rolar e contar números
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const formata = (n) => n.toLocaleString('pt-BR');
const contar = (el) => {
  const ate = Number(el.dataset.ate || 0);
  if (reduzir) { el.textContent = formata(ate); return; }
  const t0 = performance.now();
  const passo = (t) => {
    const p = Math.min(1, (t - t0) / 1500);
    el.textContent = formata(Math.round(ate * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
};
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((itens) => {
    itens.forEach((it) => {
      if (!it.isIntersecting) return;
      it.target.classList.add('is-visivel');
      it.target.querySelectorAll?.('.conta').forEach(contar);
      io.unobserve(it.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  document.querySelectorAll('.revela').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.08}s`;
    io.observe(el);
  });
} else {
  document.querySelectorAll('.revela').forEach((el) => el.classList.add('is-visivel'));
}

document.getElementById('ano').textContent = new Date().getFullYear();
