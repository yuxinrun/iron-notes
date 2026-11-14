import type { Metadata } from "next";
import { PageIntro, Tag } from "@/components/ui";
import { ArticleLibrary } from "@/components/articles/ArticleLibrary";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "全部文章 · 科学增肌知识库",
  description: "IRON NOTES 全部深度文章：肌肥大原理、训练变量、动作技术、训练计划、运动营养、恢复与进步，按频道与标签检索。",
};

export default function ArticlesPage() {
  const all = getAllArticles();

  return (
    <>
      <PageIntro
        eyebrow="ARTICLE LIBRARY / 文章库"
        title="把每一件事讲透，而不是把每个词说一遍"
        desc={`共 ${all.length} 篇深度文章。每篇都写清科学原理、适用边界、训练示例、常见误区与参考来源。按频道或标签缩小范围。`}
        crumbs={[{ label: "文章库" }]}
        meta={<Tag tone="brand">全部 {all.length} 篇</Tag>}
        dark
      />

      <div className="shell section !pt-12">
        <ArticleLibrary articles={all} />
      </div>
    </>
  );
}
