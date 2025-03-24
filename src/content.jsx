import { createRoot } from 'react-dom/client'
import Content from './content/Content.jsx'


const contentRoot = document.createElement("div");
contentRoot.id = "CRX-contentRoot";
document.body.appendChild(contentRoot);
const root = createRoot(contentRoot);
root.render(<Content />);
