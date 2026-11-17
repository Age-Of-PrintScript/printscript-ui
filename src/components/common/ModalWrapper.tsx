import {Box, Modal, SxProps, Theme} from "@mui/material";
import {ReactNode} from "react";

export const ModalWrapper = ({open, onClose, children, sx}: { open: boolean, onClose: () => void, children: ReactNode, sx?: SxProps<Theme> }) => {
  return (
      <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        <Box sx={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          ...sx,
        }}>
          {children}
        </Box>
      </Modal>
  )
}
