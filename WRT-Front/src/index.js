import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faStickyNote, 
  faFolder, 
  faLink, 
  faCog,
  faPlus,
  faTimes,
  faEdit,
  faTrash,
  faEye,
  faCopy,
  faExternalLinkAlt,
  faGripVertical,
  faSearch,
  faCheck,
  faChevronDown,
  faChevronRight,
  faSave
} from '@fortawesome/free-solid-svg-icons';

// Adicionar ícones à biblioteca
library.add(
  faStickyNote, 
  faFolder, 
  faLink, 
  faCog,
  faPlus,
  faTimes,
  faEdit,
  faTrash,
  faEye,
  faCopy,
  faExternalLinkAlt,
  faGripVertical,
  faSearch,
  faCheck,
  faChevronDown,
  faChevronRight,
  faSave
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
