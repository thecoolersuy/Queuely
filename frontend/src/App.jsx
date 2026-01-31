import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </Router>
  );
}

export default App;