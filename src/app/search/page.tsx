import type { Metadata } from "next";
import { PageIntro, Tag, Note } from "@/components/ui";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { buildSearchIndex } from "@/lib/search";

export const metadata: Metadata = {
  title: "全站搜索",
  description: "在 IRON NOTES 的文章、动作图鉴、训练计划、工具、书籍与专业网站中检索关键词。",
};

export default function SearchPage() {
  const docs = buildSearchIndex();

  return (
    <>
      <PageIntro
        eyebrow="SEARCH / 全站搜索"
        title="想找什么，直接问"
        desc={`一次检索文章、动作、训练计划、工具、书籍与专业网站。当前索引共 ${docs.length} 条内容；搜索按标题与关键词匹配，支持多个词。`}
        crumbs={[{ label: "全站搜索" }]}
        meta={<Tag tone="brand">{docs.length} 条可检索内容</Tag>}
        dark
      />
      <section className="section !py-12">
        <div className="shell max-w-[980px]">
          <SearchPageClient docs={docs} />
          <div className="mt-8">
            <Note type="tip" title="搜不到时">
              中文训练术语常有多种叫法：例如「力竭」也可试「RIR」「RPE」，「分化」也可试「推拉腿」「上下肢」。工具与频道也会被纳入搜索，别忘了试试计算器名称。
            </Note>
          </div>
        </div>
      </section>
    </>
  );
}
