import { Card, CardContent, Stack, Typography } from "@mui/material";

const StatsCard = ({ icon, title, value, subtitle }) => (
  <Card
    variant="outlined"
    sx={{
      bgcolor: "background.paper",
      borderRadius: 3,
    }}
  >
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "primary.main",
            alignItems: "center",
            justifyContent: "center",
            color: "common.white",
          }}
        >
          {icon}
        </Stack>
        <Stack>
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default StatsCard;
