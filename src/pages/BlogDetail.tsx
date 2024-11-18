import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';

interface Post {
  title: string;
  created: string;
  updated: string;
  category: string;
  tags: string[];
  content: string;
}

function formatDate(dateStr: string) {
  const [date, time] = dateStr.split(' ');
  const [year, month, day] = date.split('-');
  return `${year}年${month}月${day}日`;
}

function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false);
  }
  
  // 降级方案
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    textArea.remove();
    return Promise.resolve(true);
  } catch (error) {
    textArea.remove();
    return Promise.resolve(false);
  }
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-3 top-3 p-2 rounded-lg
        bg-white/5 hover:bg-white/10 
        backdrop-blur-sm border border-white/10
        transition-all duration-200
        group"
      title={copied ? "已复制！" : "复制代码"}
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-white/40 group-hover:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </button>
  );
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface ParagraphProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

interface ImageProps {
  node?: any;
  alt?: string;
  src?: string;
  [key: string]: any;
}

export function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const markdownFiles = import.meta.glob('../assets/posts/*.md', { 
          eager: true,
          as: 'raw'
        });

        console.log('Current slug:', slug);
        console.log('Available files:', Object.keys(markdownFiles));

        const filePath = Object.keys(markdownFiles).find(path => {
          const fileName = path.split('/').pop()?.replace('.md', '');
          console.log('Comparing:', fileName, 'with:', slug);
          return fileName === slug;
        });

        if (!filePath) {
          throw new Error('Post not found');
        }

        const content = markdownFiles[filePath] as string;
        const parts = content.split(/^---\s*$/m);
        
        if (parts.length < 3) {
          throw new Error('Invalid post format');
        }

        const frontmatter = parts[1];
        const markdown = parts.slice(2).join('---');

        const metadata: Record<string, any> = {
          title: '',
          created: '',
          updated: '',
          category: '',
          tags: [],
        };
        
        let currentKey: string | null = null;
        
        frontmatter.split(/[\r\n]+/).forEach(line => {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith('#')) return;
          
          if (trimmedLine.includes(':')) {
            const [key, value] = trimmedLine.split(':').map(s => s.trim());
            currentKey = key;
            
            if (key === 'tags') {
              metadata[key] = [];
            } else if (value) {
              metadata[key] = value;
            }
          } else if (trimmedLine.startsWith('- ') && currentKey === 'tags') {
            const tagValue = trimmedLine.replace('- ', '').trim();
            metadata.tags.push(tagValue);
          }
        });

        if (!metadata.title || !metadata.created || !metadata.category) {
          throw new Error('Missing required frontmatter fields');
        }

        setPost({
          title: metadata.title,
          created: metadata.created,
          updated: metadata.updated || metadata.created,
          category: metadata.category,
          tags: metadata.tags,
          content: markdown.trim()
        });

        console.log('Successfully loaded post:', metadata.title);
      } catch (err) {
        console.error('Failed to load post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500/50 animate-ping" />
          <div className="text-white/60">加载中...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="text-white/60">
          {error || '文章不存在'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center">
      <style>{`
        .prose code:not(pre code)::before,
        .prose code:not(pre code)::after {
          content: none;
        }
      `}</style>
      
      <div className="w-full max-w-6xl mx-auto px-4 py-20">
        {/* 标题区域 - 居中显示 */}
        <div className="mb-16 space-y-8 text-center">
          {/* 装饰线 */}
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent mx-auto" />
          
          <div className="space-y-4">
            <h1 className="text-4xl font-light tracking-wider text-white/90">
              {post.title}
            </h1>
          </div>

          <div className="flex justify-center items-center gap-12 text-sm">
            <div className="flex items-center gap-2 text-white/40">
              <span className="w-4 h-4 flex items-center justify-center opacity-60">📅</span>
              <span>{formatDate(post.created)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <span className="w-4 h-4 flex items-center justify-center opacity-60">🏷️</span>
              <span>{post.category}</span>
            </div>
          </div>

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center">
              {post.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-xs bg-white/[0.02] text-white/50 rounded-full 
                    border border-white/5 hover:border-white/10 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 文章内容 */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-light prose-headings:text-white/90
            prose-p:text-white/70 prose-p:leading-relaxed
            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
            prose-strong:text-white/90 prose-strong:font-normal
            prose-code:text-indigo-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#1E1E2E] prose-pre:border prose-pre:border-white/5
            prose-blockquote:border-l-indigo-500/50 
            prose-blockquote:bg-white/[0.02] 
            prose-blockquote:px-4 
            prose-blockquote:py-2 
            prose-blockquote:my-4
            prose-blockquote:text-white/70
            prose-blockquote:italic
            prose-blockquote:rounded-r
            prose-img:rounded-lg prose-img:shadow-xl
            prose-hr:border-white/5"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, inline, className, children, ...props }: CodeProps) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const code = String(children).replace(/\n$/, '');
                  
                  if (inline) {
                    return (
                      <code className="text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                  
                  if (match) {
                    return (
                      <div className="relative group">
                        <SyntaxHighlighter
                          style={{
                            ...vscDarkPlus,
                            'pre[class*="language-"]': {
                              ...vscDarkPlus['pre[class*="language-"]'],
                              background: 'transparent',
                              fontSize: '1.1rem',
                            },
                            'code[class*="language-"]': {
                              ...vscDarkPlus['code[class*="language-"]'],
                              background: 'transparent',
                              fontSize: '1.1rem',
                            },
                            'token': {
                              ...vscDarkPlus['token'],
                              background: 'transparent',
                            }
                          } as any}
                          language={match[1]}
                          PreTag="div"
                          className="!bg-[#1E1E2E] !p-2 rounded-lg text-base"
                          customStyle={{
                            margin: 0,
                            background: 'transparent',
                            fontSize: '1.1rem',
                          }}
                        >
                          {code}
                        </SyntaxHighlighter>
                        
                        <CopyButton code={code} />
                      </div>
                    );
                  }
                  return (
                    <code className="text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ node, children, ...props }: ParagraphProps) => {
                  const hasOnlyImg = node?.children?.length === 1 && node?.children[0].type === 'element' && node?.children[0].tagName === 'img';
                  
                  if (hasOnlyImg) {
                    return <>{children}</>;
                  }
                  
                  return <p {...props}>{children}</p>;
                },
                img: ({ node, ...props }: ImageProps) => {
                  return (
                    <figure className="my-8">
                      <img {...props} className="rounded-lg shadow-xl w-full" />
                      {props.alt && (
                        <figcaption className="mt-2 text-center text-sm text-white/40">
                          {props.alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 返回按钮 - 底部居中 */}
          <div className="text-center mt-16">
            <Link 
              to="/blogs"
              className="px-8 py-3 bg-white/[0.02] border border-white/[0.05] 
                text-white/60 hover:text-white/90 hover:border-indigo-500/30 
                transition-all duration-300 rounded-lg inline-flex items-center gap-3"
            >
              <span className="text-lg">←</span>
              <span>返回博客列表</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 