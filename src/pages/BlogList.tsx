import { useState, useEffect } from 'react';
import { BlogCard } from '../components/BlogCard';
import { Container } from '../components/common/Container';
import { PageTitle } from '../components/common/PageTitle';
import React from 'react';
import { motion } from 'framer-motion';
import { TagCloud } from '../components/TagCloud';

interface Post {
  title: string;
  created: string;
  updated: string;
  category: string;
  summary: string;
  tags: string[];
  path: string;
  content: string;
}

const fadeUpKeyframes = `
  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export function BlogList(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const markdownFiles = import.meta.glob('../assets/posts/*.md', { 
          eager: true,
          as: 'raw'
        });
        
        console.log('Available markdown files:', Object.keys(markdownFiles));
        
        const loadedPosts = Object.entries(markdownFiles).map(([path, content]) => {
          try {
            const fileName = path.split('/').pop()?.replace('.md', '');
            if (!fileName) return null;

            console.log('Processing file:', fileName);
            
            const match = (content as string).match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
            if (!match) {
              console.log('No frontmatter found in:', fileName);
              return null;
            }

            const articleContent = (content as string).replace(/^---[\r\n]+([\s\S]*?)[\r\n]+---/, '').trim();

            const yaml = match[1];
            const frontmatter: Record<string, any> = {};
            let currentKey: string | null = null;
            
            yaml.split(/[\r\n]+/).forEach(line => {
              const trimmedLine = line.trim();
              if (!trimmedLine || trimmedLine.startsWith('#')) return;
              
              if (trimmedLine.includes(':')) {
                const [key, value] = trimmedLine.split(':').map(s => s.trim());
                currentKey = key;
                
                if (key === 'tags') {
                  frontmatter[key] = [];
                } else if (value) {
                  frontmatter[key] = value;
                }
              } else if (trimmedLine.startsWith('- ') && currentKey === 'tags') {
                const tagValue = trimmedLine.replace('- ', '').trim();
                frontmatter.tags.push(tagValue);
              }
            });

            if (!frontmatter.tags) {
              frontmatter.tags = [];
            }

            console.log('Parsed frontmatter:', frontmatter);

            return {
              ...frontmatter,
              content: articleContent,
              path: `/blogs/${fileName}`,
            } as Post & { content: string };
          } catch (error) {
            console.error(`Error parsing file ${path}:`, error);
            return null;
          }
        });

        const validPosts = loadedPosts
          .filter((post): post is Post => post !== null)
          .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

        console.log('Final posts:', validPosts);
        setPosts(validPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  const allCategories = Array.from(new Set(posts.map(post => post.category)));

  const filteredPosts = posts.filter(post => {
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTag && matchesCategory && matchesSearch;
  });

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

  return (
    <div className="min-h-screen bg-[#0F0F1A] pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
      <style>{fadeUpKeyframes}</style>
      <Container>
        <PageTitle title="Blog" />
        
        <div className="mb-8 px-4 md:px-0">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章标题、内容或标签..."
              className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-lg
                text-white/70 placeholder:text-white/30
                focus:outline-none focus:border-indigo-500/30
                transition-colors duration-300"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="md:hidden px-4 mb-8 space-y-6">
          <TagCloud
            title="分类"
            items={allCategories}
            selectedItem={selectedCategory}
            onItemSelect={setSelectedCategory}
          />
          <TagCloud
            title="标签"
            items={allTags}
            selectedItem={selectedTag}
            onItemSelect={setSelectedTag}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow space-y-6 relative px-4 md:px-0">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.div 
                  key={post.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="text-white/40 mb-2">没有找到相关文章</div>
                <div className="text-white/20 text-sm">
                  {(selectedTag || selectedCategory || searchQuery) 
                    ? '请尝试其他筛选条件或搜索关键词' 
                    : '稍后再来看看吧~'}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block space-y-8">
            <TagCloud
              title="分类"
              items={allCategories}
              selectedItem={selectedCategory}
              onItemSelect={setSelectedCategory}
            />
            <TagCloud
              title="标签"
              items={allTags}
              selectedItem={selectedTag}
              onItemSelect={setSelectedTag}
            />
          </div>
        </div>
      </Container>
    </div>
  );
} 