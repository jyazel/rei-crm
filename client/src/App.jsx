import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Board from './pages/Board';
import DealDetail from './pages/DealDetail';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Inboxes from './pages/Inboxes';
import InboxDetail from './pages/InboxDetail';
import Tasks from './pages/Tasks';
import AutoFollowup from './pages/AutoFollowup';
import Templates from './pages/Templates';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactDetail />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="boards/:id" element={<Board />} />
          <Route path="deals/:id" element={<DealDetail />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="inboxes" element={<Inboxes />} />
          <Route path="inboxes/:id" element={<InboxDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="auto-followup" element={<AutoFollowup />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
