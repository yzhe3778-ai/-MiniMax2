export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MiniMax2',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    description: '专业的 AI 视频和图像生成平台，支持 Hailuo 2.3 视频生成、MiniMax M2 对话、AI 图像生成等功能',
    url: 'https://minimax2.pages.dev',
    author: {
      '@type': 'Organization',
      name: 'MiniMax2 Team',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
    featureList: [
      'AI 视频生成',
      '文字转视频',
      '图片转视频',
      'AI 对话',
      '图像生成',
      '15种相机运镜',
      '多分辨率支持',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

