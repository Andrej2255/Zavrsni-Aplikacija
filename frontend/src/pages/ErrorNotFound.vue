<template>
  <div class="gt-404">
    <div class="gt-404__badge"><q-icon name="fitness_center" size="26px" /></div>
    <div class="gt-404__code">404</div>
    <div class="text-h6 text-weight-bold">Ova stranica ne postoji</div>
    <div class="gt-muted q-mt-xs">Provjeri adresu ili se vrati na početnu.</div>
    <q-btn class="q-mt-lg" color="primary" unelevated icon="home" to="/" label="Natrag na Pregled" />
  </div>
</template>

<style scoped>
.gt-404 {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 24px;
  background:
    radial-gradient(900px 320px at 50% 0%, rgba(94, 59, 238, .12), transparent 60%),
    var(--gt-bg);
}
.gt-404__badge {
  width: 52px; height: 52px; border-radius: 15px;
  display: grid; place-items: center;
  background: var(--gt-brand-gradient); color: #fff;
  box-shadow: var(--gt-shadow-lg);
}
.gt-404__code {
  font-size: clamp(5rem, 18vw, 9rem);
  font-weight: 800; line-height: 1;
  letter-spacing: -.04em;
  background: var(--gt-brand-gradient);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 8px 0 4px;
}
</style>
