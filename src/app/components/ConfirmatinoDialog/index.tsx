import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItemButton, ListItemText, Paper } from "@mui/material";
import React from "react";

interface Props {
    open: boolean;
    title: string;
    content: React.ReactElement;
    primaryAction: () => void;
    secondaryAction: () => void;
    primaryLabel: string;
    secondaryLabel: string;
}

export default function DraggableDialog(props: Props) {
    const [open, setOpen] = React.useState(props.open);

    console.log({open});
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperComponent={Paper}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {props.title}
          </DialogTitle>
          <DialogContent>
            {props.content}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => {
                handleClose();
                props.secondaryAction();
            }}>
              {props.secondaryLabel}
            </Button>
            <Button onClick={() => {
                handleClose();
                props.primaryAction();
            }}>{props.primaryLabel}</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }