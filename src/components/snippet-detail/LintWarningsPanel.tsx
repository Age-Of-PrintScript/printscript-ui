import {Alert, Box, Chip, List, ListItem, ListItemText, Typography} from "@mui/material";
import {ComplianceEnum, LintWarning} from "../../utils/snippet.ts";

type LintWarningsPanelProps = {
  compliance?: ComplianceEnum;
  warnings?: LintWarning[];
};

export const LintWarningsPanel = ({compliance, warnings = []}: LintWarningsPanelProps) => {
  if (!compliance) return null;

  if (compliance === 'compliant' && warnings.length === 0) {
    return (
      <Box mb={2}>
        <Alert severity="success">Linting: Compliant (0 warnings)</Alert>
      </Box>
    );
  }

  if (compliance === 'pending') {
    return (
      <Box mb={2}>
        <Alert severity="info">Linting in progress...</Alert>
      </Box>
    );
  }

  if (compliance === 'failed') {
    return (
      <Box mb={2}>
        <Alert severity="error">Linting failed</Alert>
      </Box>
    );
  }

  return (
    <Box mb={2}>
      <Alert severity="warning">
        <Typography fontWeight="bold" variant="body2" mb={warnings.length > 0 ? 1 : 0}>
          Linting: Not compliant ({warnings.length} {warnings.length === 1 ? 'warning' : 'warnings'})
        </Typography>
        {warnings.length > 0 && (
          <List dense disablePadding>
            {warnings.map((w, idx) => (
              <ListItem key={`${w.line}-${w.column}-${idx}`} disableGutters sx={{py: 0.25, gap: 1}}>
                <Chip size="small" label={`L${w.line}:${w.column}`} color="warning" variant="outlined" />
                <ListItemText primary={w.message} primaryTypographyProps={{variant: 'body2'}} />
              </ListItem>
            ))}
          </List>
        )}
      </Alert>
    </Box>
  );
};
