import { httpClient } from '@/shared/api/httpClient';
import { unwrapApiResponse } from '@/shared/api/apiResponse';

// 公開活動列表。可選 { animateTypeId, limit }：animateTypeId 篩選某作品底下的活動（作品頁 drill-down）。
export async function getActivities(params = {}) {
  const response = await httpClient.get('/activities', { params });
  return unwrapApiResponse(response, 'activity.loadFailed');
}

export async function getActivity(activityId) {
  const response = await httpClient.get(`/activities/${Number(activityId)}`);
  return unwrapApiResponse(response, 'activity.loadFailed');
}

// 人氣活動：依訂單數量由多到少取前 N 名（後端預設 5）。
export async function getPopularActivities(limit = 5) {
  const response = await httpClient.get('/activities/popular', { params: { limit } });
  return unwrapApiResponse(response, 'activity.loadFailed');
}

// 最新活動：後端回 activeStartTime 落在「過去兩週到今天」的公開活動，依開始時間由新到舊（後端預設 6）。
export async function getLatestActivities(limit = 6) {
  const response = await httpClient.get('/activities/latest', { params: { limit } });
  return unwrapApiResponse(response, 'activity.loadFailed');
}

// 快結束活動：後端回 activeEndTime 落在「今天到一週後」的公開活動，依結束時間由近到遠（後端預設 6）。
export async function getEndingSoonActivities(limit = 6) {
  const response = await httpClient.get('/activities/ending-soon', { params: { limit } });
  return unwrapApiResponse(response, 'activity.loadFailed');
}

// 作品（= animateType）：只回有被進行中活動使用的作品。首頁傳 limit=10、作品列表不傳（全部）。
export async function getWorks(limit) {
  const params = limit != null ? { limit } : {};
  const response = await httpClient.get('/works', { params });
  return unwrapApiResponse(response, 'activity.loadFailed');
}
