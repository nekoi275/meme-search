<template>
  <div class="search-block">
    <div class="search-field">
      <label for="description-search">Искать по описанию</label>
      <input 
        id="description-search"
        type="text" 
        v-model="descriptionQuery"
        placeholder="Введите описание мема..."
      />
    </div>
    
    <div class="search-field">
      <label for="image-search">Искать по картинке</label>
      <div 
        class="file-drop-zone"
        :class="{ 'dragover': isDragging }"
        @drop="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @click="triggerFileInput"
      >
        <input 
          id="image-search"
          ref="fileInputRef"
          type="file" 
          accept="image/*"
          @change="handleFileSelect"
          style="display: none"
        />
        <div class="drop-zone-content">
          <p v-if="!selectedFile">Перетащите изображение сюда или нажмите для выбора</p>
          <p v-else class="file-name">{{ selectedFile.name }}</p>
        </div>
      </div>
    </div>
    
    <button @click="handleSearch" style="align-self: center;">Тык</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fetchRandomMeme, searchByText, searchByImageText } from '../api'

const descriptionQuery = ref('')
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      selectedFile.value = file
    }
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      selectedFile.value = file
    }
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleSearch = async () => {
  const hasText = descriptionQuery.value.trim().length > 0
  const hasFile = selectedFile.value !== null

  try {
    if (!hasText && !hasFile) {
      await fetchRandomMeme(10)
    } else if (hasText && !hasFile) {
      await searchByText(descriptionQuery.value.trim())
    } else if (hasFile) {
      const query = hasText ? descriptionQuery.value.trim() : ''
      await searchByImageText(query, selectedFile.value!)
    }
  } catch (error) {
    console.error('Search error:', error)
  }
}
</script>

<style scoped>
.search-block {
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  padding: 2rem;
  width: 70vw;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-field label {
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 500;
}

.search-field input[type="text"] {
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  outline: none;
  transition: all 0.3s ease;
}

.search-field input[type="text"]:focus {
  border-bottom: 8px solid var(--accent-color);
  background-color: rgba(255, 255, 255, 0.15);
}

.file-drop-zone {
  min-height: 120px;
  border: 2px dashed var(--accent-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
}

.file-drop-zone:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--accent-color);
}

.file-drop-zone.dragover {
  background-color: rgba(222, 129, 216, 0.2);
  border-color: var(--accent-color);
  border-style: solid;
}

.drop-zone-content {
  text-align: center;
  color: var(--text-color);
}

.drop-zone-content p {
  margin: 0;
  font-size: 1rem;
}

.file-name {
  color: var(--accent-color);
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-block {
    padding: 1.5rem;
    width: 95%;
  }
  
  .search-field label {
    font-size: 1rem;
  }
  
  .file-drop-zone {
    min-height: 100px;
  }
}

@media (max-width: 480px) {
  .search-block {
    padding: 1rem;
  }
  
  .search-field label {
    font-size: 0.9rem;
  }
  
  .file-drop-zone {
    min-height: 80px;
  }
  
  .drop-zone-content p {
    font-size: 0.9rem;
  }
}
</style>

