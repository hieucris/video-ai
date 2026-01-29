import axios from 'axios';
import type { CreateVideoJobRequest } from './types/video/request.types';

export async function createVideoJob(
  data: CreateVideoJobRequest,
  token: string
) {
  const response = await axios.post(
    'https://system.kingcontent.pro/api/v1/user/video-ai/jobs',
    data,
    {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en,vi;q=0.9',
        'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'access-control-allow-methods': '*',
        'access-control-allow-origin': '*',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'origin': 'https://kingcontent.pro',
        'priority': 'u=1, i',
        'referer': 'https://kingcontent.pro/',
        'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
      },
      withCredentials: true,
    }
  );
  return response.data;
}
