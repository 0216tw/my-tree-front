import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { createPost, fetchPosts, type PostResponse } from '@/apis/posts'
import { extractApiErrorMessage } from '@/apis/error'
import { getStoredAuthUser } from '@/auth/storage'

type ComposerState = {
  title: string
  content: string
}

type NoteLayout = {
  top: number
  left: number
  rotate: number
  tone: string
}

const noteTones = ['note-yellow', 'note-pink', 'note-blue', 'note-green']

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function buildNoteLayouts(posts: PostResponse[]) {
  const layouts: Record<number, NoteLayout> = {}
  const occupiedSpots: Array<{ top: number; left: number }> = []

  posts.forEach((post, index) => {
    let top = 18
    let left = 8
    let attempts = 0

    while (attempts < 20) {
      const nextTop = 18 + Math.random() * 62
      const nextLeft = 6 + Math.random() * 74
      const overlaps = occupiedSpots.some(
        (spot) => Math.abs(spot.top - nextTop) < 16 && Math.abs(spot.left - nextLeft) < 14,
      )

      if (!overlaps) {
        top = nextTop
        left = nextLeft
        break
      }

      attempts += 1
    }

    occupiedSpots.push({ top, left })
    layouts[post.postNo] = {
      top,
      left,
      rotate: -8 + Math.random() * 16,
      tone: noteTones[index % noteTones.length],
    }
  })

  return layouts
}

function HomePage() {
  const authUser = getStoredAuthUser()
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [noteLayouts, setNoteLayouts] = useState<Record<number, NoteLayout>>({})
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null)
  const [composerState, setComposerState] = useState<ComposerState>({
    title: '',
    content: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pageErrorMessage, setPageErrorMessage] = useState('')
  const [composerErrorMessage, setComposerErrorMessage] = useState('')

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true)
      setPageErrorMessage('')

      try {
        const response = await fetchPosts()
        setPosts(response)
        setNoteLayouts(buildNoteLayouts(response))
      } catch (error) {
        setPageErrorMessage(extractApiErrorMessage(error, '게시물을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    void loadPosts()
  }, [])

  const handleOpenComposer = () => {
    setComposerErrorMessage('')
    setIsComposerOpen(true)
  }

  const handleCloseComposer = () => {
    setComposerState({
      title: '',
      content: '',
    })
    setComposerErrorMessage('')
    setIsComposerOpen(false)
  }

  const handleSubmitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authUser) {
      setComposerErrorMessage('로그인 정보가 없습니다. 다시 로그인해 주세요.')
      return
    }

    setIsSaving(true)
    setComposerErrorMessage('')

    try {
      const createdPost = await createPost({
        userId: authUser.userId,
        title: composerState.title,
        content: composerState.content,
      })

      const nextPosts = [createdPost, ...posts]
      setPosts(nextPosts)
      setNoteLayouts(buildNoteLayouts(nextPosts))
      handleCloseComposer()
    } catch (error) {
      setComposerErrorMessage(extractApiErrorMessage(error, '게시물 등록에 실패했습니다.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="board-page">
      <div className="board-surface">
        <div className="board-toolbar">
          <button type="button" className="primary-button" onClick={handleOpenComposer}>
            글쓰기
          </button>
        </div>

        {pageErrorMessage ? <p className="board-feedback error">{pageErrorMessage}</p> : null}
        {isLoading ? <p className="board-feedback">메모를 불러오는 중입니다.</p> : null}

        {!isLoading && posts.length === 0 && !pageErrorMessage ? (
          <p className="board-feedback">아직 등록된 메모가 없습니다.</p>
        ) : null}

        <div className="note-layer" aria-live="polite">
          {posts.map((post) => {
            const layout = noteLayouts[post.postNo]
            if (!layout) {
              return null
            }

            return (
              <button
                key={post.postNo}
                type="button"
                className={`note-card ${layout.tone}`}
                style={{
                  top: `${layout.top}%`,
                  left: `${layout.left}%`,
                  transform: `rotate(${layout.rotate}deg)`,
                }}
                onClick={() => setSelectedPost(post)}
              >
                <span className="note-fold" />
                <strong className="note-title">{post.title}</strong>
                <span className="note-author">{post.userId}</span>
              </button>
            )
          })}
        </div>
      </div>

      {isComposerOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={handleCloseComposer}>
          <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="auth-eyebrow">새 글 작성</p>
                <h2>메모를 남겨주세요.</h2>
              </div>
              <button type="button" className="modal-close" onClick={handleCloseComposer}>
                닫기
              </button>
            </div>

            <form className="form-grid" onSubmit={handleSubmitPost}>
              <label className="form-field">
                <span>작성자</span>
                <input type="text" value={authUser?.userId ?? ''} readOnly />
              </label>

              <label className="form-field">
                <span>제목</span>
                <input
                  type="text"
                  value={composerState.title}
                  onChange={(event) =>
                    setComposerState((currentState) => ({
                      ...currentState,
                      title: event.target.value,
                    }))
                  }
                  placeholder="제목을 입력하세요"
                  maxLength={150}
                  required
                />
              </label>

              <label className="form-field">
                <span>내용</span>
                <textarea
                  value={composerState.content}
                  onChange={(event) =>
                    setComposerState((currentState) => ({
                      ...currentState,
                      content: event.target.value,
                    }))
                  }
                  placeholder="내용을 입력하세요"
                  maxLength={4000}
                  rows={8}
                  required
                />
              </label>

              {composerErrorMessage ? (
                <p className="form-message error">{composerErrorMessage}</p>
              ) : null}

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={handleCloseComposer}>
                  취소
                </button>
                <button type="submit" className="primary-button" disabled={isSaving}>
                  {isSaving ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {selectedPost ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedPost(null)}>
          <div className="modal-card detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="auth-eyebrow">메모 상세</p>
                <h2>{selectedPost.title}</h2>
              </div>
              <button type="button" className="modal-close" onClick={() => setSelectedPost(null)}>
                닫기
              </button>
            </div>

            <dl className="detail-meta">
              <div>
                <dt>작성자</dt>
                <dd>{selectedPost.userId}</dd>
              </div>
              <div>
                <dt>작성일</dt>
                <dd>{formatDate(selectedPost.createdAt)}</dd>
              </div>
            </dl>

            <div className="detail-content">{selectedPost.content}</div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default HomePage
