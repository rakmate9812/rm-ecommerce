<template>
  <div class="about">
    <h1>Rólunk</h1>
    <p>
      Üdvözöljük az e-kereskedelmi platformunkon! Elkötelezettek vagyunk amellett, hogy a legjobb termékeket és
      szolgáltatásokat nyújtsuk ügyfeleinknek.
    </p>
    <h2>Küldetésünk</h2>
    <p>
      Küldetésünk, hogy kiváló minőségű termékeket kínáljunk versenyképes áron, miközben kiemelkedő ügyfélszolgálatot
      biztosítunk.
    </p>
    <h2>Kapcsolat</h2>
    <p>
      Ha bármilyen kérdése van, keressen minket bizalommal a
      <a href="mailto:info@marcipetfood.hu">info@marcipetfood.hu</a> címen.
    </p>
    <h2>ÁSZF</h2>
    <p>
      Az általános szerződési feltételeinket letöltheti az alábbi linkre kattintva:
      <a class="download-link" href="/docs/aszf.pdf" target="_blank" rel="noopener" download> ÁSZF letöltése (PDF) </a>
    </p>
  </div>
</template>

<script>
// ...existing code...
</script>

<style scoped>
.about {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.about h1 {
  font-size: 2.5em;
  color: rgba(67, 127, 127);
}

.about h2 {
  font-size: 1.8em;
  color: #333;
  margin-top: 20px;
}

.about p {
  font-size: 1.2em;
  line-height: 1.6;
  color: #666;
}

.about a {
  color: #4a90e2;
  text-decoration: none;
}

.about a:hover {
  text-decoration: underline;
}

/* new: download link styling */
.download-link {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.35rem 0.6rem;
  background: rgba(67, 127, 127, 0.08);
  border: 1px solid rgba(67, 127, 127, 0.15);
  color: rgba(67, 127, 127);
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
}
.download-link:hover {
  background: rgba(67, 127, 127, 0.12);
  text-decoration: none;
}
</style>
