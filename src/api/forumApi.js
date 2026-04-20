const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const responseJson = await response.json();

  if (responseJson.status !== 'success') {
    throw new Error(responseJson.message);
  }

  return responseJson.data;
}

async function fetchWithToken(url, options = {}) {
  const token = getAccessToken();

  return fetchJson(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

async function register({ name, email, password }) {
  return fetchJson(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
}

async function login({ email, password }) {
  const data = await fetchJson(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return data.token;
}

async function getOwnProfile() {
  const data = await fetchWithToken(`${BASE_URL}/users/me`);
  return data.user;
}

async function getAllUsers() {
  const data = await fetchJson(`${BASE_URL}/users`);
  return data.users;
}

async function getAllThreads() {
  const data = await fetchJson(`${BASE_URL}/threads`);
  return data.threads;
}

async function getThreadDetail(threadId) {
  const data = await fetchJson(`${BASE_URL}/threads/${threadId}`);
  return data.detailThread;
}

async function createThread({ title, body, category }) {
  const data = await fetchWithToken(`${BASE_URL}/threads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body, category }),
  });

  return data.thread;
}

async function createComment({ threadId, content }) {
  const data = await fetchWithToken(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  return data.comment;
}

async function upVoteThread(threadId) {
  return fetchWithToken(`${BASE_URL}/threads/${threadId}/up-vote`, {
    method: 'POST',
  });
}

async function downVoteThread(threadId) {
  return fetchWithToken(`${BASE_URL}/threads/${threadId}/down-vote`, {
    method: 'POST',
  });
}

async function neutralVoteThread(threadId) {
  return fetchWithToken(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
    method: 'POST',
  });
}

async function upVoteComment({ threadId, commentId }) {
  return fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`, {
    method: 'POST',
  });
}

async function downVoteComment({ threadId, commentId }) {
  return fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`, {
    method: 'POST',
  });
}

async function neutralVoteComment({ threadId, commentId }) {
  return fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`, {
    method: 'POST',
  });
}

async function getLeaderboards() {
  const data = await fetchJson(`${BASE_URL}/leaderboards`);
  return data.leaderboards;
}

export {
  createComment,
  createThread,
  downVoteComment,
  downVoteThread,
  getAccessToken,
  getAllThreads,
  getAllUsers,
  getLeaderboards,
  getOwnProfile,
  getThreadDetail,
  login,
  neutralVoteComment,
  neutralVoteThread,
  putAccessToken,
  register,
  removeAccessToken,
  upVoteComment,
  upVoteThread,
};
