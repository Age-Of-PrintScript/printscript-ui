import {useEffect, useState} from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import HistoryIcon from "@mui/icons-material/History";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useGetSnippetById, useGetSnippetVersions} from "../../utils/queries.tsx";
import {useSnackbarContext} from "../../contexts/snackbarContext.tsx";

type SnippetHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  snippetId: string;
  snippetName?: string;
  extension?: string;
};

export const SnippetHistoryModal = ({
  open,
  onClose,
  snippetId,
  snippetName = "Snippet",
  extension = "ps",
}: SnippetHistoryModalProps) => {
  const {createSnackbar} = useSnackbarContext();
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  const {data: versions, isLoading: isLoadingVersions} = useGetSnippetVersions(snippetId, open);

  useEffect(() => {
    if (versions && versions.length > 0) {
      if (selectedVersion === null || !versions.some((v) => v.version === selectedVersion)) {
        setSelectedVersion(versions[0].version);
      }
    }
  }, [versions, selectedVersion]);

  useEffect(() => {
    if (!open) {
      setSelectedVersion(null);
    }
  }, [open]);

  const {data: versionSnippet, isLoading: isLoadingContent} = useGetSnippetById(
    snippetId,
    selectedVersion ?? undefined
  );

  const currentVersionMeta = versions?.find((v) => v.version === selectedVersion);

  const handleCopyCode = async () => {
    if (!versionSnippet?.content) return;
    try {
      await navigator.clipboard.writeText(versionSnippet.content);
      createSnackbar("success", `Version ${selectedVersion} code copied to clipboard`);
    } catch {
      createSnackbar("error", "Failed to copy code");
    }
  };

  const handleDownloadVersion = () => {
    if (!versionSnippet) return;
    const blob = new Blob([versionSnippet.content], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${snippetName}_v${selectedVersion}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
    createSnackbar("success", `Downloaded version ${selectedVersion}`);
  };

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      sx={{
        width: "75vw",
        maxWidth: "960px",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Version History - {snippetName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {isLoadingVersions ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : !versions || versions.length === 0 ? (
        <Box p={4} textAlign="center">
          <Typography color="text.secondary">No versions found for this snippet.</Typography>
        </Box>
      ) : (
        <Box display="flex" gap={2} sx={{minHeight: "420px", flex: 1, overflow: "hidden"}}>
          {/* Versions list sidebar */}
          <Paper
            variant="outlined"
            sx={{
              width: "220px",
              minWidth: "200px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box p={1.5} bgcolor="grey.100">
              <Typography variant="subtitle2" fontWeight="bold">
                Versions ({versions.length})
              </Typography>
            </Box>
            <Divider />
            <List sx={{overflow: "auto", flex: 1, p: 0}}>
              {versions.map((ver) => {
                const isSelected = selectedVersion === ver.version;
                return (
                  <ListItemButton
                    key={ver.version}
                    selected={isSelected}
                    onClick={() => setSelectedVersion(ver.version)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderLeft: isSelected ? 4 : 0,
                      borderColor: "primary.main",
                      py: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography variant="body2" fontWeight={isSelected ? "bold" : "normal"}>
                            Version {ver.version}
                          </Typography>
                          {ver.isLatest && (
                            <Chip label="Latest" color="primary" size="small" sx={{height: 18, fontSize: 10}} />
                          )}
                        </Box>
                      }
                      secondary={`${ver.language} ${ver.languageVersion}`}
                      secondaryTypographyProps={{fontSize: 11}}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Paper>

          {/* Version details & code preview */}
          <Box display="flex" flexDirection="column" flex={1} sx={{overflow: "hidden"}}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              pb={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  v{selectedVersion}
                </Typography>
                {currentVersionMeta?.isLatest && (
                  <Chip label="Latest Version" color="primary" size="small" />
                )}
                <Chip label="Read-only" size="small" variant="outlined" />
              </Box>

              <Box display="flex" gap={1}>
                <Tooltip title="Copy code">
                  <IconButton
                    size="small"
                    onClick={handleCopyCode}
                    disabled={isLoadingContent || !versionSnippet}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download this version">
                  <IconButton
                    size="small"
                    onClick={handleDownloadVersion}
                    disabled={isLoadingContent || !versionSnippet}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: "#000",
                color: "#fff",
                borderRadius: "6px",
                overflow: "auto",
                border: "1px solid #333",
                minHeight: "350px",
                position: "relative",
              }}
            >
              {isLoadingContent ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  minHeight="350px"
                >
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <Editor
                  value={versionSnippet?.content ?? ""}
                  onValueChange={() => {}}
                  highlight={(code) => highlight(code, languages.js, "javascript")}
                  padding={12}
                  readOnly
                  style={{
                    fontFamily: "monospace",
                    fontSize: 15,
                    minHeight: "350px",
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end" pt={1}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>
    </ModalWrapper>
  );
};
