import {AndroidApp} from "@app-store/shared-types";
import {Box, TextField} from "@mui/material";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {getAndroidApps} from "../services/androidApps";
import {getCurrentUser} from "../services/users";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


export const AdminAppList = () => {
  const [apps, setApps] = useState<AndroidApp[]>([]);
  const [displayApps, setDisplayApps] = useState<AndroidApp[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const user = useMemo(() => getCurrentUser()?.user, []);

  const sortApps = useCallback((apps: AndroidApp[]) => {
    const filteredApps = apps.filter(
        app => app.owner?.name && app.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedApps = filteredApps.sort((a, b) => {
      if ((a.owner?.email || 0) < (b.owner?.email || 0)) {
        return -1;
      }
      if ((a.owner?.email || 0) > (b.owner?.email || 0)) {
        return 1;
      }
      return 0;
    });
    setDisplayApps(sortedApps);
  }, [searchTerm]);

  useEffect(() => {
    const fetchApps = async () => {
      const apps = await getAndroidApps();
      setApps(apps);
    };
    fetchApps();
  }, [user]);

  useEffect(() => {
    sortApps(apps);
  }, [apps, sortApps])

  return (
    <div>
      <Box
      sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
      <p>{apps.length} Student submissions.</p>

      <TextField 
        value={searchTerm} 
        placeholder="Filter by Student Name"
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)} />

      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="List of Student Apps">
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Created</TableCell>
            <TableCell align="left">App Name</TableCell>
            <TableCell align="left">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayApps.map((app) => (
            <TableRow
              key={app.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{app.owner?.name}</TableCell> 
              <TableCell align="left">{app.owner?.email}</TableCell>

              <TableCell align="left">{app.dateCreated?.toLocaleDateString()}</TableCell>
              <TableCell align="left"><Link to={`/app/${app.id}`}>{app.name}</Link></TableCell>
              <TableCell align="left">{app.description.slice(0,20)}...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      </Box>
    </div>
  );
}

