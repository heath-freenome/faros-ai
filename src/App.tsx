import Box from '@mui/material/Box';

import { TopNav } from './components/TopNav';
import { Breadcrumb } from './components/Breadcrumb';
import { EmployeesPage } from './components/EmployeesPage';
import { GRAY_50_COOL } from "./constants.ts";

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      <TopNav />
      <Box sx={{ backgroundColor: GRAY_50_COOL, height: '100%' }}>
        <EmployeesPage breadcrumb={<Breadcrumb />} />
      </Box>
    </Box>
  );
}

export default App;
