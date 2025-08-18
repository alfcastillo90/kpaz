<template>
  <div class="library-btn">
    <NuxtLink to="/library">Mi biblioteca</NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.library-btn {
  position: fixed;
  top: 20px;
  right: 30px;
  z-index: 100;
  a {
    background: #222;
    color: #fff;
    padding: 0.7rem 1.2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    box-shadow: 0 2px 8px #0002;
    transition: background 0.2s;
    &:hover {
      background: #444;
    }
  }
}
</style>