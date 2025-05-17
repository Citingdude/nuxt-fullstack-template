<script setup lang="ts">
import type { FileTypeInfo } from '~~/shared/constants/file/fileTypes.constant'
import { ref } from 'vue'

const props = defineProps<{
  acceptedFiles?: FileTypeInfo[]
}>()

const emit = defineEmits<{
  (e: 'uploadFile', file: File): void
  (e: 'selectFile', file: File): void
  (e: 'clearFile'): void
}>()

const maxFileSizeMB = 5
const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024

const fileInput = useTemplateRef('fileInput')
const file = ref<File | null>(null)
const error = ref<string>('')

const acceptedFileMimes = computed<string[] | null>(() => {
  if (!props.acceptedFiles) {
    return null
  }

  return props.acceptedFiles.map(file => file.mime)
})

const acceptedFileExtensions = computed<string[] | null>(() => {
  if (!props.acceptedFiles) {
    return null
  }

  return props.acceptedFiles.map(file => file.ext)
})

const fileInputAccept = computed<string | undefined>(() => {
  if (!acceptedFileExtensions.value) {
    return undefined
  }

  return acceptedFileExtensions.value.join(', ')
})

const previewUrl = computed<string | null>(() => {
  if (!file.value) {
    return null
  }

  return URL.createObjectURL(file.value)
})

function triggerFileSelect() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement

  if (!target.files) {
    return
  }

  if (!target.files.length) {
    return
  }

  const file = target.files[0]

  if (!file) {
    return
  }

  if (target.files && target.files.length > 0) {
    validateFile(file)
  }
}

function handleDrop(event: DragEvent) {
  const droppedFile = event.dataTransfer?.files[0]
  if (droppedFile) {
    validateFile(droppedFile)
  }
}

function handleUpload() {
  if (!file.value) {
    return
  }

  emit('uploadFile', file.value)
  clearFile()
}

function validateFile(uploadedFile: File) {
  error.value = ''
  file.value = null

  const hasAcceptedTypeValidation = Boolean(acceptedFileMimes.value)

  const isAcceptedType = acceptedFileMimes.value
    ? acceptedFileMimes.value.includes(uploadedFile.type)
    : null

  if (hasAcceptedTypeValidation && !isAcceptedType) {
    error.value = `Unsupported file type. Please upload a file with one of the following formats: ${fileInputAccept.value}`
    return
  }

  if (uploadedFile.size > maxFileSizeBytes) {
    error.value = `File is too large. The maximum allowed size is ${maxFileSizeMB}MB`
    return
  }

  file.value = uploadedFile
  emit('selectFile', uploadedFile)
}

function clearFile() {
  file.value = null
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }

  emit('clearFile')
}
</script>

<template>
  <div class="flex gap-4 flex-col">
    <div
      class="cursor-pointer border-2 border-gray-400 rounded-lg border-dashed p-6 text-center transition hover:border-primary"
      @click="triggerFileSelect"
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="fileInputAccept"
        @change="handleFileChange"
      >

      <div class="flex flex-col items-center justify-center gap-2">
        <p class="text-1.4rem text-primary">
          Drag & drop your file here, or click to upload
        </p>

        <div class="w-full mt-1 flex items-end justify-between">
          <p class="mt-2 text-1.2rem text-neutral-600">
            Supported file types: {{ fileInputAccept }}
          </p>
          <p class="text-1.2rem text-neutral-600">
            Maximum file size: {{ maxFileSizeMB }}MB
          </p>
        </div>
      </div>

      <div v-if="error" class="mt-2 text-1.2rem text-error-500">
        {{ error }}
      </div>
    </div>

    <div v-if="file" class="flex flex-col gap-8">
      <div
        v-if="file"
        class="mt-4 text-1.2rem text-neutral-100 font-bold flex items-center gap-4"
      >
        <img
          v-if="previewUrl"
          :src="previewUrl"
          class="aspect-5/3 object-cover w-32"
          alt=""
        >

        <p>
          {{ file.name }}
        </p>

        <UButton
          v-if="file || error"
          color="error"
          @click.stop="clearFile"
        >
          Clear file
        </UButton>
      </div>

      <UButton
        class="w-fit"
        label="Upload file"
        @click="handleUpload"
      />
    </div>
  </div>
</template>
