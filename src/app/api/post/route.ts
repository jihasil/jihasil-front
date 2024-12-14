import { db } from '@/app/lib/firebase-db';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

const post = 'post'
const pageSize = 10

type Post = {
  postId: string,
  imageUrl: string,
  createdAt: string
}

type PostResponseDTO = {
  posts: Post[],
  isLast: boolean,
}
//
// async function getPost(createdAt: string): Promise<Post[]> {
//   const snapshot = await db.collection(post)
//     .orderBy('createdAt', 'desc')
//     .limit(pageSize)
//     .startAfter(createdAt)
//     .get()
//
//   return snapshot.docs.map(doc => {
//     return {
//       postId: doc.id,
//       ...doc.data()
//     }
//   }) as Post[]
// }

export async function GET(req: NextRequest) {
  const createdAt = req.nextUrl.searchParams.get('createdAt')
  const getPost = async (createdAt: string) => {
    const snapshot = await db.collection(post)
      .orderBy('createdAt', 'desc')
      .limit(pageSize)
      .startAfter(createdAt)
      .get()

    return snapshot.docs.map(doc => {
      return {
        postId: doc.id,
        ...doc.data()
      }
    }) as Post[]
  }

  try {
    const posts = await getPost(createdAt as string)
    const data: PostResponseDTO = {
      posts: posts,
      isLast: posts.length < pageSize
    }
    return new Response(JSON.stringify(data), {
      status: 200
    })
  } catch (error) {
    console.debug(error)
    return new Response(JSON.stringify("error!"), {
      status: 500
    })
  }
}

export type { Post, PostResponseDTO };