<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div v-if="isOpen" class="lightbox-overlay" @click="close">
        <button class="lightbox-close" @click="close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            <line fill="none" stroke="#fff" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"></line>
            <line fill="none" stroke="#fff" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"></line>
          </svg>
        </button>

        <!-- Previous button -->
        <button
          v-if="images.length > 1"
          class="lightbox-nav lightbox-prev"
          @click.stop="prev"
          aria-label="Previous"
        >
          <svg width="14" height="24" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg">
            <polyline fill="none" stroke="#fff" stroke-width="1.4" points="12.775,1 1.225,12 12.775,23"></polyline>
          </svg>
        </button>

        <!-- Image container -->
        <div class="lightbox-content" @click.stop>
          <img
            :src="images[currentIndex]?.source"
            :alt="images[currentIndex]?.caption || 'Image'"
            class="lightbox-image"
          />
          <div v-if="images[currentIndex]?.caption" class="lightbox-caption">
            {{ images[currentIndex].caption }}
          </div>
        </div>

        <!-- Next button -->
        <button
          v-if="images.length > 1"
          class="lightbox-nav lightbox-next"
          @click.stop="next"
          aria-label="Next"
        >
          <svg width="14" height="24" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg">
            <polyline fill="none" stroke="#fff" stroke-width="1.4" points="1.225,23 12.775,12 1.225,1"></polyline>
          </svg>
        </button>

        <!-- Counter -->
        <div v-if="images.length > 1" class="lightbox-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);

const isOpen = ref(false);
const currentIndex = ref(props.initialIndex);

const show = (index = 0) => {
  currentIndex.value = index;
  isOpen.value = true;
  // Prevent body scroll when lightbox is open
  document.body.style.overflow = 'hidden';
};

const close = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
  emit('close');
};

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
};

// Keyboard navigation
const handleKeydown = (e) => {
  if (!isOpen.value) return;

  switch(e.key) {
    case 'Escape':
      close();
      break;
    case 'ArrowRight':
      next();
      break;
    case 'ArrowLeft':
      prev();
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

// Expose show method so parent can call it
defineExpose({ show, close });
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 85vh;
  display: block;
  object-fit: contain;
}

.lightbox-caption {
  color: #fff;
  text-align: center;
  margin-top: 15px;
  padding: 0 20px;
  font-size: 14px;
  max-width: 600px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  z-index: 10001;
  transition: background 0.2s;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.8);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  padding: 15px 10px;
  border-radius: 4px;
  transition: background 0.2s;
  z-index: 10001;
}

.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.8);
}

.lightbox-prev {
  left: 20px;
}

.lightbox-next {
  right: 20px;
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
}

/* Transitions */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .lightbox-nav {
    padding: 10px 8px;
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }
}
</style>