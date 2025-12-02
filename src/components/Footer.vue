<template>
    <footer class="footer">
        <div class="footer-content">
            <p class="footer-text">
                Сайт сделан <a href="https://nekoi.me/" target="_blank" rel="noopener noreferrer">Nekoi</a> в {{
                    currentYear }} г.
            </p>
            <a href="https://t.me/addlist/O_0_vO0DrBs3NTdi" target="_blank" rel="noopener noreferrer"
                class="telegram-link">
                <img src="/src/assets/telegram.svg" alt="Наши каналы в телеграмме" class="telegram-icon" />
            </a>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
    background-color: var(--footer-color);
    padding: 0.5rem;
}

.footer-content {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.footer-text {
    font-size: 0.95rem;
}

.footer-text a {
    text-decoration: none;
    transition: opacity 0.3s ease;
}

.footer-text a:hover {
    opacity: 0.8;
    text-decoration: underline;
}

.telegram-link {
    display: inline-flex;
    align-items: center;
    transition: opacity 0.3s ease;
}

.telegram-link:hover {
    opacity: 0.8;
}

.telegram-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
}

@media (max-width: 768px) {
    .footer {
        padding: 1.5rem 1rem;
    }

    .footer-text {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .footer {
        padding: 1rem 0.75rem;
    }

    .footer-text {
        font-size: 0.85rem;
    }
}
</style>
