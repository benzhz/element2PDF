import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Content from './content/Content.jsx';

const generateUniqueContent = (count) => {
    const topics = [
        "科技发展", "文学赏析", "历史事件", "艺术评论", "环境保护",
        "教育创新", "医学进步", "经济趋势", "体育赛事", "太空探索",
        "文化遗产", "心理学研究", "哲学思考", "建筑设计", "美食文化",
        "人工智能", "气候变化", "音乐理论", "生物多样性", "城市规划"
    ];

    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `主题 ${i + 1}: ${topics[i % topics.length]}`,
        content: Array.from({ length: 3 }, (_, j) => ({
            level: j + 2,
            text: `${lorem.split(' ').slice(0, 50 + Math.random() * 20).join(' ')} 
             <span>重点：${topics[(i + j) % topics.length]}的关键${j + 1}点</span>`,
            nested: j % 2 === 0 ? [
                {
                    level: j + 3,
                    text: `${lorem.split(' ').slice(0, 40 + Math.random() * 15).join(' ')} 
                 <span>嵌套内容：${topics[(i - j) % topics.length]}的细节</span>`
                }
            ] : null
        }))
    }));
};

const contentBlocks = generateUniqueContent(10);

const renderHeading = (level, text) => {
    switch (level) {
        case 2:
            return <h2>{text}</h2>;
        case 3:
            return <h3>{text}</h3>;
        case 4:
            return <h4>{text}</h4>;
        case 5:
            return <h5>{text}</h5>;
        case 6:
            return <h6>{text}</h6>;
        default:
            return <h2>{text}</h2>;
    }
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div>
            <h1>多样化测试内容</h1>
            {contentBlocks.map(block => (
                <div key={block.id} style={{ margin: '20px 0', padding: '15px', border: '1px solid #eee' }}>
                    <h2>{block.title}</h2>
                    {block.content.map(({ level, text, nested }) => (
                        <div key={level}>
                            {renderHeading(level, `Section ${level - 1}`)}
                            <p dangerouslySetInnerHTML={{ __html: text }}></p>
                            {nested && (
                                <div style={{ marginLeft: '20px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
                                    {nested.map(n => (
                                        <div key={n.level}>
                                            {renderHeading(n.level, `Nested ${n.level - 2}`)}
                                            <p dangerouslySetInnerHTML={{ __html: n.text }}></p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <Content />
    </StrictMode>
);