import {AndroidApp} from "@app-store/shared-types";
import {getAndroidApps} from "../services/androidApps";
import {useEffect, useMemo, useState} from "react";
import {Box, Button} from "@mui/material";
import {Link} from "react-router-dom";
import {getCurrentUser} from "../services/users";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export const AdminAppList = () => {
  const [apps, setApps] = useState<AndroidApp[]>([]);

  const user = useMemo(() => getCurrentUser()?.user, []);

  console.log('apps', apps);
  useEffect(() => {
    const fetchApps = async () => {
      const apps = await getAndroidApps();
      setApps(apps);
    };
    fetchApps();
  }, [user]);


  return (
    <div>
      <Box
      sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >

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
          {apps.map((app) => (
            <TableRow
              key={app.name}
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

