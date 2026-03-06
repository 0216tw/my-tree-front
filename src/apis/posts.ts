import { http } from '@/apis/http'

export type PostResponse = {
  postNo: number
  userId: string
  title: string
  content: string
  createdAt: string
}

export type CreatePostRequest = {
  userId: string
  title: string
  content: string
}

export async function fetchPosts() {
  const response = await http.get<PostResponse[]>('/posts')
  return response.data
}

export async function createPost(request: CreatePostRequest) {
  const response = await http.post<PostResponse>('/posts', request)
  return response.data
}
