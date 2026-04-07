import Box from '@mui/material/Box';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { TopNav } from './components/TopNav';
import { Breadcrumb } from './components/Breadcrumb';
import { EmployeesPage } from './components/EmployeesPage';
import { FeatureFlagProvider } from './context/FeatureFlags';
import { ConsentProvider } from './context/ConsentContext';
import { theme } from './theme';
import { GRAY_50_COOL } from "./constants.ts";

/** Root application component. Wraps the full app in theme, feature-flag, and consent providers. */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeatureFlagProvider>
        <ConsentProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
          <TopNav />
          <Box sx={{ backgroundColor: GRAY_50_COOL, height: '100vh' }}>
            <EmployeesPage breadcrumb={<Breadcrumb />} />
          </Box>
        </Box>
        </ConsentProvider>
      </FeatureFlagProvider>
    </ThemeProvider>
  );
}

export default App;
