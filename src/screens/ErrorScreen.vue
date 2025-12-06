<template>
    <div class="error-screen">
  
      <div class="content">
        <img src="../assets/bg/cat6.webp" alt="Ошибка, котик грустный" class="error-image" width="200" height="200"></img>
        <h1 class="main-title">Ошибочка вышла :(</h1>
        <h2 class="subtitle">Извинити.</h2>
        <button @click="handleSearch">Попробовать еще раз</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">  
  const emit = defineEmits<{
    (e: 'search'): void
  }>()
  
  const handleSearch = () => {
    emit('search')
  }
  </script>
  
  <style scoped>
  .error-screen {
    height: 90vh;
    padding-top: 7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-color);
    overflow: hidden;
  }
  
  .content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .main-title {
    font-size: 3.5rem;
    font-weight: bold;
    color: var(--text-color);
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .subtitle {
    font-size: 1.5rem;
    font-weight: normal;
    color: var(--text-color);
    margin-bottom: 2rem;
    line-height: 1.4;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    .main-title {
      font-size: 2.5rem;
    }
  
    .subtitle {
      font-size: 1.2rem;
    }
  
    .content {
      padding: 1.5rem;
      margin: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .main-title {
      font-size: 2rem;
    }
  
    .subtitle {
      font-size: 1rem;
    }
  
    .content {
      padding: 1rem;
    }
  }
  </style>
  