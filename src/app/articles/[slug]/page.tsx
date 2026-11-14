import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { getArticle, getArticleSlugs, getAllArticles, getRelatedArticles } from "@/lib/content";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "文章未找到" };
  return {
    title: article.title,
    description: article.summary || article.subtitle,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.summary || article.subtitle,
      type: "article",
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const all = getAllArticles();
  const idx = all.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
  const related = getRelatedArticles(article, 3);

  return <ArticleView article={article} related={related} prev={prev} next={next} />;
}
