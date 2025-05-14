<script setup lang="ts">
const items = [
  [
    {
      label: 'Upload image',
      icon: 'i-lucide-upload',
    },
  ],
]

const { data, refresh } = await useFetch('/api/media')

const files = ref<File[]>([])

async function uploadImage() {
  const file = files.value[0]

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

function handleChange(event: Event) {
  const input = event.target

  if (!input) {
    return
  }

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  const filesAsArray = Array.from(input?.files || [])

  files.value = files.value.concat(filesAsArray)
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
        <ul class="list-disc">
          <li v-for="file in files" :key="file.name">
            {{ file.name }}
          </li>
        </ul>

        <form @submit.prevent="uploadImage">
          <input
            id="image"
            type="file"
            name="image"
            @change="handleChange"
          >
          <UButton type="submit" label="Upload" size="md" />
        </form>

        <div class="grid grid-cols-4 gap-4">
          <img
            v-for="image in data?.media"
            :key="image.id"
            class="size-full aspect-5/3 object-cover"
            :src="image.url || undefined"
            alt=""
          >
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
