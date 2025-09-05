import type { Media, Video } from '~/types'

// 创建基础视频对象
function createBaseVideo(id: string | number): Omit<Video, 'name' | 'key' | 'type'> {
  return {
    iso_639_1: '',
    iso_3166_1: '',
    site: 'Vidlink',
    id: `${id}`,
    size: 0,
    official: false,
    published_at: '',
  }
}

// 处理电影视频
function createMovieVideo(item: Media): Video {
  return {
    ...createBaseVideo(item.id),
    name: 'Vidlink',
    key: `${item.id}`,
    type: 'VidlinkMovie',
  }
}

// 处理电视剧视频
function createTVVideos(item: Media): Video[] {
  const result: Video[] = []
  const episodeCount = item.number_of_episodes || 0
  const seasonNumber = item.number_of_seasons || 0

  if (episodeCount <= 0 || seasonNumber <= 0)
    return result

  // 获取已存在的集数
  const existingEpisodes = new Set(
    item.videos?.results
      ?.filter(v => v.type === 'VidlinkTV')
      ?.map(v => v.key) || [],
  )

  // 只添加不存在的集数
  for (let episode = 1; episode <= episodeCount; episode++) {
    const episodeKey = `${seasonNumber}/${episode}`
    if (!existingEpisodes.has(episodeKey)) {
      result.push({
        ...createBaseVideo(item.id),
        name: `${item.name} ${episode}`,
        key: episodeKey,
        type: 'VidlinkTV',
        number_of_seasons: seasonNumber,
        number_of_episodes: episode,
      })
    }
  }

  return result
}

// 合并视频结果
function mergeVideoResults(item: Media, newVideos: Video[]): void {
  if (!newVideos.length)
    return

  if (!item.videos)
    item.videos = { results: [] }

  item.videos.results = item.videos.results || []
  item.videos.results.push(...newVideos)
}

export function vidlink(item: Media): void {
  if (!item)
    return

  const videos = item.number_of_seasons
    ? createTVVideos(item)
    : [createMovieVideo(item)]

  mergeVideoResults(item, videos)
}
