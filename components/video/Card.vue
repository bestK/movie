<script setup lang="ts">
import type { Video } from '~/types';

const props = defineProps<{
  item: Video
}>()

const showModal = useIframeModal()
function play() {
  return showModal(getVideoLink(props.item)!)
}

const episodeData = ref<any>(null)
const movieData = ref<any>(null)
const thumbnailUrl = computed(() => {
  if (props.item.type === 'VidlinkTV') {
    if (episodeData.value?.still_path)
      return `https://image.tmdb.org/t/p/w500${episodeData.value.still_path}`
    return null
  }
  else if (props.item.type === 'VidlinkMovie') {
    if (movieData.value?.poster_path)
      return `https://image.tmdb.org/t/p/w500${movieData.value.poster_path}`
    return null
  }
  return `/youtube/vi/${props.item.key}/maxresdefault.jpg`
})

// 获取电视剧集信息
async function fetchEpisodeData() {
  if (props.item.type === 'VidlinkTV') {
    const [season, episode] = [props.item.number_of_seasons!.toString(), props.item.number_of_episodes!.toString()]
    try {
      const seasonData = await getTvShowEpisodes(props.item.id, season)
      episodeData.value = seasonData.episodes[Number(episode) - 1]
    }
    catch (error) {
      console.error('获取剧集信息失败:', error)
    }
  }
  else if (props.item.type === 'VidlinkMovie') {
    try {
      const movie = await getMoiveDetails(props.item.id)
      movieData.value = movie
    }
    catch (error) {
      console.error('获取电影信息失败:', error)
    }
  }
}

// 在组件挂载时获取剧集信息
onMounted(() => {
  fetchEpisodeData()
})
</script>

<template>
  <button pb2 text-left data-testid="play-button" @click="play()">
    <div
      block bg-gray4:10 p1 flex
      class="aspect-16/9"
      transition duration-400 relative
      hover="scale-102 z10"
      data-testid="video-thumbnail"
    >
      <NuxtImg
        v-if="thumbnailUrl"
        :src="thumbnailUrl"
        width="400"
        height="600"
        format="webp"
        :alt="props.item.name"
        w-full h-full object-cover
        data-testid="video-image"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-800">
        <div i-ph-image-square ma text-3xl op50 />
      </div>
      <div flex w-full h-full absolute inset-0 op20 hover:op100 transition>
        <div i-ph-play ma text-3xl data-testid="play-icon" />
      </div>
    </div>
    <div mt-2 data-testid="video-name">
      {{ props.item.name }}
    </div>
    <div op60 text-sm data-testid="video-type">
      {{ props.item.type }}
    </div>
  </button>
</template>
