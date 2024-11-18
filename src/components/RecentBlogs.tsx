import { useState, useEffect } from 'react';
import { BlogCard } from './BlogCard';
import { Container } from './common/Container';
import { motion } from 'framer-motion';
import { Button } from "@nextui-org/react";
import { Link } from 'react-router-dom';
import { TagCloud } from './TagCloud';

interface Post {
  title: string;
  created: string;
  updated: string;
  category: string;
  summary: string;
  tags: string[];
  path: string;
}

export function RecentBlogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const markdownFiles = import.meta.glob('../assets/posts/*.md', { 
          eager: true,
          as: 'raw'
        });
        
        const loadedPosts = Object.entries(markdownFiles).map(([path, content]) => {
          try {
            const fileName = path.split('/').pop()?.replace('.md', '');
            if (!fileName) return null;
            
            const match = (content as string).match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
            if (!match) return null;

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

            return {
              ...frontmatter,
              path: `/blogs/${fileName}`,
            } as Post;
          } catch (error) {
            return null;
          }
        });

        const validPosts = loadedPosts
          .filter((post): post is Post => post !== null)
          .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
          .slice(0, 5); // 只取最新的5篇

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

  const filteredPosts = posts
    .filter(post => {
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesTag && matchesCategory;
    })
    .slice(0, 5); // 只显示前5篇

  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <section id="recent-blogs" className="py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
      
      <Container>
        <div className="flex justify-between items-center mb-12 px-4 md:px-0">
          <h2 className="text-2xl text-white/90 font-light tracking-wider">
            最新文章
          </h2>
          <Button
            as={Link}
            to="/blogs"
            className="group relative px-4 py-2 bg-white/[0.02] border border-white/[0.05] 
              hover:border-indigo-500/30 transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-2 text-white/80 text-sm">
              查看全部
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </Button>
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
          <div className="flex-grow space-y-6 px-4 md:px-0">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-white/40 mb-2">没有找到相关文章</div>
                <div className="text-white/20 text-sm">
                  {selectedTag || selectedCategory ? '请尝试其他筛选条件' : '稍后再来看看吧~'}
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
    </section>
  );
} 