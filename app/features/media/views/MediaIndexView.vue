<script setup lang="ts">
import { FILE_TYPE } from '~~/shared/constants/file/fileTypes.constant'

const items = [
  [
    {
      label: 'Upload image',
      icon: 'i-lucide-upload',
    },
  ],
]

const { data, refresh } = await useFetch('/api/media')

async function uploadImage(file: File) {
  const formData = new FormData()

  if (!file) {
    console.warn('No file selected.')
    return
  }

  formData.append('file', file, file.name)

  await $fetch('/api/media', {
    method: 'POST',
    body: formData,
  })

  await refresh()
}

async function deleteImage(id: number) {
  try {
    await $fetch(`/api/media/${id}`, {
      method: 'DELETE',
    })

    await refresh()
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <UDashboardPanel id="media">
    <template #header>
      <UDashboardNavbar title="Media" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-8">
        <FileUpload
          class="max-w-2xl"
          :accepted-files="[
            FILE_TYPE.JPEG,
            FILE_TYPE.JPG,
            FILE_TYPE.PNG,
            FILE_TYPE.WEBP,
          ]"
          @upload-file="(file) => uploadImage(file)"
        />

        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="image in data?.media"
            :key="image.id"
            class="flex relative"
          >
            <img
              class="size-full aspect-5/3 object-cover"
              :src="image.url || undefined"
              alt=""
            >

            <UButton
              class="absolute top-2 right-2"
              icon="i-lucide-trash"
              color="error"
              variant="subtle"
              @click="deleteImage(image.id)"
            />
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
