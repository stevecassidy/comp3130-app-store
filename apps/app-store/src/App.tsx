import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SignUp from './components/SignUp';
import SignIn from './components/Signin';
import {Home} from './pages/Home';
import {NotFound} from './pages/NotFound';
import {NavBar} from './components/NavBar';
import {UserContextProvider} from './contexts/UserContextProvider';
import {CreateApp} from './components/CreateApp';
import {AppView} from './components/AppView';
import {HelpPage} from './pages/Help';
import {AdminView} from './pages/AdminView';


export default function App() {

  return (
    <UserContextProvider>
        <BrowserRouter future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}>
          <Container>
            <NavBar />
            <Box sx={{ my: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminView />} />
                <Route path="/create" element={<CreateApp />} />
                <Route path="/edit/:appId" element={<CreateApp />} />
                <Route path="/app/:appId" element={<AppView />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Container>
        </BrowserRouter>
    </UserContextProvider>
  );
}