import PostForm from '@/components/admin/PostForm'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminEditPostPage(props: PageProps) {
  // Giải nén params theo chuẩn Next.js 16
  const { id } = await props.params

  return <PostForm postId={id} />
}
