import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SignUp from './components/SignUp';
import SignIn from './components/Signin';
import {Home} from './pages/Home';
import {NotFound} from './pages/NotFound';
import {NavBar} from './components/NavBar';
import {UserContextProvider} from './contexts/UserContextProvider';


export default function App() {

  return (
    <UserContextProvider>
        <BrowserRouter>
          <Container>
            <NavBar />
            <Box sx={{ my: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Container>
        </BrowserRouter>
    </UserContextProvider>
  );
}