import { SEED_INSIGHTS, type SeedInsight } from "@/lib/content/catalog";
import { tryConnectMongo } from "@/lib/db/mongoose";

export type PublicInsight = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  publishedAt: string;
  authorName: string;
  coverImage?: string;
};

function fromSeed(post: SeedInsight): PublicInsight {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    body: Array.isArray(post.body) ? post.body.join("\n\n") : String(post.body),
    publishedAt: post.publishedAt,
    authorName: "Finekarts Trade Desk",
  };
}

export async function getPublishedInsights(): Promise<PublicInsight[]> {
  if (await tryConnectMongo()) {
    const { BlogPost } = await import("@/models");
    const docs = await BlogPost.find({ status: "published", locale: "en" })
      .sort({ publishedAt: -1 })
      .lean();

    if (docs.length > 0) {
      return docs.map((doc) => ({
        slug: doc.slug,
        title: doc.title,
        excerpt: doc.excerpt ?? "",
        category: doc.categories[0] ?? "Insights",
        body: doc.body,
        publishedAt: doc.publishedAt
          ? new Date(doc.publishedAt).toISOString()
          : new Date(doc.createdAt).toISOString(),
        authorName: doc.authorName,
        coverImage: doc.coverImage,
      }));
    }
  }

  return [...SEED_INSIGHTS]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map(fromSeed);
}

export async function getPublishedInsight(slug: string): Promise<PublicInsight | null> {
  const posts = await getPublishedInsights();
  return posts.find((p) => p.slug === slug) ?? null;
}
