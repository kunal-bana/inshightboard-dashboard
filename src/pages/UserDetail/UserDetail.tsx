import { Grid, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import UserInfoCard from "../../components/UserInfoCard";
import UserActivityChart from "../../components/UserActivityChart";
import UserHistoryTable from "../../components/UserHistoryTable";

export default function UserDetail() {
  const { id } = useParams();

  const [user, setUser] = useState<any>(null);
  const [activity, setActivity] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then(setUser);

    fetch(`/api/users/${id}/activity`)
      .then((res) => res.json())
      .then(setActivity);

    fetch(`/api/users/${id}/history`)
      .then((res) => res.json())
      .then(setHistory);
  }, [id]);

  if (!user) {
    return <Typography>Loading user details...</Typography>;
  }

  return (
    <Box>
      <Grid container columnSpacing={3} rowSpacing={{ xs: 3, md: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <UserInfoCard user={user} />
        </Grid>
      
        <Grid size={{ xs: 12, md: 8 }}>
          <UserActivityChart data={activity} />
        </Grid>

        <Grid size={{ xs: 12}} mt={6}>
          <UserHistoryTable rows={history} />
        </Grid>
      </Grid>
    </Box>
  );
}
