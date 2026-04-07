import Box from '@mui/material/Box';

import { TopNav } from './components/TopNav';
import { Breadcrumb } from './components/Breadcrumb';
import { EmployeesPage } from './components/EmployeesPage';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      <TopNav />
      <Breadcrumb />
      <EmployeesPage />
    </Box>
  );
}

export default App;
