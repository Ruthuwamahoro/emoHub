// lib/getYoutubeData.ts
import { Innertube } from 'youtubei.js';

export async function getYoutubeData(videoUrl: string) {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) return null;

  const yt = await Innertube.create();
  const videoInfo = await yt.getBasicInfo(videoId);
  const info = videoInfo.basic_info;

  return {
    title: info.title,
    description: info.short_description ?? '',
    thumbnailUrl: info.thumbnail?.[0]?.url ?? '',
    duration: info.duration ? parseInt(info.duration.toString()) : 0,
  };
}

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
