import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Post {
  title: string;
  created: string;
  updated: string;
  category: string;
  summary: string;
  tags: string[];
  path: string;
}

interface BlogCardProps {
  post: Post;
}

function formatDate(dateStr: string) {
  const [date, time] = dateStr.split(' ');
  const [year, month, day] = date.split('-');
  return `${year}年${month}月${day}日`;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link to={post.path}>
      <div className="group relative bg-white/[0.02] border border-white/[0.05] rounded-lg p-5 hover:border-white/10 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/[0.02] to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 标题和日期 */}
        <div className="flex justify-between items-start mb-3 gap-4">
          <h2 className="text-lg text-white/90 font-light tracking-wide group-hover:text-white transition-colors duration-300">
            {post.title}
          </h2>
          <div className="text-xs text-white/40 whitespace-nowrap">
            {formatDate(post.created)}
          </div>
        </div>

        {/* 分类和标签 */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-2 py-1 text-xs bg-indigo-500/10 text-indigo-400/90 rounded">
            {post.category}
          </span>
          {post.tags.map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 text-xs bg-white/[0.02] text-white/50 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 摘要 */}
        <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
          {post.summary}
        </p>
      </div>
    </Link>
  );
} 