import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buildSearchIndex } from "@/lib/search";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://iron-notes.example.com"),
  title: {
    default: "IRON NOTES 铁与笔记 · 中文科学健身与增肌知识平台",
    template: "%s | IRON NOTES 铁与笔记",
  },
  description:
    "练得明白，长得扎实。IRON NOTES 是中文科学健身与增肌知识平台：肌肥大原理、训练变量、动作图鉴、训练计划、运动营养、恢复与进步、ECharts 数据实验室与实用计算器。",
  keywords: [
    "科学健身", "增肌", "肌肥大", "抗阻训练", "渐进超负荷", "RIR", "RPE", "训练容量",
    "动作图鉴", "训练计划", "运动营养", "蛋白质", "肌酸", "恢复", "IRON NOTES", "铁与笔记",
  ],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "IRON NOTES 铁与笔记",
    title: "IRON NOTES 铁与笔记 · 练得明白，长得扎实",
    description: "Train Smart. Build Strong. 用科学的方法建立真正有效的增肌体系。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const docs = buildSearchIndex();
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          跳到主要内容
        </a>
        <Header docs={docs} />
        <main id="main" className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
